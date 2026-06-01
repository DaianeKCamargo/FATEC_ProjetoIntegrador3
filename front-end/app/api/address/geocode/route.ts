import { NextRequest, NextResponse } from "next/server";

interface PhotonFeature {
    geometry?: {
        coordinates?: [number, number];
    };
}

async function fetchNominatimGeocode(query: string) {
    const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=br&accept-language=pt-BR&q=${encodeURIComponent(query)}`;

    const response = await fetch(url, {
        cache: "no-store",
        headers: {
            Accept: "application/json",
            "Accept-Language": "pt-BR,pt;q=0.9,en;q=0.8",
            Referer: "http://localhost:3000",
            "User-Agent": "Tampets/1.0 (local development)",
        },
    });

    if (!response.ok) {
        throw new Error(`Nominatim respondeu ${response.status}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
}

async function fetchPhotonGeocode(query: string) {
    const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(`${query}, Brasil`)}&limit=1&lang=pt`;

    const response = await fetch(url, {
        cache: "no-store",
        headers: {
            Accept: "application/json",
            "User-Agent": "Tampets/1.0 (local development)",
        },
    });

    if (!response.ok) {
        throw new Error(`Photon respondeu ${response.status}`);
    }

    const data = await response.json();
    const features = Array.isArray(data?.features) ? data.features as PhotonFeature[] : [];

    return features
        .map((feature) => {
            const coordinates = feature.geometry?.coordinates || [];
            const longitude = coordinates[0];
            const latitude = coordinates[1];

            return {
                lat: String(latitude),
                lon: String(longitude),
            };
        })
        .filter((item) => item.lat !== "undefined" && item.lon !== "undefined");
}

export async function GET(request: NextRequest) {
    const query = request.nextUrl.searchParams.get("q")?.trim();

    if (!query) {
        return NextResponse.json([], { status: 200 });
    }

    const errors: string[] = [];

    try {
        const nominatimData = await fetchNominatimGeocode(query);

        if (nominatimData.length > 0) {
            return NextResponse.json(nominatimData, { status: 200 });
        }
    } catch (error) {
        errors.push(error instanceof Error ? error.message : "Erro desconhecido no Nominatim");
    }

    try {
        const photonData = await fetchPhotonGeocode(query);
        return NextResponse.json(photonData, { status: 200 });
    } catch (error) {
        errors.push(error instanceof Error ? error.message : "Erro desconhecido no Photon");
    }

    return NextResponse.json(
        {
            message: "Nao foi possivel buscar geolocalizacao",
            details: errors,
        },
        { status: 502 }
    );
}

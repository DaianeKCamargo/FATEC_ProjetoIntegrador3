import { NextRequest, NextResponse } from "next/server";

interface PhotonFeature {
    geometry?: {
        coordinates?: [number, number];
    };
    properties?: {
        name?: string;
        street?: string;
        housenumber?: string;
        postcode?: string;
        district?: string;
        city?: string;
        state?: string;
        country?: string;
        countrycode?: string;
    };
}

async function fetchNominatimSuggestions(query: string) {
    const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=5&countrycodes=br&accept-language=pt-BR&q=${encodeURIComponent(query)}`;

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

async function fetchPhotonSuggestions(query: string) {
    const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(`${query}, Brasil`)}&limit=5&lang=pt`;

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
        .filter((feature) => {
            const countryCode = feature.properties?.countrycode?.toLowerCase();
            const country = feature.properties?.country?.toLowerCase();

            return countryCode === "br" || country === "brasil" || country === "brazil";
        })
        .map((feature) => {
            const properties = feature.properties || {};
            const coordinates = feature.geometry?.coordinates || [];
            const longitude = coordinates[0];
            const latitude = coordinates[1];
            const street = properties.street || properties.name || "";
            const displayName = [
                properties.housenumber ? `${street}, ${properties.housenumber}` : street,
                properties.district,
                properties.city,
                properties.state,
                properties.postcode,
                "Brasil",
            ].filter(Boolean).join(", ");

            return {
                display_name: displayName,
                lat: String(latitude),
                lon: String(longitude),
                address: {
                    house_number: properties.housenumber,
                    road: street,
                    suburb: properties.district,
                    city: properties.city,
                    state: properties.state,
                    postcode: properties.postcode,
                },
            };
        })
        .filter((item) => item.display_name && item.lat !== "undefined" && item.lon !== "undefined");
}

export async function GET(request: NextRequest) {
    const query = request.nextUrl.searchParams.get("q")?.trim();

    if (!query || query.length < 4) {
        return NextResponse.json([], { status: 200 });
    }

    const errors: string[] = [];

    try {
        const nominatimData = await fetchNominatimSuggestions(query);

        if (nominatimData.length > 0) {
            return NextResponse.json(nominatimData, { status: 200 });
        }
    } catch (error) {
        errors.push(error instanceof Error ? error.message : "Erro desconhecido no Nominatim");
    }

    try {
        const photonData = await fetchPhotonSuggestions(query);
        return NextResponse.json(photonData, { status: 200 });
    } catch (error) {
        errors.push(error instanceof Error ? error.message : "Erro desconhecido no Photon");
    }

    return NextResponse.json(
        {
            message: "Nao foi possivel buscar sugestoes de endereco",
            details: errors,
        },
        { status: 502 }
    );
}

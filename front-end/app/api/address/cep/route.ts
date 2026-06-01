import { NextRequest, NextResponse } from "next/server";

interface BrasilApiCepResponse {
    cep: string;
    state: string;
    city: string;
    neighborhood: string;
    street: string;
    location?: {
        coordinates?: {
            latitude?: number;
            longitude?: number;
        };
    };
}

async function fetchBrasilApiCep(cep: string) {
    const response = await fetch(`https://brasilapi.com.br/api/cep/v2/${cep}`, {
        cache: "no-store",
        headers: {
            Accept: "application/json",
        },
    });

    if (!response.ok) {
        throw new Error(`BrasilAPI respondeu ${response.status}`);
    }

    const data = await response.json() as BrasilApiCepResponse;

    return {
        cep: data.cep,
        logradouro: data.street,
        bairro: data.neighborhood,
        localidade: data.city,
        uf: data.state,
        latitude: data.location?.coordinates?.latitude ?? null,
        longitude: data.location?.coordinates?.longitude ?? null,
    };
}

export async function GET(request: NextRequest) {
    const cep = request.nextUrl.searchParams.get("cep")?.replace(/\D/g, "");
    const uf = request.nextUrl.searchParams.get("uf")?.trim();
    const city = request.nextUrl.searchParams.get("city")?.trim();
    const street = request.nextUrl.searchParams.get("street")?.trim();

    try {
        if (cep && cep.length === 8) {
            try {
                const data = await fetchBrasilApiCep(cep);
                return NextResponse.json(data, { status: 200 });
            } catch {
                const fallbackResponse = await fetch(`https://viacep.com.br/ws/${cep}/json/`, {
                    cache: "no-store",
                    headers: {
                        Accept: "application/json",
                    },
                });

                const fallbackData = await fallbackResponse.json();

                if (!fallbackResponse.ok) {
                    return NextResponse.json(
                        { message: "Falha ao buscar CEP", status: fallbackResponse.status, data: fallbackData },
                        { status: fallbackResponse.status }
                    );
                }

                return NextResponse.json(fallbackData, { status: 200 });
            }
        }

        let url = "";

        if (uf && city && street) {
            url = `https://viacep.com.br/ws/${encodeURIComponent(uf)}/${encodeURIComponent(city)}/${encodeURIComponent(street)}/json/`;
        } else {
            return NextResponse.json(
                { message: "Informe um CEP ou endereco completo para buscar" },
                { status: 400 }
            );
        }

        const response = await fetch(url, {
            cache: "no-store",
            headers: {
                Accept: "application/json",
            },
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                { message: "Falha ao buscar CEP", status: response.status, data },
                { status: response.status }
            );
        }

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        const details = error instanceof Error ? error.message : "Erro desconhecido";

        return NextResponse.json(
            { message: "Erro de rede ao buscar CEP", details },
            { status: 502 }
        );
    }
}

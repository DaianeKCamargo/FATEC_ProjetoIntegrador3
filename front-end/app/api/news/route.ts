import { NextResponse } from "next/server";

const BACKEND_BASE_URL = (
    process.env.API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:5500/api"
).replace(/\/$/, "");

export async function GET() {
    try {
        const response = await fetch(`${BACKEND_BASE_URL}/news`, {
            cache: "no-store",
            headers: {
                Accept: "application/json",
            },
        });

        const contentType = response.headers.get("content-type") || "";

        if (!contentType.includes("application/json")) {
            const rawBody = await response.text();
            return NextResponse.json(
                {
                    message: "Resposta invalida do backend",
                    status: response.status,
                    bodyPreview: rawBody.slice(0, 120),
                },
                { status: 502 }
            );
        }

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                {
                    message: "Falha ao buscar noticias no backend",
                    status: response.status,
                    data,
                },
                { status: response.status }
            );
        }

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        const details = error instanceof Error ? error.message : "Erro desconhecido";

        return NextResponse.json(
            {
                message: "Erro de rede ao acessar backend",
                details,
            },
            { status: 502 }
        );
    }
}
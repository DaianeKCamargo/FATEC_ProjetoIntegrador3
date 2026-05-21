import { NextResponse } from "next/server";

export async function GET() {
    const accessToken = process.env.IG_ACCESS_TOKEN || process.env.INSTAGRAM_ACCESS_TOKEN;
    const limit = process.env.IG_MEDIA_LIMIT || "6";

    if (!accessToken) {
        return NextResponse.json(
            {
                items: [],
                error: "Configure IG_ACCESS_TOKEN ou INSTAGRAM_ACCESS_TOKEN no ambiente.",
            },
            { status: 500 }
        );
    }

    const endpoint = new URL("https://graph.instagram.com/me/media");
    endpoint.searchParams.set(
        "fields",
        "id,caption,media_url,permalink,media_type,thumbnail_url,timestamp"
    );
    endpoint.searchParams.set("limit", limit);
    endpoint.searchParams.set("access_token", accessToken);

    try {
        const response = await fetch(endpoint.toString(), {
            cache: "no-store",
        });

        if (!response.ok) {
            const body = await response.text();
            return NextResponse.json(
                {
                    items: [],
                    error: `Instagram API returned ${response.status}: ${body}`,
                },
                { status: response.status }
            );
        }

        const data = await response.json();

        return NextResponse.json({
            items: Array.isArray(data.data) ? data.data : [],
        });
    } catch (error) {
        return NextResponse.json(
            {
                items: [],
                error: error instanceof Error ? error.message : "Erro inesperado ao buscar a API do Instagram.",
            },
            { status: 500 }
        );
    }
}

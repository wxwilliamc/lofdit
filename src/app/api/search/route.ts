import { db } from "@/lib/db"

export const GET = async (req: Request) => {
    const url = new URL(req.url)
    const query = url.searchParams.get('q')

    if(!query) return new Response("Invalid query", { status: 400 })

    const results = await db.lofdit.findMany({
        where: {
            name: {
                startsWith: query,
            },
        },
        include: {
            _count: true,
        },
        take: 5,
    })

    return new Response(JSON.stringify(results))
}
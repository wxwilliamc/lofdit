import { getAuthSession } from "@/lib/auth-options"
import { db } from "@/lib/db";
import { PostSchema } from "@/lib/validation/post-schema";

export const POST = async (req: Request) => {
    try {
        const session = await getAuthSession()

        if(!session?.user){
            return new Response("Unauthorized", { status: 401 })
        }

        const body = await req.json();
        const { lofditId, title, content } = PostSchema.parse(body)

        const isSub = await db.subscription.findFirst({
            where: {
                userId: session.user.id,
                lofditId
            }
        })

        if(!isSub){
            return new Response("Subscribe to post", { status: 400})
        }

        await db.post.create({
            data: {
                lofditId,
                authorId: session.user.id,
                title,
                content
            },
        })

        return new Response('CREATED')
    } catch (error) {
        return new Response("Failed to create post", { status: 500 })
    }
}
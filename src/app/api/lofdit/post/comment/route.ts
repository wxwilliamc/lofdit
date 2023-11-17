import { getAuthSession } from "@/lib/auth-options"
import { db } from "@/lib/db";
import { CommentSchema } from "@/lib/validation/comment-schema";

export const PATCH = async (req: Request) => {
    try {
        const session = await getAuthSession();

        if(!session){
            return new Response("Unauthorized", { status: 401 })
        }

        const body = await req.json();
        const { postId, text, replyToId } = CommentSchema.parse(body);

        await db.comment.create({
            data: {
                postId,
                text,
                authorId: session.user.id,
                replyToId
            }
        })

        return new Response("Comment Created")
    } catch (error) {
        return new Response("Failed to comment / reply", { status: 500 })
    }
}
import { getAuthSession } from "@/lib/auth-options";
import { db } from "@/lib/db";
import { redis } from "@/lib/redis";
import { PostVoteCommentSchema, PostVoteSchema } from "@/lib/validation/post-vote";
import { CachedPost } from "@/types/redis";
import { z } from "zod";

const CACHE_AFTER_UPVOTES = 1

export const PATCH = async (req: Request) => {
    try {
        const session = await getAuthSession()

        if(!session?.user){
            return new Response("Unauthorized", { status: 401 })
        }

        const body = await req.json();
        const { commentId, voteType } = PostVoteCommentSchema.parse(body);

        // Any existing vote by current user
        const votePrev = await db.commentVote.findFirst({
            where: {
                userId: session.user.id,
                commentId
            }
        })

        // If Yes, the vote will be delete if user did the same vote 
        if(votePrev){
            if(votePrev.type === voteType){
                await db.commentVote.delete({
                    where: {
                        userId_commentId: {
                            userId: session.user.id,
                            commentId
                        }
                    }
                })

                return new Response("Update Successful")
            }

            // If no, the status of vote will be update to other vote
            await db.commentVote.update({
                where: {
                    userId_commentId: {
                        userId: session.user.id,
                        commentId
                    }
                },
                data: {
                    type: voteType
                }
            })
            
            return new Response("Update Successfully")
            
        }

        await db.commentVote.create({
            data:{
                type: voteType,
                userId: session.user.id,
                commentId
            },
        })

        return new Response("Looks Good.")
    } catch (error) {
        if(error instanceof z.ZodError){
            return new Response('Invalid Post Request', { status: 422})
        }
        return new Response("Could not register your vote right now, please try again", { status: 500 })
    }
}
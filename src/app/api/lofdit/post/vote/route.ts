import { getAuthSession } from "@/lib/auth-options";
import { db } from "@/lib/db";
import { redis } from "@/lib/redis";
import { PostVoteSchema } from "@/lib/validation/post-vote";
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
        const { postId, voteType } = PostVoteSchema.parse(body);

        // Check Post Exist
        const post = await db.post.findUnique({
            where: {
                id: postId
            },
            include: {
                author: true,
                votes: true,
            }
        })

        if(!post){
            return new Response("Post not found", { status: 404 })
        }

        // Any existing vote by current user
        const votePrev = await db.vote.findFirst({
            where: {
                userId: session.user.id,
                postId
            }
        })

        // If Yes, the vote will be delete if user did the same vote 
        if(votePrev){
            if(votePrev.type === voteType){
                await db.vote.delete({
                    where: {
                        userId_postId: {
                            userId: session.user.id,
                            postId
                        }
                    }
                })

                return new Response("Update Successful")
            }

            // If no, the status of vote will be update to other vote
            await db.vote.update({
                where: {
                    userId_postId: {
                        userId: session.user.id,
                        postId
                    }
                },
                data: {
                    type: voteType
                }
            })
            
            // Update the vote total
            const votesTotal = post.votes.reduce((acc, vote) => {
                if(vote.type === 'UP') return acc + 1
                if(vote.type === 'DOWN') return acc - 1
                return acc
            }, 0)
            
            // redis
            if(votesTotal >= CACHE_AFTER_UPVOTES){
                const cachePayload: CachedPost = {
                    authorUsername: post.author.username || "",
                    content: JSON.stringify(post.content),
                    id: post.id,
                    title: post.title,
                    currentVote: voteType,
                    createdAt: post.createdAt,
                }
                
                await redis.hset(`post:${postId}`, cachePayload)
            }
            
            return new Response("Update Successfully")
            
        }

        await db.vote.create({
            data:{
                type: voteType,
                userId: session.user.id,
                postId
            },
        })

        // Update the vote total
        const votesTotal = post.votes.reduce((acc, vote) => {
            if(vote.type === 'UP') return acc + 1
            if(vote.type === 'DOWN') return acc - 1
            return acc
        }, 0)
        
        // redis
        if(votesTotal >= CACHE_AFTER_UPVOTES){
            const cachePayload: CachedPost = {
                authorUsername: post.author.username || "",
                content: JSON.stringify(post.content),
                id: post.id,
                title: post.title,
                currentVote: voteType,
                createdAt: post.createdAt,
            }
            
            await redis.hset(`post:${postId}`, cachePayload)
        }

        return new Response("Looks Good.")
    } catch (error) {
        if(error instanceof z.ZodError){
            return new Response('Invalid Post Request', { status: 422})
        }
        return new Response("Could not register your vote right now, please try again", { status: 500 })
    }
}
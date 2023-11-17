import { getAuthSession } from '@/lib/auth-options'
import { db } from '@/lib/db';
import React from 'react'
import { Separator } from './ui/separator';
import PostComment from './PostComment';
import CreateComment from './CreateComment';

interface CommentsProps {
    postId: string
}

const Comments = async ({ postId }: CommentsProps) => {

    const session = await getAuthSession();
    
    const comments = await db.comment.findMany({
        where: {
            postId
        },
        include: {
            author: true,
            votes: true,
            replies: {
                include: {
                    author: true,
                    votes: true
                }
            }
        }
    })

  return (
    <div className='flex flex-col gap-y-4 mt-4'>
        <Separator className='w-full h-px my-6'/>

        {/* Create Comment */}
        <CreateComment postId={postId} />

        {/* Comments */}
        <div className='flex flex-col gap-y-6 mt-4'>
            {comments.filter((comment) => !comment.replyToId).map((topLvlComment) => {
                const topLvlCommentVotesTotal = topLvlComment.votes.reduce((acc, vote) => {
                    if(vote.type === 'UP') return acc + 1
                    if(vote.type === 'DOWN') return acc - 1
                    return acc
                }, 0)

                const topLvlCommentVote = topLvlComment.votes.find((vote) => vote.userId === session?.user.id)

                return (
                    <div key={topLvlComment.id} className='flex flex-col'>
                        <div className='mb-2'>
                            <PostComment comment={topLvlComment} votesTotal={topLvlCommentVotesTotal} currentVote={topLvlCommentVote} postId={postId}/>
                        </div>
                    </div>
                )
            })}
        </div>
    </div>
  )
}

export default Comments
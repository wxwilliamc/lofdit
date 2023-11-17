"use client"

import React, { useRef, useState } from 'react'
import UserAvatar from './UserAvatar'
import { Comment, CommentVote, User } from '@prisma/client'
import { formatTimeToNow } from '@/lib/utils'
import CommentVotes from './CommentVotes'
import { Button } from './ui/Button'
import { MessageSquare } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'


import { useMutation } from '@tanstack/react-query'
import { CommentSchemaType } from '@/lib/validation/comment-schema'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Label } from './ui/Label'
import { Textarea } from './ui/Textarea'

type ExtendedComment = Comment & {
    votes: CommentVote[],
    author: User,
}

interface PostCommentProps {
    comment: ExtendedComment
    votesTotal: number
    currentVote: CommentVote | undefined
    postId: string
}

const PostComment = ({ comment, votesTotal, currentVote, postId }: PostCommentProps) => {

    const commentRef = useRef<HTMLDivElement>(null)
    const router = useRouter();
    const { data: session } = useSession();
    const [isReplying, setIsReplying] = useState(false)
    const [input, setInput] = useState("")

  const { mutate: replyComment, isLoading } = useMutation({
    mutationFn: async ({ postId, text, replyToId }: CommentSchemaType) => {
      const values: CommentSchemaType = {
        postId,
        text,
        replyToId,
      }

      const { data } = await axios.patch(`/api/lofdit/post/comment`, values)
      return data
    },
    onError: () => {
      toast.error("Something went wrong")
    },
    onSuccess: () => {
      router.refresh();
      setInput('');
      setIsReplying(false);
    }
  })

  return (
    <div className='flex flex-col' ref={commentRef}>
        <div className='flex items-center'>
            <UserAvatar user={{
                name: comment.author.name,
                image: comment.author.image,
            }} className='h-6 w-6'/>

            <div className='ml-2 flex items-center gap-x-2'>
                <p className='text-sm font-medium text-gray-900'>
                    u/{comment.author.name}
                </p>

                <p className='max-h-40 truncate text-xs text-zinc-500'>
                    {formatTimeToNow(new Date(comment.createdAt))}
                </p>
            </div>
        </div>

        <p className='text-sm text-zinc-900 mt-2'>
            {comment.text}
        </p>

        <div className='flex gap-2 items-center flex-wrap'>
            <CommentVotes commentId={comment.id} initialVotesTotal={votesTotal} initialVote={currentVote}/>

            <Button variant='ghost' size='xs' onClick={() => {
                if(!session) router.push('/sign-in')
                setIsReplying(true)
            }}>
                <MessageSquare className='w-4 h-4 mr-1.5'/>
                Reply
            </Button>

            {isReplying ? <>
                <div className='grid w-full gap-1.5'>
                    <Label htmlFor='comment'>
                        Your Reply
                    </Label>

                    <div className='mt-2'>
                        <Textarea id='comment' value={input} onChange={(e) => setInput(e.target.value)} rows={1} placeholder='Share your thoughts here'/>
                    
                        <div className='mt-2 flex justify-end gap-2'>
                            <Button tabIndex={-1} variant='subtle' onClick={() => setIsReplying(false)}>
                                Cancel
                            </Button>

                            <Button onClick={() => replyComment({ postId, text: input, replyToId: comment.replyToId ?? comment.id})} isLoading={isLoading} disabled={input.length === 0}>
                                Reply
                            </Button>
                        </div>
                    </div>
                </div>
            </> : <></>}
        </div>
    </div>
  )
}

export default PostComment
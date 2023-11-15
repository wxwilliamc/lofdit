import { formatTimeToNow } from '@/lib/utils'
import { Post, User, Vote } from '@prisma/client'
import { MessageSquare } from 'lucide-react'
import React, { useRef } from 'react'
import EditorOutput from './EditorOutput'
import PostVoteClient from './post-vote/PostVote-Client'

type PartialVote = Pick<Vote, 'type'>

interface PostProps {
    lofditName: string
    post: Post & {
        author: User,
        Votes: Vote[]
    }
    totalComments: number
    votesTotal: number
    currentVote?: PartialVote
}

const Post = ({ lofditName, post, totalComments, votesTotal: _votesTotal, currentVote }: PostProps) => {

    const postRef = useRef<HTMLDivElement>(null)

  return (
    <div className='rounded-md bg-white shadow'>
        <div className='px-6 py-4 flex justify-between'>
            {/* TODO: Post's Vote */}
            <PostVoteClient initialVotesTotal={_votesTotal} postId={post.id} initialVote={currentVote?.type}/>

            <div className='w-0 flex-1'>
                <div className='max-h-40 mt-1 text-xs text-gray-500'>
                    {lofditName ? (
                        <>
                            <a href={`/community/${lofditName}`} className='underline text-zinc-900 text-sm underline-offset-2'>
                                community/{lofditName}
                            </a>

                        </>
                    ) : null}
                    <span className='px-2'>
                        Posted by u/{post.author.name}
                    </span> {" "}

                    {formatTimeToNow(new Date(post.createdAt))}
                </div>

                <a href={`/community/${lofditName}/post/${post.id}`}>
                    <h1 className='text-lg font-semibold py-2 leading-6 text-gray-900'>
                        {post.title}
                    </h1>
                </a>

                <div className='relative text-sm max-h-40 w-full overflow-clip' ref={postRef}>
                    <EditorOutput content={post.content}/>

                    {/* Gradient Effect on Content */}
                    {postRef.current?.clientHeight === 160 ? (
                        <div className='absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-white to-transparent'/>
                    ) : null}
                </div>
            </div>
        </div>

        <div className='bg-gray-50 z-20 text-sm p-4 sm:px-6'>
            <a href={`/community/${lofditName}/post/${post.id}`} className='w-fit flex items-center gap-2'>
                <MessageSquare className='h-4 w-4'/>
                {totalComments} {" "}
                {totalComments > 1 ? "comments" : "comment"}
            </a>
        </div>
    </div>
  )
}

export default Post
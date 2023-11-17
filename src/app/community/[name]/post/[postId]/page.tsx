import Comments from '@/components/Comments'
import EditorOutput from '@/components/EditorOutput'
import PostVoteServer from '@/components/post-vote/PostVote-Server'
import { Button } from '@/components/ui/Button'
import { db } from '@/lib/db'
import { redis } from '@/lib/redis'
import { formatTimeToNow } from '@/lib/utils'
import { CachedPost } from '@/types/redis'
import { Post, User, Vote } from '@prisma/client'
import { ArrowBigDown, ArrowBigUp, Loader2 } from 'lucide-react'
import { notFound } from 'next/navigation'
import React, { Suspense } from 'react'

interface PageProps {
    params: {
        postId: string
    }
}

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

const page = async ({ params }: PageProps) => {

    const cachedPost = (await redis.hgetall(`post:${params.postId}`)) as CachedPost

    let post: (Post & {votes: Vote[]; author: User}) | null = null

    if(!cachedPost){
        post = await db.post.findFirst({
            where: {
                id: params.postId
            },
            include: {
                votes: true,
                author: true,
            }
        })
    }

    if(!post && !cachedPost)  return notFound()

    const getData = async () => {
        return await db.post.findUnique({
            where: {
                id: params.postId
            },
            include: {
                votes: true
            }
        })
    }

  return (
    <div>
        <div className='h-full flex flex-col sm:flex-row items-center sm:items-start justify-between'>
            <Suspense fallback={<PostVoteShell />}>
                {/* @ts-expect-error server component */}
                <PostVoteServer postId={post?.id ?? cachedPost.id} getData={getData}/>
            </Suspense>

            <div className='sm:w-0 w-full flex-1 bg-white p-4 rounded-sm'>
                <p className='max-h-40 mt-1 truncate text-xs text-gray-500'>
                    Posted by u/{post?.author.username ?? cachedPost.authorUsername} {' '}
                    {formatTimeToNow(new Date(post?.createdAt ?? cachedPost.createdAt))}
                </p>

                <h1 className='text-xl font-semibold py-2 leading-6 text-gray-900'>
                    {post?.title ?? cachedPost.title}
                </h1>

                <EditorOutput content={post?.content ?? cachedPost.content}/>

                <Suspense fallback={<Loader2 className='h-4 w-4 animate-spin text-zinc-500'/>}>
                    {/* @ts-expect-error server component */}
                    <Comments postId={post?.id ?? cachedPost.id}/>
                </Suspense>
            </div>
        </div>
    </div>
  )
}

const PostVoteShell = () => {
    return (
        <div className='flex items-center flex-col pr-6 w-20'>
            <Button variant='ghost'>
                <ArrowBigUp className='w-4 h-4 text-zinc-500'/>
            </Button>

            <div className='text-center py-2 font-medium text-sm text-zinc-900'>
                <Loader2 className='h-3 w-3 animate-spin'/>
            </div>

            <Button variant='ghost'>
                <ArrowBigDown className='w-4 h-4 text-zinc-500'/>
            </Button>
        </div>
    )
}

export default page
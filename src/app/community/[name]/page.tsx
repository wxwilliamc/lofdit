import Posts from '@/components/Posts';
import ScaledPostCreate from '@/components/ScaledPostCreate';
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from '@/config';
import { getAuthSession } from '@/lib/auth-options'
import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import React from 'react'

const page = async ({ params }: { params: { name: string }}) => {
    const { name } = params
    const session = await getAuthSession();

    const lofdit = await db.lofdit.findFirst({
        where: {
            name
        },
        include: {
            posts: {
                include: {
                    author: true,
                    votes: true,
                    comments: true,
                    lofdit: true,
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        },
        take: INFINITE_SCROLLING_PAGINATION_RESULTS
    })

    if(!lofdit) return notFound() // throw error 404

  return (
    <>
        <ScaledPostCreate session={session}/>

        {/* Todo: Show posts in user feed */}
        <Posts initialPosts={lofdit.posts} lofditName={lofdit.name}/>
    </>
  )
}

export default page
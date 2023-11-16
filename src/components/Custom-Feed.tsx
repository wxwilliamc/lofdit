import { INFINITE_SCROLLING_PAGINATION_RESULTS } from '@/config';
import { getAuthSession } from '@/lib/auth-options'
import { db } from '@/lib/db';
import React from 'react'
import Posts from './Posts';

const CustomFeed = async () => {

    const session = await getAuthSession();
    
    const joinedCommunitits = await db.subscription.findMany({
        where:{
            userId: session?.user.id
        },
        include: {
            lofdit: true
        }
    })

    const posts = await db.post.findMany({
        where: {
            lofdit: {
                name: {
                    in: joinedCommunitits.map(({ lofdit }) => lofdit.id)
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        },
        include: {
            author: true,
            comments: true,
            votes: true,
            lofdit: true,
        },
        take: INFINITE_SCROLLING_PAGINATION_RESULTS,
    })
  return (
    <Posts initialPosts={posts}/>
  )
}

export default CustomFeed
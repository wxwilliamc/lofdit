import { INFINITE_SCROLLING_PAGINATION_RESULTS } from '@/config'
import { db } from '@/lib/db'
import React from 'react'
import Posts from './Posts'

const GeneralFeed = async () => {
    const posts = await db.post.findMany({
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

export default GeneralFeed
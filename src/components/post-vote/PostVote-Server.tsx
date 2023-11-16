import { getAuthSession } from '@/lib/auth-options'
import { Post, Vote, VoteType } from '@prisma/client'
import { notFound } from 'next/navigation'
import React from 'react'
import PostVoteClient from './PostVote-Client'

interface PostVoteServerProps {
    postId: string
    initialVotesTotal?: number
    initialVote?: VoteType | null
    getData?: () => Promise<(Post & { votes: Vote[]}) | null>
}

const PostVoteServer = async ({ postId, initialVote, initialVotesTotal, getData }: PostVoteServerProps) => {

    const session = await getAuthSession();

    let _votesTotal: number = 0
    let _currentVote: VoteType | null | undefined = undefined

    if(getData){
        const post = await getData();
        if(!post) return notFound();

        _votesTotal = post.votes.reduce((acc, vote) => {
            if(vote.type === 'UP') return acc + 1
            if(vote.type === 'DOWN') return acc - 1
            return acc
        }, 0)

        _currentVote = post.votes.find((vote) => vote.userId === session?.user.id)?.type
    } else {
        _votesTotal = initialVotesTotal!
        _currentVote = initialVote
    }
  return (
    <PostVoteClient postId={postId} initialVote={_currentVote} initialVotesTotal={_votesTotal}/>
  )
}

export default PostVoteServer
'use client'

import { usePrevious } from '@mantine/hooks'
import { CommentVote, VoteType } from '@prisma/client'
import React, { useEffect, useState } from 'react'

import { ArrowBigDown, ArrowBigUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useMutation } from '@tanstack/react-query'
import { PostVoteCommentSchemaType, PostVoteSchemaType } from '@/lib/validation/post-vote'
import axios, { AxiosError } from 'axios'
import toast from 'react-hot-toast'
import { Button } from './ui/Button'

interface CommentVotesProps {
  commentId: string
  initialVotesTotal: number
  initialVote?: Pick<CommentVote, 'type'>
}

const CommentVotes = ({ commentId, initialVotesTotal, initialVote }: CommentVotesProps) => {

  const [votesTotal, setVotesTotal] = useState(initialVotesTotal)
  const [currentVote, setCurrentVote] = useState(initialVote)
  const prevVote = usePrevious(currentVote)

  const {mutate: vote} = useMutation({
    mutationFn: async (voteType : VoteType) => {
      const values: PostVoteCommentSchemaType = {
        commentId,
        voteType,
      }

      await axios.patch('/api/lofdit/post/comment/vote', values)
    },
    onError: (err, voteType) => {
      if(voteType === 'UP') setVotesTotal((prev) => prev - 1)
      else setVotesTotal((prev) => prev + 1)

      // reset current vote
      setCurrentVote(prevVote)

      if(err instanceof AxiosError){
        if(err.response?.status === 401){
          toast.error("Please Login.")
        }
      }

      return toast.error("Something went wrong. Try again.")
    },
    onMutate: (type) => {
      if(currentVote?.type === type){
        // User is voting the same way again, so remove their vote
        setCurrentVote(undefined)
        if(type === 'UP'){
          setVotesTotal((prev) => prev - 1) 
        } else if(type === 'DOWN'){
          setVotesTotal((prev) => prev + 1)
        } else {
          // User is voting in the opposite direction, so subtract 2
          setCurrentVote({type})
          if(type === 'UP'){
            setVotesTotal((prev) => prev + (currentVote ? 2 : 1))
          } else if(type === 'DOWN'){
            setVotesTotal((prev) => prev - (currentVote ? 2 : 1))
          }
        }
      }
    }
  })
  
  return (
    <div className='flex gap-1'>
      <Button size='sm' variant='ghost' aria-label='upvote' onClick={() => vote('UP')}>
        <ArrowBigUp className={cn(`h-5 w-5 text-zinc-700`, currentVote?.type === 'UP' && 'text-emerald-500 fill-emerald-500')}/>
      </Button>

      <p className='text-center py-2 font-medium text-sm text-zinc-900'>
        {votesTotal}
      </p>

      <Button size='sm' variant='ghost' aria-label='upvote' onClick={() => vote('DOWN')}>
        <ArrowBigDown className={cn(`h-5 w-5 text-zinc-700`, currentVote?.type === 'DOWN' && 'text-rose-500 fill-rose-500')}/>
      </Button>
    </div>
  )
}

export default CommentVotes
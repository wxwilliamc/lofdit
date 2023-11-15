'use client'

import { usePrevious } from '@mantine/hooks'
import { VoteType } from '@prisma/client'
import React, { useEffect, useState } from 'react'
import { Button } from '../ui/Button'
import { ArrowBigDown, ArrowBigUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useMutation } from '@tanstack/react-query'
import { PostVoteSchemaType } from '@/lib/validation/post-vote'
import axios, { AxiosError } from 'axios'
import toast from 'react-hot-toast'

interface PostVoteClientProps {
  postId: string
  initialVotesTotal: number
  initialVote?: VoteType | null // UP | DOWN
}

const PostVoteClient = ({ postId, initialVotesTotal, initialVote }: PostVoteClientProps) => {

  const [votesTotal, setVotesTotal] = useState(initialVotesTotal)
  const [currentVote, setCurrentVote] = useState(initialVote)
  const prevVote = usePrevious(currentVote)

  const {mutate: vote} = useMutation({
    mutationFn: async (voteType : VoteType) => {
      const values: PostVoteSchemaType = {
        postId,
        voteType,
      }

      await axios.patch('/api/lofdit/post/vote', values)
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
    onMutate: (type: VoteType) => {
      if(currentVote === type){
        // User is voting the same way again, so remove their vote
        setCurrentVote(undefined)
        if(type === 'UP'){
          setVotesTotal((prev) => prev - 1) 
        } else if(type === 'DOWN'){
          setVotesTotal((prev) => prev + 1)
        } else {
          // User is voting in the opposite direction, so subtract 2
          setCurrentVote(type)
          if(type === 'UP'){
            setVotesTotal((prev) => prev + (currentVote ? 2 : 1))
          } else if(type === 'DOWN'){
            setVotesTotal((prev) => prev - (currentVote ? 2 : 1))
          }
        }
      }
    }
  })

  useEffect(() => {
    setCurrentVote(initialVote)
  }, [initialVote])
  
  return (
    <div className='flex sm:flex-col gap-4 sm:gap-0 pr-6 sm:w-20 pb-4 sm:pb-0'>
      <Button size='sm' variant='ghost' aria-label='upvote' onClick={() => vote('UP')}>
        <ArrowBigUp className={cn(`h-5 w-5 text-zinc-700`, currentVote === 'UP' && 'text-emerald-500 fill-emerald-500')}/>
      </Button>

      <p className='text-center py-2 font-medium text-sm text-zinc-900'>
        {votesTotal}
      </p>

      <Button size='sm' variant='ghost' aria-label='upvote' onClick={() => vote('DOWN')}>
        <ArrowBigDown className={cn(`h-5 w-5 text-zinc-700`, currentVote === 'DOWN' && 'text-rose-500 fill-rose-500')}/>
      </Button>
    </div>
  )
}

export default PostVoteClient
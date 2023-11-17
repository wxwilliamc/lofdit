"use client"

import React, { useState } from 'react'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Button } from './ui/Button'
import { useMutation } from '@tanstack/react-query'
import { CommentSchemaType } from '@/lib/validation/comment-schema'
import axios, { AxiosError } from 'axios'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

interface CreateCommentProps {
  postId: string
  replyToId?: string
}

const CreateComment = ({ postId, replyToId }: CreateCommentProps ) => {

  const [input, setInput] = useState("")
  const router = useRouter();

  const { mutate: createComment, isLoading } = useMutation({
    mutationFn: async ({ postId, text, replyToId }: CommentSchemaType) => {
      const values: CommentSchemaType = {
        postId,
        text,
        replyToId,
      }

      const { data } = await axios.patch(`/api/lofdit/post/comment`, values)
      return data
    },
    onError: (err) => {
      if(err instanceof AxiosError){
        if(err.response?.status === 401){
          toast.error("Please Login.")
        }
      }

      toast.error("Something went wrong")
    },
    onSuccess: () => {
      router.refresh();
      setInput('')
    }
  })

  return (
    <div className='grid w-full gap-1.5'>
      <Label htmlFor='comment'>
        Your Comment
      </Label>

      <div className='mt-2'>
        <Textarea id='comment' value={input} onChange={(e) => setInput(e.target.value)} rows={1} placeholder='Share your thoughts here'/>
      
        <div className='mt-2 flex justify-end'>
          <Button onClick={() => createComment({ postId, text: input, replyToId})} isLoading={isLoading} disabled={input.length === 0}>
            Share
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CreateComment
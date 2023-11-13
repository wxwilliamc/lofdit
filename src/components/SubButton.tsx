"use client"

import React, { startTransition } from 'react'
import { Button } from './ui/Button'
import { useMutation } from '@tanstack/react-query'
import { SubscriptionValidatorSchemaType } from '@/lib/validation/schema'
import axios, { AxiosError } from 'axios'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

interface SubButtonProps {
  lofditId: string
  isSub: boolean
}

const SubButton = ({ lofditId, isSub }: SubButtonProps ) => {

  const router= useRouter();

  // Subscribe
  const {mutate: subscribe, isLoading: subscribing} = useMutation({
    mutationFn: async () => {
      const values: SubscriptionValidatorSchemaType = {
        lofditId
      }

      const { data } = await axios.post('/api/lofdit/subscribe', values)
      return data as string
    },
    onError: (err) => {
      if(err instanceof AxiosError){
        if(err.response?.status === 401){
          return toast.error("Please Login before proceed")
        }

        if(err.response?.status === 400){
            return toast.error("You have subscribed. Try refresh the page.")
        }
      }

      toast.error("Something went wrong. Try Again later.")
    },
    onSuccess: () => {
      startTransition(() => {
        router.refresh()
      })

      return toast.success("Subscribed Successful.")
    }
  })

  // Unsubscribe
  const {mutate: unSubscribe, isLoading: unSubscribing} = useMutation({
    mutationFn: async () => {
      const values: SubscriptionValidatorSchemaType = {
        lofditId
      }

      const { data } = await axios.post('/api/lofdit/unSubscribe', values)
      return data as string
    },
    onError: (err) => {
      if(err instanceof AxiosError){
        if(err.response?.status === 401){
          return toast.error("Please Login before proceed")
        }

        if(err.response?.status === 400){
            return toast.error("You are not subscribe yet.")
        }
      }

      toast.error("Something went wrong. Try Again later.")
    },
    onSuccess: () => {
      startTransition(() => {
        router.refresh()
      })

      return toast.success("UnSubscribed Successful.")
    }
  })

  return isSub ? <>
    <Button className='w-full mt-1 mb-4' onClick={() => unSubscribe()} isLoading={unSubscribing}>
      Leave Community
    </Button>
  </> : <>
    <Button className='w-full mt-1 mb-4' onClick={() => subscribe()} isLoading={subscribing}>
      Join
    </Button>
  </>
}

export default SubButton
"use client"

import React, { useState } from 'react'

import { Button } from '@/components/ui/Button'
import { useRouter } from 'next/navigation'
import { ChevronLeftIcon } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { CommunityNameSchemaType } from '@/lib/validation/schema'
import toast from 'react-hot-toast'

import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/Separator'

const CreateCommunityPage = () => {
    const [input, setInput] = useState("");
    const router = useRouter();

    const { mutate: createCommunity, isLoading } = useMutation({
        mutationFn: async () => {
            const values: CommunityNameSchemaType = {
                name: input
            }

            const { data } = await axios.post('/api/lofdit', values)
            return data as string
        },
        onError: (err) => {
            if(err instanceof AxiosError){
                if(err.response?.status === 401){
                    return toast.error("Please Login before proceed")
                }

                if(err.response?.status === 409){
                    return toast.error("Name exist. Please suggest another name")
                }

                if(err.response?.status === 422){
                    return toast.error("Please suggest a name with min 5 characters")
                }
            }

            // General Error
            toast.error("Something went wrong. Try Again later.")
        },
        onSuccess: (data) => {
            setInput('')
            toast.success("Community Created")
            setTimeout(() => {
                router.push(`/community/${data}`)
            }, 600)
        }
    })

  return (
    <div className='container flex items-center h-full max-w-3xl'>
        <div className='relative w-full h-fit p-4 rounded-lg space-y-6'>
            <div className='flex items-center justify-between'>
                <h1 className='text-xl font-semibold'>
                    Create a community
                </h1>

                {/* Should have another div here later */}
                <Button variant='ghost' onClick={() => router.push('/')}>
                    <ChevronLeftIcon className='w-4 h-4 mr-2'/>
                    Back
                </Button>
            </div>

            <Separator className='bg-slate-300'/>

            <div>
                <p className='text-lg font-medium'>
                    Name
                </p>

                <p className='text-xs pb-2'>
                    Community names including capitalization cannot be changed.
                </p>

                <div className='relative'>
                    <p className='absolute text-sm left-4 w-8 inset-y-0 flex items-center text-zinc-400'>
                        community/ 
                    </p>

                    <Input 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className='pl-24'
                    />
                </div>
            </div>

            <div className='flex justify-end'>
                <Button onClick={() => createCommunity()} isLoading={isLoading} disabled={input.length === 0}>
                    Create
                </Button>
            </div>
        </div>
    </div>
  )
}

export default CreateCommunityPage
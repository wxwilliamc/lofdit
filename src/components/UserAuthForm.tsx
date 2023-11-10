"use client"

import React, { useState } from 'react'
import { Button } from './ui/Button'
import { signIn } from 'next-auth/react'
import { FcGoogle } from 'react-icons/fc'
import toast from 'react-hot-toast'

const UserAuthForm = () => {

    const [isLoading, setIsLoading] = useState(false)

    const loginWithGoogle = async () => {
        setIsLoading(true)

        try {
            await signIn('google')
        } catch (error) {
            // toast notification
            toast.error("Try other SignIn Method or Come back later...")
        } finally {
            setIsLoading(false)
        }
    }

  return (
    <div className='flex justify-center'>
        <Button size='sm' className='w-full gap-2' onClick={loginWithGoogle} disabled={isLoading} isLoading={isLoading}>
        <FcGoogle className='text-md'/>
        Google
        </Button>
    </div>
  )
}

export default UserAuthForm
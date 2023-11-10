"use client"

import React from 'react'
import { Button } from './ui/Button'
import { X } from 'lucide-react'
import { useRouter } from 'next/navigation'

const CloseModal = () => {

    const router = useRouter()

  return (
    <Button aria-label='close modal' variant='subtle' className='h-8 w-8 p-2 rounded-md' onClick={() => router.back()}>
        <X className='h-4 w-4'/>
    </Button>
  )
}

export default CloseModal
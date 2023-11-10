import SignUp from '@/components/SignUp'
import { Button } from '@/components/ui/Button'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const SignUpPage = () => {
  return (
    <div className='absolute inset-0'>
        <div className='h-full max-w-2xl mx-auto flex flex-col items-center justify-center gap-20'>
            <Link href='/' className='self-start -mt-20'>
                <Button variant='ghost'>
                <ChevronLeft className='mr-2 h-4 w-4'/>
                    Home
                </Button>
            </Link>

            <SignUp />
        </div>
    </div>
  )
}

export default SignUpPage
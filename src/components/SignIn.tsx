import Link from 'next/link'
import React from 'react'
import UserAuthForm from './UserAuthForm'

const SignIn = () => {
  return (
    <div className='container flex w-full flex-col justify-center space-y-6 sm:w-[420px]'>
        <div className='flex flex-col space-y-4 text-center'>
            <span className='mx-auto text-2xl font-bold'>LOFDIT</span>
            <h1 className='text-2xl font-semibold tracking-tight'>Welcome Back</h1>
            <p className='text-sm max-w-sm mx-auto'>
                Share your daily experiences with the community connect to the world.
            </p>

            {/* SignIn Form */}
            <UserAuthForm />

            <p className='px-8 text-center text-sm text-zinc-800'>
                <span>New to Lofdit? {" "}</span>
                <Link href='/sign-up' className='underline underline-offset-4 hover:text-zinc-600 text-sm'>
                    Sign Up
                </Link>
            </p>
        </div>
    </div>
  )
}

export default SignIn
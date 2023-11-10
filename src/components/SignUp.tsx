import Link from 'next/link'
import React from 'react'
import UserAuthForm from './UserAuthForm'

const SignUp = () => {
  return (
    <div className='container flex w-full flex-col justify-center space-y-6 sm:w-[420px]'>
        <div className='flex flex-col space-y-4 text-center'>
            <span className='mx-auto text-2xl font-bold'>LOFDIT</span>
            <h1 className='text-2xl font-semibold tracking-tight'>First Time Here?</h1>
            <p className='text-sm max-w-sm mx-auto'>
                By continuing, you are setting up a Lofdit account and agree to our User Agreement and Privacy Policy.
            </p>

            {/* SignIn Form */}
            <UserAuthForm />

            <p className='px-8 text-center text-sm text-zinc-800'>
                <span>Already Sign Up? {" "}</span>
                <Link href='/sign-in' className='underline underline-offset-4 hover:text-zinc-600 text-sm'>
                    Sign In
                </Link>
            </p>
        </div>
    </div>
  )
}

export default SignUp
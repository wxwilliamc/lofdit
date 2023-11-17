import Link from 'next/link'
import React from 'react'
import { Button } from './ui/Button'
import { getAuthSession } from '@/lib/auth-options'
import UserAccountNav from './UserAccountNav'
import Search from './Search'

const Navbar = async () => {

    const session = await getAuthSession()

  return (
    <div className='fixed top-0 inset-x-0 h-fit bg-zinc-100 border-b border-zinc-300 z-[10] py-4'>
        {/* Logo */}
        <div className='container max-w-7xl h-full flex items-center justify-between gap-2'>
            <Link href='/'>
                <span className='hidden text-zinc-700 text-md font-medium md:block'>
                    Lofdit
                </span>
            </Link>

            {/* Search */}
            <Search />

            {/* Auth */}
            {session?.user && (
                <UserAccountNav user={session.user}/>
            )}

            {!session?.user && (
                <Link href="/sign-in">
                    <Button>
                        Sign In
                    </Button>
                </Link>
            )}
        </div>
    </div>
  )
}

export default Navbar
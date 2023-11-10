"use client"

import { User } from 'next-auth'
import React from 'react'
import { DropdownMenu, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/Dropdown-Menu'
import UserAvatar from './UserAvatar'
import { DropdownMenuContent } from '@radix-ui/react-dropdown-menu'
import Link from 'next/link'
import { signOut } from 'next-auth/react'

interface UserAccountNavProps {
    user: Pick<User, 'name' | 'email' | 'image'>
}

const UserAccountNav = ({ user }: UserAccountNavProps) => {

    const handleLogout = () => {
        signOut({
            callbackUrl: `${window.location.origin}/sign-in`
        })
    }

  return (
    <DropdownMenu>
        <DropdownMenuTrigger>
            <UserAvatar user={user} className='h-8 w-8'/>
        </DropdownMenuTrigger>

        <DropdownMenuContent className='bg-white mt-2' align='end'>
            <div className='flex items-center justify-start gap-2 p-2'>
                <div className='flex flex-col space-y-1 leading-none'>
                    {user.name && (
                        <p className='font-medium'>
                            {user.name}
                        </p>
                    )}

                    {user.email && (
                        <p className='w-[200px] truncate text-sm text-zinc-700'>
                            {user.email}
                        </p>
                    )}
                </div>
            </div>

            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
                <Link href='/' className='hover:font-semibold transition cursor-pointer'>
                    Feed
                </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
                <Link href='/create' className='hover:font-semibold transition cursor-pointer'>
                    Create Community
                </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
                <Link href='/settings' className='hover:font-semibold transition cursor-pointer'>
                    Settings
                </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem className='!text-rose-400 cursor-pointer' onClick={handleLogout}>
                Sign Out
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserAccountNav
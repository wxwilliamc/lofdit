import { User } from 'next-auth'
import React from 'react'
import { Avatar, AvatarFallback } from './ui/Avatar'
import Image from 'next/image'
import { AvatarProps } from '@radix-ui/react-avatar'

interface UserAvatarProps extends AvatarProps{
    user: Pick<User, 'name' | 'image'>
}

const UserAvatar = ({ user, ...props }: UserAvatarProps) => {
  return (
    <Avatar {...props}>
        {user.image && (
            <div className='relative aspect-square h-full w-full'>
                <Image 
                    src={user.image}
                    alt="Profile Avatar"
                    fill
                    referrerPolicy='no-referrer'
                    // Avoid some google error, and image shows always
                />
            </div>
        )}

        {!user.image && (<>
            <AvatarFallback>
                <span className='sr-only'>
                    {user?.name}
                </span>
            </AvatarFallback>
        </>)}
    </Avatar>
  )
}

export default UserAvatar
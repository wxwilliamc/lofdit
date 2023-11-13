import SubButton from '@/components/SubButton'
import SubscribeLeaveToggle from '@/components/SubButton'
import UserAvatar from '@/components/UserAvatar'
import { Button } from '@/components/ui/Button'
import { getAuthSession } from '@/lib/auth-options'
import { db } from '@/lib/db'
import { format } from 'date-fns'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { notFound, useRouter } from 'next/navigation'
import React from 'react'

interface LayoutProps {
    children: React.ReactNode
    params: {
        name: string
    }
}

const Layout = async ({ children, params }: LayoutProps ) => {

    const { name } = params
    const session = await getAuthSession();

    const lofdit = await db.lofdit.findFirst({
        where: {
            name
        },
        include: {
            posts: {
                include: {
                    author: true,
                    votes: true
                }
            },
            Creator: {
                select: {
                    image: true
                }
            }
        }
    })

    if(!lofdit) return notFound()

    const subscription = !session?.user ? undefined : await db.subscription.findFirst({
        where: {
            lofdit: {
                name
            },
            user: {
                id: session.user.id
            }
        }
    })

    const isSub = !!subscription

    const totalSub = await db.subscription.count({
        where: {
            lofdit: {
                name
            }
        }
    })

  return (
    <div className='sm:container max-w-7xl h-full pt-12'>
        <div>
            {/* Todo: Return Button */}
            <Link href='/'>
                <Button variant='ghost' className='my-2'>
                    <ChevronLeft className='w-4 h-4 mr-2'/>
                    Back
                </Button>
            </Link>
            

            <div className='flex items-center justify-between bg-white rounded-lg shadow-md px-8 py-4'>
                <div className='flex items-center'>
                    <UserAvatar user={{
                        name: lofdit?.name,
                        image: lofdit?.Creator?.image
                    }} className='w-20 h-20 mr-4'/>

                    <div className='flex flex-col'>
                        <h1 className='font-bold text-3xl '>
                            {lofdit.name}
                        </h1>

                        <span className='text-slate-500 text-xs font-semibold'>
                            community/{lofdit.name}
                        </span>
                    </div>
                </div>

                {lofdit.creatorId === session?.user.id ? <>
                    <span className='text-slate-400 text-sm'>
                        You are the owner of this community
                    </span>
                </> : null}
            </div>
            

            <div className='grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6'>
                <div className='flex flex-col col-span-2 space-y-2'>
                    {children}
                </div>

                {/* Info Sidebar */}
                <div className='hidden md:block overflow-hidden h-fit rounded-lg border border-gray-200 order-first md:order-last shadow'>
                    <div className='px-6 py-4'>
                        <p className='font-semibold py-3'>
                            About Community
                        </p>
                    </div>

                    <dl className='divide-y divide-gray-100 px-6 py-4 text-sm leading-6 bg-white'>
                        <div className='flex justify-between gap-x-4 py-3'>
                            <dt className='text-gray-500'>
                                Created
                            </dt>

                            <dd className='text-gray-700'>
                                <time dateTime={lofdit.createdAt.toDateString()}>
                                    {format(lofdit.createdAt, 'd MMMM, yyyy')}
                                </time>
                            </dd>
                        </div>

                        <div className='flex justify-between gap-4 py-3'>
                            <dt className='text-gray-500'>
                                Members
                            </dt>

                            <dd className='text-gray-700'>
                                <div className='text-gray-900'>
                                    {totalSub}
                                </div>
                            </dd>
                        </div>

                        {lofdit.creatorId !== session?.user.id ? <>
                            <SubButton lofditId={lofdit.id} isSub={isSub}/>
                        </> : null}

                        {/* TODO: if it's author, can delete the community */}
                    </dl>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Layout
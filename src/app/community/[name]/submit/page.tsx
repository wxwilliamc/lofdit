import Editor from '@/components/Editor'
import { Button } from '@/components/ui/Button'
import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import React from 'react'

const page = async ({ params }: { params: { name: string }}) => {
    const { name } = params
    const lofdit = await db.lofdit.findFirst({
        where: {
            name
        }
    })

    if(!lofdit) return notFound();

  return (
    <div className='flex flex-col items-start gap-6'>
        <div className='border-b border-gray-200 pb-5'>
            <div className='-ml-2 -mt-2 flex flex-wrap items-baseline'>
                <h3 className='ml-2 mt-2 text-base font-semibold leading-6 text-gray-900'>
                    Create Post
                </h3>

                <p className='ml-2 mt-1 truncate text-sm text-gray-500'>
                    in community/{lofdit.name}
                </p>
            </div>
        </div>

        {/* Form */}
        <Editor lofditId={lofdit.id}/>

        <div className='w-full flex justify-end'>
            <Button className='w-full' type='submit' form='lofdit-post-form'>
                Post
            </Button>
        </div>
    </div>
  )
}

export default page
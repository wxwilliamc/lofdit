import CloseModal from '@/components/Close-Modal'
import SignIn from '@/components/SignIn'
import React from 'react'

const page = () => {

    // Design Modal
  return (
    // Background
    <div className='fixed inset-0 bg-zinc-900/30 z-10'>
        {/* Modal Container */}
        <div className='container flex items-center h-full max-w-lg'>
            {/* Content Background and overall Modal layout */}
            <div className='relative bg-white w-full h-fit py-20 px-2 rounded-lg'>
                <div className='absolute top-4 right-4'>
                    <CloseModal />
                </div>

                <SignIn />
            </div>
        </div>
    </div>
  )
}

export default page
import dynamic from 'next/dynamic'
import Image from 'next/image'
import React from 'react'

const Output = dynamic(async () => 
    (await import('editorjs-react-renderer')).default,
    {
        ssr: false,
    }
)

interface EditorOutputProps {
    content: any
}

const style = {
    paragraph: {
        fontSize: '0.890rem',
        lineHeight: '1.30rem',
    }
}

const CustomImageRenderer = ({ data }: any) => {
    const src = data.file.url

    return (
        <div className='relative w-full min-h-[15rem]'>
            <Image alt='image' className='object-contain' fill src={src}/>
        </div>
    )
}

const CustomCodeRenderer = ({data}: any) => {
    return (
        <pre className='bg-gray-800 rounded-md p-4'>
            <code className='text-gray-100 text-sm'>
                {data.code}
            </code>
        </pre>
    )
}

const renderers = {
    image: CustomImageRenderer,
    code: CustomCodeRenderer,
}

const EditorOutput = ({ content }: EditorOutputProps) => {
  return (
    <Output className='text-sm' renderers={renderers} data={content} style={style}/>
  )
}



export default EditorOutput
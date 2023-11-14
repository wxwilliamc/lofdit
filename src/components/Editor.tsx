"use client"

import TextareaAutosize from 'react-textarea-autosize'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { PostSchema, PostSchemaType } from '@/lib/validation/post-schema'
import { useCallback, useEffect, useRef, useState } from 'react'
import type EditorJS from '@editorjs/editorjs'
import { uploadFiles } from '@/lib/uploadthing'
import toast from 'react-hot-toast'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { usePathname, useRouter } from 'next/navigation'

interface EditorProps {
    lofditId: string
}

const Editor = ({ lofditId }: EditorProps ) => {

    const {register, handleSubmit, formState: { errors }} = useForm<PostSchemaType>({
        resolver: zodResolver(PostSchema),
        defaultValues: {
            lofditId,
            content: null,
            title: "",
        }
    })

    const ref = useRef<EditorJS>();
    const [isMounted, setIsMounted] = useState(false);
    const _titleRef = useRef<HTMLTextAreaElement>(null);
    const pathname = usePathname();
    const router= useRouter();

    useEffect(() => {
        if(typeof window !== 'undefined'){
            setIsMounted(true)
        }
    }, [])

    const initializeEditor = useCallback(async () => {
        const EditorJS = (await import('@editorjs/editorjs')).default
        const Header = (await import('@editorjs/header')).default
        const Embed = (await import('@editorjs/embed')).default
        const Table = (await import('@editorjs/table')).default
        const List = (await import('@editorjs/list')).default
        const Code = (await import('@editorjs/code')).default
        const LinkTool = (await import('@editorjs/link')).default
        const InlineCode = (await import('@editorjs/inline-code')).default
        const ImageTool = (await import('@editorjs/image')).default

        if(!ref.current){
            const editor = new EditorJS({
                holder: 'editor',
                onReady() {
                    ref.current = editor
                },
                placeholder: "Type here to write your post...",
                inlineToolbar: true,
                data: { blocks: [] },
                tools: {
                    header: Header,
                    linkTool: {
                        class: LinkTool,
                        config: {
                            endpoint: '/api/link',
                        },
                    },
                    image: {
                        class: ImageTool,
                        config: {
                            uploader: {
                                async uploadByFile(file: File){
                                    const [ res ] = await uploadFiles([file], 'imageUploader')

                                    return {
                                        success: 1,
                                        file: {
                                            url: res.fileUrl,
                                        }
                                    }
                                },
                            },
                        },
                    },
                    list: List,
                    code: Code,
                    inlineCode: InlineCode,
                    table: Table,
                    embed: Embed,
                },
            })
        }
    }, [])

    useEffect(() => {
        const init = async () => {
            await initializeEditor()

            setTimeout(() => {
                _titleRef.current?.focus()
            }, 0)
        }

        if(isMounted){
            init()

            return () => {
                ref.current?.destroy()
                ref.current = undefined
            }
        }
    }, [isMounted, initializeEditor])

    const { mutate: createPost } = useMutation({
        mutationFn: async ({
            title,
            content,
            lofditId
        }: PostSchemaType) => {
            const values: PostSchemaType = {
                lofditId,
                title,
                content,
            }

            const { data } = await axios.post('/api/lofdit/post/create', values)
            return data
        },
        onError: () => {
            return toast.error('Something went wrong. Please try again later.')
        },
        onSuccess: () => {
            const newPathname = pathname.split('/').slice(0, -1).join('/')
            router.push(newPathname)
            router.refresh();
            
            return toast.success("Post Published. Check it with the community.")
        }
    })

    const onSubmit = async (data: PostSchemaType) => {
        const blocks = await ref.current?.save();

        const values: PostSchemaType = {
            title: data.title,
            content: blocks,
            lofditId
        }

        createPost(values)
    }

    const { ref: titleRef, ...rest } = register('title')

  return (
    <div className='w-full p-6 bg-zinc-50 rounded-lg border border-zinc-200'>
        <form id='lofdit-post-form' className='w-fit' onSubmit={handleSubmit(onSubmit)}>
            <div className='prose prose-stone dark:prose-invert'>
                <TextareaAutosize
                    ref={(e) => {
                        titleRef(e)
                        
                        //@ts-ignore
                        _titleRef.current = e
                    }}
                    {...rest}
                    placeholder='Title'
                    className='w-full resize-none appearance-none overflow-hidden bg-transparent text-4xl font-bold focus:outline-none'
                />

                <div id='editor' className='min-h-[500px]'/>
            </div>
        </form>
    </div>
  )
}

export default Editor
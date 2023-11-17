'use client'

import React, { useCallback, useState } from 'react'
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/Command'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Lofdit, Prisma } from '@prisma/client'
import { CommandEmpty } from 'cmdk'
import { useRouter } from 'next/navigation'
import { Users } from 'lucide-react'
import debounce from 'lodash.debounce'

const Search = () => {

    const [input, setInput] = useState('')
    const router = useRouter();

    // retrieve search results
    const { data: searchResults, refetch, isFetched, isFetching } = useQuery({
        queryFn: async () => {
            if(!input) return []

            const { data } = await axios.get(`/api/search?q=${input}`)
            return data as (Lofdit & {
                _count: Prisma.LofditCountOutputType
            })[]
        },
        queryKey: ['search-query'],
        enabled: false,
    })

    const searchReq = debounce(() => {
        refetch()
    }, 300)

    const debounceReq = useCallback(() => {
        searchReq()
    }, [searchReq])

  return (
    <Command className='relative rounded-lg border max-w-lg z-50 overflow-visible'>
        <CommandInput className='outline-none border-none focus:border-none focus:outline-none ring-0' placeholder='Search Communities...' value={input}
        onValueChange={(text) => { setInput(text); debounceReq()}}/>

        {input.length > 0 ? <>
            <CommandList className='absolute bg-white top-full inset-x-0 shadow rounded-b-md'>
                {isFetched && <CommandEmpty className='p-2'>No results found</CommandEmpty>}
                {(searchResults?.length ?? 0) > 0 ? (
                    <CommandGroup heading="Communities">
                        {searchResults?.map((lofdit) => (
                            <CommandItem 
                                onSelect={(result) => {
                                    router.push(`/community/${result}`)
                                    router.refresh()
                                }}
                                key={lofdit.id}
                                value={lofdit.name}
                            >
                                <Users className='mr-2 h-4 w-4'/>
                                <a href={`/community/${lofdit.name}`}>
                                    /community/{lofdit.name}
                                </a>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                ) : null}
            </CommandList>
        </> : null}
    </Command>
  )
}

export default Search
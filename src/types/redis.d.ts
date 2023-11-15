import { VoteType } from "@prisma/client"

// For faster caching
// Create a type with the most important data to load than others
export type CachedPost = {
    id: string
    title: string
    authorUsername: string
    content: string
    currentVote: VoteType | null
    createdAt: Date
}
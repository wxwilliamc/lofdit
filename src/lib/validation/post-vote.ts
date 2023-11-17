import * as z from 'zod'

export const PostVoteSchema = z.object({
    postId: z.string(),
    voteType: z.enum(['UP', 'DOWN']),
})

export type PostVoteSchemaType = z.infer<typeof PostVoteSchema>

export const PostVoteCommentSchema = z.object({
    commentId: z.string(),
    voteType: z.enum(['UP', 'DOWN']),
})

export type PostVoteCommentSchemaType = z.infer<typeof PostVoteCommentSchema>

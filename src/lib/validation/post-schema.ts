import { type } from 'os'
import * as z from 'zod'

export const PostSchema = z.object({
    title: z.string().min(3, {
        message: "Suggest longer title with min 3 characters"
    }).max(128, {
        message: "Your title was way too long..."
    }),
    lofditId: z.string(),
    content: z.any()
})

export type PostSchemaType = z.infer<typeof PostSchema>
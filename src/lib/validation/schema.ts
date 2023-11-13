import * as z from 'zod'

export const CommunityNameSchema = z.object({
    name: z.string().min(1, {
        message: "Community Name is required."
    }).min(5, {
        message: "Require min 5 characters."
    })
})

export type CommunityNameSchemaType = z.infer<typeof CommunityNameSchema>

export const SubscriptionValidatorSchema = z.object({
    lofditId: z.string()
})

export type SubscriptionValidatorSchemaType = z.infer<typeof SubscriptionValidatorSchema>
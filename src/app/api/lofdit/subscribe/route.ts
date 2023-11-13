import { getAuthSession } from "@/lib/auth-options"
import { db } from "@/lib/db";
import { SubscriptionValidatorSchema } from "@/lib/validation/schema";


export const POST = async (req: Request) => {
    try {
        const session = await getAuthSession()

        if(!session?.user){
            return new Response("Unauthorized", { status: 401 })
        }

        const body = await req.json();
        const { lofditId } = SubscriptionValidatorSchema.parse(body)

        const isSub = await db.subscription.findFirst({
            where: {
                userId: session.user.id,
                lofditId
            }
        })

        if(isSub){
            return new Response("You have already subscribe", { status: 400})
        }

        await db.subscription.create({
            data: {
                lofditId,
                userId: session.user.id
            },
        })

        return new Response(lofditId)
    } catch (error) {
        return new Response("Failed to subscribe", { status: 500 })
    }
}
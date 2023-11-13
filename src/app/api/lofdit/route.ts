import { getAuthSession } from "@/lib/auth-options"
import { db } from "@/lib/db";
import { CommunityNameSchema } from "@/lib/validation/schema";
import { z } from "zod";

export const POST = async (req: Request) => {
    try {
        const session = await getAuthSession()

        if(!session?.user){
            return new Response("Unauthorized", { status: 401 })
        }

        const body = await req.json();
        const { name } = CommunityNameSchema.parse(body)

        const lofditExist = await db.lofdit.findFirst({
            // the name is categorize as unique while create model Lofdit
            where: {
                name
            }
        })

        if(lofditExist){
            return new Response("Please suggest another name", { status: 409 })
        }

        const lofdit = await db.lofdit.create({
            data: {
                name,
                creatorId: session.user.id
            }
        })

        await db.subscription.create({
            data: {
                userId: session.user.id,
                lofditId: lofdit.id
            }
        })

        return new Response(lofdit.name)
    } catch (error: any) {
        if(error instanceof z.ZodError){
            return new Response(error.message, { status: 422})
        }
        return new Response("Failed to create lofdit", { status: 500 })
    }
}
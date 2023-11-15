import { getAuthSession } from "@/lib/auth-options";
import { db } from "@/lib/db";
import { z } from "zod";

export const GET = async (req: Request) => {
  const url = new URL(req.url);
  const session = await getAuthSession();

  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  let followedCommunitiesIds: string[] = [];

  // Check current user overall communities subscription
  if (session) {
    const followedCommunities = await db.subscription.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        lofdit: true,
      },
    });

    // paste it here
    followedCommunitiesIds = followedCommunities.map((lof) => lof.lofdit.id);
  }

  try {
    const { limit, page, lofditName } = z
      .object({
        limit: z.string(),
        page: z.string(),
        lofditName: z.string().nullish().optional(),
      })
      .parse({
        lofditName: url.searchParams.get("lofditName"),
        limit: url.searchParams.get("limit"),
        page: url.searchParams.get("page"),
    });

    let whereClause = {}

    if (lofditName) {
      whereClause = {
        lofdit: {
          name: lofditName,
        },
      }
    } else if (session) {
      whereClause = {
        lofdit: {
          id: {
            in: followedCommunitiesIds,
          },
        },
      }
    }

    const posts = await db.post.findMany({
        take: parseInt(limit),
        skip: (parseInt(page) - 1) * parseInt(limit), // skip should start from 0 for page 1
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          lofdit: true,
          votes: true,
          author: true,
          comments: true,
        },
        where: whereClause,
      })

      return new Response(JSON.stringify(posts))
  } catch (error) {
    return new Response('Could not fetch posts', { status: 500 })
  }
};

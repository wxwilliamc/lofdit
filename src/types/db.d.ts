import { Comment, Lofdit, User, Vote } from "@prisma/client"

export type ExtendedPost = Post & {
    lofdit: Lofdit,
    votes: Vote[],
    author: User,
    comments: Comment[]
}
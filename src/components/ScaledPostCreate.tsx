"use client"

import { Session } from "next-auth"
import { usePathname, useRouter } from "next/navigation";
import UserAvatar from "./UserAvatar";
import { Input } from "./ui/input";
import { Button } from "./ui/Button";
import { ImageIcon, Link2 } from "lucide-react";

interface ScaledPostCreateProps {
    session: Session | null
}

const ScaledPostCreate = ({ session }: ScaledPostCreateProps) => {

    const router = useRouter();
    const pathname = usePathname();

  return (
    <div className="overflow-hidden rounded-md bg-white shadow">
        <div className="h-full px-8 py-6 flex justify-between gap-6">
            <div className="relative">
                <UserAvatar user={{
                    name: session?.user.name,
                    image: session?.user.image
                }}/>
                
                <span className="absolute bottom-0 right-0 rounded-full w-4 h-4 bg-green-500 border-[2.5px] border-white"/>
            </div>

            <Input readOnly onClick={() => router.push(pathname + '/submit')} placeholder="Create Post" className="cursor-pointer"/>

            <Button onClick={() => router.push(pathname + '/submit')} variant='ghost'>
                <ImageIcon className="text-zinc-600"/>
            </Button>

            <Button onClick={() => router.push(pathname + '/submit')} variant='ghost'>
                <Link2 className="text-zinc-600"/>
            </Button>
        </div>
    </div>
  )
}

export default ScaledPostCreate
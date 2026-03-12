"use client"

import { LinkGoogleAccount } from "@/app/(pages)/(private)/settings/link-google-account"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardDescription, CardFooter, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { getInitials } from "@/functions/get-initials"
import { authClient } from "@/lib/auth-client"
import { Ellipsis } from "lucide-react"

export function UserProfileCard() {

    const { data: session } = authClient.useSession()

    if (!session) {
        return (
            <Card className="w-1/2 rounded-2xl pt-0 overflow-hidden">
                <div className="w-full h-64 border-b flex relative">
                    <div className="size-full bg-secondary" />
                </div>
                <div className="size-full gap-0 -translate-y-16 px-6 space-y-4">
                    <Avatar className="size-20 border">
                        <AvatarImage />
                        <AvatarFallback className="scale-100">
                            <Ellipsis />
                        </AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                        <CardTitle className="capitalize">
                            <Skeleton className="h-6" />
                        </CardTitle>
                        <CardDescription>
                            <Skeleton className="h-4 w-2/3" />
                        </CardDescription>
                    </div>
                </div>
            </Card>
        )
    }

    const { user } = session

    const { image, name, email } = user

    console.log(image)

    return (
        <Card className="w-1/2 rounded-2xl pt-0 overflow-hidden">
            <div className="w-full h-32 border-b flex relative ">
                <div className="size-full bg-secondary" />
            </div>
            <div className="w-full gap-0 -translate-y-16 px-6 space-y-4">
                <Avatar className="size-20 border">
                    {
                        image && (
                            <AvatarImage
                                src={image}
                                alt={`Avatar do usuário ${name}`}
                                className="object-cover"
                            />
                        )
                    }
                    <AvatarFallback className="scale-250">
                        {getInitials(name)}
                    </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                    <CardTitle className="capitalize">
                        {name}
                    </CardTitle>
                    <CardDescription>
                        {email}
                    </CardDescription>
                </div>
            </div>
            <Separator className="data-[orientation=horizontal]:w-[94%] mx-auto" />
            <CardFooter className="px-0">
                <LinkGoogleAccount />
            </CardFooter>
        </Card>
    )
}

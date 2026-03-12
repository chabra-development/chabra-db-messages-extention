import { findAttendantsById } from "@/actions/attendants/find-attendants-by-id"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { CardFooter } from "@/components/ui/card"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { getInitials } from "@/functions/get-initials"
import { Prisma } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"
import { Ellipsis } from "lucide-react"

type FindAttendantsByIdPaylod = Prisma.UserGetPayload<{
    select: {
        name: true,
        email: true,
    }
}>

export const TagClienFooter = ({ createdById }: { createdById: string }) => {

    const { data: user, isLoading } = useQuery({
        queryKey: ["find-user-by-id", createdById],
        queryFn: () => findAttendantsById<FindAttendantsByIdPaylod>(createdById, {
            select: {
                name: true,
                email: true
            }
        })
    })

    if (!user || isLoading) {
        return (
            <CardFooter className="gap-2">
                Criado por:
                <Avatar>
                    <AvatarFallback>
                        <Ellipsis />
                    </AvatarFallback>
                </Avatar>
            </CardFooter>
        )
    }

    const { email, name } = user

    return (
        <CardFooter className="gap-2">
            Criado por:
            <Tooltip>
                <TooltipTrigger>
                    <Avatar>
                        <AvatarFallback>
                            {getInitials(name)}
                        </AvatarFallback>
                    </Avatar>
                </TooltipTrigger>
                <TooltipContent align="start">
                    {email}
                </TooltipContent>
            </Tooltip>
        </CardFooter>
    )
}
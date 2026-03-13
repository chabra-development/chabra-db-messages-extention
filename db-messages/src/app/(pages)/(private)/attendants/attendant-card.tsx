import { Badge } from "@/components/ui/badge"
import {
    Card,
    CardAction,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import type { User } from "@prisma/client"
import { motion } from "framer-motion"
import { ChangeRoleUserDialog } from "./change-role-attendants"

type AttendantCardProps = {
    index: number
    attendant: User
}

const cardVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.05, duration: 0.25 },
    }),
}

export const AttendantCard = ({
    index,
    attendant
}: AttendantCardProps) => {

    const {
        id,
        name,
        email,
        role,
        teams
    } = attendant

    function translateRole(role: string | null) {

        if (!role) return {
            title: "",
            className: ""
        }

        if (role === "ADMIN") {
            return {
                title: "Administrador",
                className: "bg-green-600"
            }
        } else if (role === "SUPERVISOR") {
            return {
                title: "Supervisor",
                className: "bg-amber-600"
            }
        }

        return {
            title: "Atendente",
            className: "bg-violet-700"
        }
    }

    const { title, className } = translateRole(role)

    return (
        <motion.div
            layout
            initial="hidden"
            animate="visible"
            custom={index}
            variants={cardVariants}
        >
            <Card className="h-full justify-between">
                <CardHeader>
                    <CardTitle className="capitalize text-xl">
                        {name}
                    </CardTitle>
                    <div className="flex items-center w-full gap-2.5">
                        <CardDescription>
                            {email}
                        </CardDescription>
                        <Badge className={cn("text-zinc-50", className)}>
                            {title}
                        </Badge>
                    </div>
                    <CardAction>
                        <ChangeRoleUserDialog user={attendant} />
                    </CardAction>
                </CardHeader>
                <ScrollArea className={cn(
                    teams.length > 3 ? "h-36" : "h-20"
                )}>
                    <CardFooter className="flex flex-wrap h-full gap-2.5 items-start px-4 py-4 mx-6 border rounded-lg text-xs drop-shadow-2xl">
                        {teams.length === 0 ? (
                            <Badge
                                variant={"secondary"}
                                className="w-fit px-3 py-2 rounded-md text-center whitespace-normal"
                            >
                                Sem listas adicionadas
                            </Badge>
                        ) : (
                            teams.map((team, index) => (
                                <Badge
                                    key={`${id}-${team}-${index}`}
                                    className="w-fit px-3 py-2 rounded-md text-center whitespace-normal"
                                >
                                    {team}
                                </Badge>
                            ))
                        )}
                    </CardFooter>
                </ScrollArea>
            </Card>
        </motion.div>
    )
}

import { findManyTags } from "@/actions/tags/find-many-tags"
import { UserProfileCard } from "@/app/(pages)/(private)/settings/user-profile-card"
import { ChooseBackground } from "@/components/choose-background"
import { ChooseATheme } from "@/components/choose-theme"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { auth } from "@/lib/auth"
import { cn } from "@/lib/utils"
import { Metadata } from "next"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
	title: "Configurações | Stock App",
}

export default async function SettingsPage() {

	const session = await auth.api.getSession({
		headers: await headers(),
	})

	if (!session) redirect("/sign-in")

	const tags = await findManyTags()

	return (
		<main className="h-dvh w-full flex items-center justify-center py-4">
			<Card className={cn(
				"w-4/5 h-5/6 justify-between border-primary mx-auto",
				"lg:w-3/5"
			)}>
				<ScrollArea className="size-full bg-transparent contents">
					<div className="size-full space-y-4">
						<CardHeader>
							<CardTitle className="text-2xl">
								Configurações
							</CardTitle>
							<CardDescription>
								Altere as configurações padrões do sistema
							</CardDescription>
						</CardHeader>
						<div className="w-full flex gap-2 px-6">
							<UserProfileCard />
						</div>
						<CardContent className="size-full flex flex-col gap-2">
							<Card>
								<CardHeader>
									<CardTitle className="text-lg truncate">
										Escolha o background
									</CardTitle>
								</CardHeader>
								<CardContent>
									<ChooseBackground />
								</CardContent>
							</Card>
							<Card className="w-full h-max">
								<CardHeader>
									<CardTitle className="text-lg truncate">
										Escolha o tema
									</CardTitle>
								</CardHeader>
								<CardContent>
									<ChooseATheme />
								</CardContent>
							</Card>
						</CardContent>
					</div>
				</ScrollArea>
			</Card>
		</main>
	)
}

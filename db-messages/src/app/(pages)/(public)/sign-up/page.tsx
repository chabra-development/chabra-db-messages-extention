import { FormSignUp } from "@/components/forms/form-sign-up"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

export const metadata = {
	title: "Chabra Tasks | Cadastrar usuário",
}

export default async function SignUpPage() {
	return (
		<main
			className={cn(
				"h-dvh flex items-center justify-center p-8",
				"max-sm:px-4"
			)}>
			<Card className={cn("w-full justify-between border-primary", "xl:w-2/5")}>
				<CardHeader>
					<CardTitle className="text-2xl">Sign Up</CardTitle>
					<CardDescription>Cadastre-se no sistema</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<FormSignUp />
				</CardContent>
			</Card>
		</main>
	)
}

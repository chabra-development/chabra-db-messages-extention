"use client"

import { signUpEmail } from "@/actions/better-auth/sign-up"
import { SpanErrorMessage } from "@/components/span-error"
import { toast } from "@/components/toast"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { signUpSchema, type FormSignUpProps } from "@/schemas/sign-up-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"

export const FormSignUp = () => {

	const [visible, setVisible] = useState(false)

	const form = useForm<FormSignUpProps>({
		mode: "onSubmit",
		reValidateMode: "onChange",
		resolver: zodResolver(signUpSchema),
	})

	const {
		handleSubmit,
		register,
		formState: { errors },
	} = form

	const { push } = useRouter()

	const {
		mutate,
		isPending: isLoading
	} = useMutation({
		mutationKey: ["sign-up-email"],
		mutationFn: signUpEmail,
		onSuccess: () => {
			toast({
				title: "Usuário criado com sucesso",
				onAutoClose: () => push("/sign-in"),
			})
		},
		onError: (error: Error) => {
			toast({
				title: "Erro",
				description: error.message ?? "Erro ao criar usuário",
				variant: "destructive",
			})
		},
	})

	async function onSubmit({ email, password }: FormSignUpProps) {
		mutate({ 
			email, 
			password, 
			identity: "", 
			teams: [] 
		})
	}

	return (
		<Form {...form}>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="space-y-4 flex flex-col">
				<div className="space-y-2">
					<Input
						placeholder="name@email.com"
						{...register("email")}
						className={cn(
							errors.email && [
								"focus-visible:ring-destructive",
								"not-focus-visible:border-destructive",
							]
						)}
					/>
					{errors.email && <SpanErrorMessage message={errors.email.message} />}
				</div>
				<div className="space-y-2">
					<Input
						type={visible ? "text" : "password"}
						placeholder="**********"
						{...register("password")}
						className={cn(
							errors.password && [
								"focus-visible:ring-destructive",
								"not-focus-visible:border-destructive",
							]
						)}
					/>
					{errors.password && (
						<SpanErrorMessage message={errors.password.message} />
					)}
				</div>
				<div className="space-y-2">
					<Input
						type={visible ? "text" : "password"}
						placeholder="**********"
						{...register("confirmPassword")}
						className={cn(
							errors.confirmPassword && [
								"focus-visible:ring-destructive",
								"not-focus-visible:border-destructive",
							]
						)}
					/>
					{errors.confirmPassword && (
						<SpanErrorMessage message={errors.confirmPassword.message} />
					)}
					<Button
						type="button"
						variant={"link"}
						className="p-0"
						onClick={() => setVisible(visible => !visible)}>
						{visible ? "esconder senha" : "mostrar senha"}
					</Button>
				</div>
				<Button asChild type="button" variant={"link"} className="w-full">
					<Link href="/sign-in" prefetch={false}>
						Já tenho conta
					</Link>
				</Button>
				<Separator />
				<Button type="submit" className="w-1/2 self-end" disabled={isLoading}>
					{isLoading ? <Loader2 className="animate-spin" /> : "Confirmar"}
				</Button>
			</form>
		</Form>
	)
}

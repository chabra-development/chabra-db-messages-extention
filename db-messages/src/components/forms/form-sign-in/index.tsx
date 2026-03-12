"use client"

import { signInEmail } from "@/actions/better-auth/sign-in"
import { SpanErrorMessage } from "@/components/span-error"
import { toast } from "@/components/toast"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { signInSchema, type FormSignProps } from "@/schemas/sign-in-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { GoogleLoginButton } from "./google-sign-up-button"

export const FormSign = () => {

	const { push } = useRouter()

	const [visible, setVisible] = useState(false)

	const { mutate, isPending: isLoading } = useMutation({
		mutationKey: ["sign-in-email"],
		mutationFn: signInEmail,
		onSuccess: (data) => {
			console.log(data)
			push("/contacts")
		},
		onError: (error) => {

			console.log(error)

			toast({
				title: "Error no login",
				description: "Senha ou email inválidos.",
				variant: "destructive",
			})
		},

	})

	const form = useForm<FormSignProps>({
		mode: "onSubmit",
		reValidateMode: "onChange",
		resolver: zodResolver(signInSchema),
	})

	const {
		handleSubmit,
		register,
		formState: { errors },
	} = form

	async function onSignInSubmit({ email, password }: FormSignProps) {
		mutate({ email, password })
	}

	return (
		<Form {...form}>
			<form
				onSubmit={handleSubmit(onSignInSubmit)}
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
					{
						errors.email && (
							<SpanErrorMessage message={errors.email.message} />
						)
					}
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
					{
						errors.password && (
							<SpanErrorMessage message={errors.password.message} />
						)
					}
					<Button
						type="button"
						variant={"link"}
						className="p-0"
						onClick={() => setVisible(visible => !visible)}>
						{visible ? "esconder senha" : "mostrar senha"}
					</Button>
				</div>
				<Button asChild type="button" variant={"link"} className="w-full">
					<Link href="/sign-up">Criar uma conta</Link>
				</Button>
				<span className="block mx-auto">
					ou
				</span>
				<GoogleLoginButton className="w-2/3 mx-auto" />
				<Button
					type="submit"
					className="w-1/2 self-end mt-4"
					disabled={isLoading}>
					{isLoading ? <Loader2 className="animate-spin" /> : "Confirmar"}
				</Button>
			</form>
		</Form>
	)
}

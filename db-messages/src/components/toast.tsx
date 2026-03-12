import { CheckCircle, XCircle } from "lucide-react"
import { toast as toastPrimitive, type ExternalToast } from "sonner"

type ToastProps = ExternalToast & {
	title: string
	description?: string
	variant?: "success" | "destructive"
}

export const toast = ({
	title,
	description,
	variant = "success",
	duration = 2000,
	...props
}: ToastProps) =>
	toastPrimitive(title, {
		duration,
		description: <span className="text-muted-foreground">{description}</span>,
		icon:
			variant === "success" ? (
				<CheckCircle className="size-4 text-primary" />
			) : (
				<XCircle className="size-4 text-destructive" />
			),
		...props,
	})

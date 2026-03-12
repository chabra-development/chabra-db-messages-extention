import { cn } from "@/lib/utils"
import { Info } from "lucide-react"
import { ComponentProps } from "react"

type SpanErrorMessageProps = ComponentProps<"div"> & {
	message: string | undefined
	size?: number
}

export const SpanErrorMessage = ({
	message,
	className,
	size,
	...props
}: SpanErrorMessageProps) => {
	return (
		<div
			className={cn(
				"text-destructive text-xs flex gap-2 items-center pt-1.5",
				className
			)}
			{...props}>
			<Info className={cn(size ? `size-${size}` : "size-4")} />
			<span>{message}</span>
		</div>
	)
}

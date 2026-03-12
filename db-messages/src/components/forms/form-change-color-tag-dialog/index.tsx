import { updateColorTag } from "@/actions/tags/update-color-tag"
import { toast } from "@/components/toast"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { colors } from "@/constraints/colors"
import { cn } from "@/lib/utils"
import { queryClient } from "@/providers/theme-provider"
import {
	ChangeColorListProps,
	changeColorTagSchema,
} from "@/schemas/change-color-tag-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { Check } from "lucide-react"
import { useForm } from "react-hook-form"

export const FormChangeColorTagDialog = ({
	id,
	onOpenChange,
}: {
	id: string
	onOpenChange: (open: boolean) => void
}) => {
	const { mutate } = useMutation({
		mutationKey: ["change-color-tag"],
		mutationFn: updateColorTag,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["find-many-tags"],
			})
			onOpenChange(false)
		},
		onError: error => {
			toast({
				title: error.name,
				description: error.message,
				variant: "destructive",
			})
		},
	})

	const { setValue, watch, handleSubmit } = useForm<ChangeColorListProps>({
		resolver: zodResolver(changeColorTagSchema),
		defaultValues: {
			color: undefined,
		},
	})

	const currentColor = watch("color")

	function onSubmit({ color }: ChangeColorListProps) {
		mutate({ color, id })
	}

	return (
		<>
			<ScrollArea>
				<ScrollBar />
				<form
					id="form-change-tag-color"
					onSubmit={handleSubmit(onSubmit)}
					className="grid grid-cols-4 gap-3 h-100">
					{colors.map(color => (
						<div
							key={color}
							style={{
								background: color,
							}}
							className={cn(
								"size-24 rounded-sm duration-200",
								"hover:scale-90",
								color === currentColor &&
								"flex items-center justify-center border-4 border-primary"
							)}
							onClick={() => setValue("color", color)}>
							<Check
								className={cn(
									color === currentColor ? "visible size-10" : "invisible"
								)}
							/>
						</div>
					))}
				</form>
			</ScrollArea>
		</>
	)
}

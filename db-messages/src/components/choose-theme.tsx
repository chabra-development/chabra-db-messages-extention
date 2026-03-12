"use client"

import { useEffect, useId, useState } from "react"
import { CheckIcon, MinusIcon } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import Image from "next/image"

const items = [
	{ value: "light", label: "Light", image: "/ui-light.png" },
	{ value: "dark", label: "Dark", image: "/ui-dark.png" },
	{ value: "system", label: "System", image: "/ui-system.png" },
]

export const ChooseATheme = () => {
	
	const id = useId()
	const { setTheme, theme } = useTheme()

	const [isMounted, setIsMounted] = useState(false)

	useEffect(() => {
		setIsMounted(true)
	}, [])

	if (!isMounted) {
		return (
			<div className="flex justify-evenly gap-3">
				{items.map(({ image, label, value }) => (
					<label key={value}>
						<Image
							src={image}
							alt={label}
							priority={false}
							width={88}
							height={70}
							className="border-input peer-focus-visible:ring-ring/50 peer-data-[state=checked]:border-ring peer-data-[state=checked]:bg-accent relative cursor-pointer overflow-hidden rounded-md border shadow-xs transition-[color,box-shadow] outline-none peer-focus-visible:ring-[3px] peer-data-disabled:cursor-not-allowed peer-data-disabled:opacity-50 size-30"
						/>
						<span className="group peer-data-[state=unchecked]:text-muted-foreground/70 mt-2 flex items-center gap-1">
							<MinusIcon className="group-peer-data-[state=checked]:hidden size-4" />
							<span className="text-xs font-medium">{label}</span>
						</span>
					</label>
				))}
			</div>
		)
	}

	return (
		<RadioGroup
			className="flex justify-evenly gap-3"
			defaultValue={theme}
			onValueChange={value => setTheme(value)}>
			{
				items.map(({ image, label, value }) => {

					const Icon = theme === value ? CheckIcon : MinusIcon

					return (
						<label key={value} className={cn(theme === value && "text-primary")}>
							<RadioGroupItem
								id={`${id}-${value}`}
								value={value}
								className="peer sr-only after:absolute after:inset-0"
							/>
							<img
								src={image}
								alt={label}
								width={88}
								height={70}
								className={cn(
									"border-input peer-focus-visible:ring-ring/50 relative cursor-pointer overflow-hidden rounded-md border shadow-2xl transition-[color,box-shadow] outline-none peer-focus-visible:ring-[3px] size-30",
									theme === value
										? "border-primary text-primary"
										: "peer-data-disabled:cursor-not-allowed peer-data-disabled:opacity-50"
								)}
							/>
							<span className="group peer-data-[state=unchecked]:text-muted-foreground/70 mt-2 flex items-center gap-1">
								<Icon className="size-4" />
								<span className="text-xs font-medium">{label}</span>
							</span>
						</label>
					)
				})
			}
		</RadioGroup>
	)
}

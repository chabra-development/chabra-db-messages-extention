"use client"

import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"
import { useBackgroundTheme } from "@/providers/background-provider"
import { setCookie } from "cookies-next/client"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Skeleton } from "./ui/skeleton"

export const LIGHT_RAYS_COLORS = [
	{
		theme: "light",
		colors: [
			{ name: "muted", value: "rgba(156, 163, 175, 0.35)" },
			{ name: "primary", value: "rgba(36, 36, 41, 0.18)" },
			{ name: "accent", value: "rgba(99, 102, 241, 0.25)" },
			{ name: "ring", value: "rgba(180, 183, 194, 0.4)" },
			{ name: "border", value: "rgba(229, 231, 235, 0.5)" },
		],
	},
	{
		theme: "dark",
		colors: [
			{ name: "muted", value: "rgba(255, 255, 255, 0.05)" },
			{ name: "primary", value: "rgba(235, 235, 240, 0.08)" },
			{ name: "accent", value: "rgba(124, 58, 237, 0.15)" },
			{ name: "ring", value: "rgba(141, 145, 167, 0.2)" },
			{ name: "border", value: "rgba(255, 255, 255, 0.08)" },
		],
	},
]

export const ChooseBackground = () => {

	const { backgroundTheme, setBackgroundTheme } = useBackgroundTheme()

	const { theme, systemTheme } = useTheme()

	const currentTheme = theme === "system" ? systemTheme : theme

	const themes = LIGHT_RAYS_COLORS.find(color => color.theme === currentTheme)

	const [isMounted, setIsMounted] = useState(false)

	useEffect(() => {
		setIsMounted(true)
	}, [])

	if (!isMounted || !themes) {
		return null
	}

	function changeColorChecked(value: string) {
		setBackgroundTheme(value)
		setCookie("background-theme", value)
	}

	return (
		<RadioGroup
			className="flex justify-evenly gap-3"
			value={backgroundTheme}
			onValueChange={changeColorChecked}
		>
			{
				themes.colors.map(({ name, value }) => (
					<Label
						key={value}
						htmlFor={value}
					>
						<RadioGroupItem
							id={value}
							value={name}
							className="sr-only after:absolute after:inset-0"
						/>
						<div className="w-full flex flex-col items-center gap-1.5">
							<div
								className={cn(
									"size-8 rounded-full",
									name === backgroundTheme && "border-2 border-primary"
								)}
								style={{
									background: value
								}}
							/>
							<span className={cn(
								value === backgroundTheme && "font-bold"
							)}>
								{name}
							</span>
						</div>
					</Label>
				))
			}
		</RadioGroup >
	)
}

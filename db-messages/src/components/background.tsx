"use client"

import { LightRays } from "@/components/ui/light-rays"
import { useLightRaysColor, Variant } from "@/hooks/use-light-rays-color"
import { useBackgroundTheme } from "@/providers/background-provider"
import { LayoutProps } from "@/types/index.types"

export const Background = ({ children }: LayoutProps) => {

	const { backgroundTheme } = useBackgroundTheme() as { backgroundTheme: Variant }

	const lightRaysColor = useLightRaysColor(backgroundTheme ?? "accent")

	return (
		<div className="relative h-screen w-full max-w-full min-w-0 z-0 overflow-hidden">
			<LightRays speed={30} color={lightRaysColor} />
			<div className="w-full h-full max-w-full min-w-0 overflow-hidden">
				{children}
			</div>
		</div>
	)
}
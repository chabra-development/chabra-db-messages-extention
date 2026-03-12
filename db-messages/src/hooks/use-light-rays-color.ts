"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export type Variant = "muted" | "primary" | "accent" | "ring"

export const colors = {
  light: {
    // Opções para tema claro (mais visíveis)
    muted: "rgba(156, 163, 175, 0.35)",      // Cinza suave mais visível
    primary: "rgba(36, 36, 41, 0.18)",       // Primary mais visível
    accent: "rgba(99, 102, 241, 0.25)",      // Roxo/Azul mais visível
    ring: "rgba(180, 183, 194, 0.4)",        // Ring mais visível
  },
  dark: {
    // Opções para tema escuro (mantém suave)
    muted: "rgba(255, 255, 255, 0.05)",      // Branco suave
    primary: "rgba(235, 235, 240, 0.08)",    // Primary suave
    accent: "rgba(124, 58, 237, 0.15)",      // Roxo suave
    ring: "rgba(141, 145, 167, 0.2)",        // Ring suave
  }
}

export const useLightRaysColor = (value: Variant) => {

  const { theme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Evita hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Retorna cor neutra durante SSR
    return "rgba(156, 163, 175, 0.35)"
  }

  const currentTheme = theme === "system" ? systemTheme : theme

  // Cores que casam com shadcn-ui

  // Retorna a cor baseada no tema
  return currentTheme === "dark" ? colors.dark[value] : colors.light[value]
}

/**
 * Cores em RGBA convertidas das variáveis OKLCH do shadcn-ui
 * Constantes para uso direto (sem hook)
 */
export const LIGHT_RAYS_COLORS = {
  // Tema Claro (mais visíveis)
  light: {
    muted: "rgba(156, 163, 175, 0.35)",      // Cinza suave mais visível
    primary: "rgba(36, 36, 41, 0.18)",       // Primary mais visível
    accent: "rgba(99, 102, 241, 0.25)",      // Roxo/Azul mais visível
    ring: "rgba(180, 183, 194, 0.4)",        // Ring mais visível
    border: "rgba(229, 231, 235, 0.5)",      // Border
  },

  // Tema Escuro (suave)
  dark: {
    muted: "rgba(255, 255, 255, 0.05)",      // Branco suave
    primary: "rgba(235, 235, 240, 0.08)",    // Primary suave
    accent: "rgba(124, 58, 237, 0.15)",      // Roxo suave
    ring: "rgba(141, 145, 167, 0.2)",        // Ring suave
    border: "rgba(255, 255, 255, 0.08)",     // Border
  }
} as const

/**
 * Função helper para obter cor baseada no tema (sem hook)
 */
export const getLightRaysColor = (
  theme: "light" | "dark" | undefined,
  variant: Variant = "muted"
): string => {
  const currentTheme = theme || "light"
  return LIGHT_RAYS_COLORS[currentTheme][variant]
}
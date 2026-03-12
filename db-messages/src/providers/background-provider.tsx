"use client"

import { Background as BackgroundComponent } from "@/components/background"
import { getCookie } from "cookies-next/client"
import {
    ReactNode,
    createContext,
    useContext,
    useState
} from "react"

type BackgroundContextProps = {
    backgroundTheme: string | undefined
    setBackgroundTheme: (variant: string | undefined) => void
}

const BackgroundContext = createContext({} as BackgroundContextProps)

export function BackgroundProvider({ children }: { children: ReactNode }) {

    const backgroundCookie = getCookie("background-theme") ?? undefined

    const [
        backgroundTheme, setBackgroundTheme
    ] = useState(backgroundCookie)

    const value: BackgroundContextProps = {
        backgroundTheme,
        setBackgroundTheme
    }

    return (
        <BackgroundContext.Provider value={value}>
            <BackgroundComponent>
                {children}
            </BackgroundComponent>
        </BackgroundContext.Provider>
    )
}

export const useBackgroundTheme = () => useContext(BackgroundContext)
"use client"

import { syncGoogleImage } from "@/actions/attendants/sync-google-image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { authClient } from "@/lib/auth-client"
import { useMutation } from "@tanstack/react-query"
import { CheckCircle2, Link as LinkIcon, Loader2 } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export function LinkGoogleAccount() {

    const searchParams = useSearchParams()
    const [isGoogleLinked, setIsGoogleLinked] = useState<boolean | null>(null)

    async function checkAccounts() {
        const { data: accounts } = await authClient.listAccounts()
        const googleAccount = accounts?.find((a) => a.providerId === "google")
        setIsGoogleLinked(!!googleAccount)
        return googleAccount
    }

    useEffect(() => {
        checkAccounts()
    }, [])

    useEffect(() => {
        const isCallback = searchParams.get("google_linked")
        if (!isCallback) return

        syncGoogleImage().then((image) => {
            console.log("🖼️ image retornada:", image)
            if (image) {
                // Força refresh da session no client
                authClient.getSession({ fetchOptions: { cache: "no-store" } })
                // Força reload da página para atualizar o Avatar
                window.location.href = "/settings"
            }
        })
    }, [searchParams])

    const { mutate, isPending: isLoading } = useMutation({
        mutationKey: ["link-accounts"],
        mutationFn: async () => {
            await authClient.linkSocial({
                provider: "google",
                callbackURL: "/settings?google_linked=true",
            })
        },
        onError: (error) => console.log(error)
    })

    const { mutate: unlink, isPending: isUnlinking } = useMutation({
        mutationKey: ["unlink-google"],
        mutationFn: async () => {
            await authClient.unlinkAccount({
                providerId: "google",
            })
        },
        onSuccess: () => {
            setIsGoogleLinked(false)
        },
        onError: (error) => console.log(error)
    })

    if (isGoogleLinked === null) return null

    return (
        <Card className="w-full py-4 border-none pt-0">
            <CardHeader className="px-4">
                <CardTitle>Conta Google</CardTitle>
                <CardDescription>
                    Vincule sua conta Google para login rápido e foto de perfil
                </CardDescription>
            </CardHeader>
            <CardContent className="px-4">
                {isGoogleLinked ? (
                    <Button
                        onClick={() => unlink()}
                        disabled={isUnlinking}
                        variant="outline"
                        size="lg"
                        className="w-full"
                    >
                        {isUnlinking ? (
                            <>
                                <Loader2 className="size-5 animate-spin" />
                                <span>Desvinculando...</span>
                            </>
                        ) : (
                            <>
                                <CheckCircle2 className="size-5 text-green-500" />
                                <span>Desvincular Google</span>
                            </>
                        )}
                    </Button>
                ) : (
                    <Button
                        onClick={() => mutate()}
                        disabled={isLoading}
                        variant="outline"
                        size="lg"
                        className="w-full"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="size-5 animate-spin" />
                                <span>Conectando...</span>
                            </>
                        ) : (
                            <>
                                <LinkIcon className="size-5" />
                                <span>Vincular Google</span>
                            </>
                        )}
                    </Button>
                )}
            </CardContent>
        </Card>
    )
}
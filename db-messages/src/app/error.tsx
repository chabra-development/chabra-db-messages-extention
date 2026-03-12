"use client"

import React from "react"

import { useEffect, useState, useMemo } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import {
    AlertTriangle,
    RefreshCw,
    Home,
    Copy,
    Check,
    ChevronDown,
    ChevronUp,
    Globe,
    Monitor,
    Clock,
    MapPin,
    Cpu,
    FileCode,
    Link2,
    Hash,
    Server,
    Bug,
    Layers,
    FileText,
    FileDown,
    Download,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
    type ErrorReportData,
    generateTextReport,
    downloadAsText,
    downloadAsPdf
} from "@/lib/error-report"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ErrorPageProps {
    error: Error & { digest?: string; statusCode?: number; cause?: unknown }
    reset: () => void
}

interface BrowserInfo {
    userAgent: string
    language: string
    languages: string[]
    platform: string
    vendor: string
    cookieEnabled: boolean
    onLine: boolean
    hardwareConcurrency: number
    deviceMemory?: number
    maxTouchPoints: number
    screenWidth: number
    screenHeight: number
    windowWidth: number
    windowHeight: number
    pixelRatio: number
    colorDepth: number
    timezone: string
    timezoneOffset: number
}

interface RouteInfo {
    pathname: string
    search: string
    hash: string
    fullUrl: string
    origin: string
    host: string
    protocol: string
    referrer: string
    historyLength: number
}

interface ErrorDetails {
    name: string
    message: string
    stack?: string
    digest?: string
    statusCode?: number
    cause?: string
    fileName?: string
    lineNumber?: number
    columnNumber?: number
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {

    const [copied, setCopied] = useState(false)
    const [showStack, setShowStack] = useState(false)
    const [showBrowserInfo, setShowBrowserInfo] = useState(false)
    const [showRouteInfo, setShowRouteInfo] = useState(false)
    const [timestamp] = useState(new Date().toISOString())
    const [localTime] = useState(new Date().toLocaleString("pt-BR"))

    const pathname = usePathname()
    const searchParams = useSearchParams()

    const browserInfo = useMemo<BrowserInfo | null>(() => {
        if (typeof window === "undefined") return null
        return {
            userAgent: navigator.userAgent,
            language: navigator.language,
            languages: [...navigator.languages],
            platform: navigator.platform,
            vendor: navigator.vendor,
            cookieEnabled: navigator.cookieEnabled,
            onLine: navigator.onLine,
            hardwareConcurrency: navigator.hardwareConcurrency,
            deviceMemory: (navigator as Navigator & { deviceMemory?: number }).deviceMemory,
            maxTouchPoints: navigator.maxTouchPoints,
            screenWidth: screen.width,
            screenHeight: screen.height,
            windowWidth: window.innerWidth,
            windowHeight: window.innerHeight,
            pixelRatio: window.devicePixelRatio,
            colorDepth: screen.colorDepth,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            timezoneOffset: new Date().getTimezoneOffset(),
        }
    }, [])

    const routeInfo = useMemo<RouteInfo | null>(() => {
        if (typeof window === "undefined") return null
        return {
            pathname: pathname || window.location.pathname,
            search: searchParams?.toString() ? `?${searchParams.toString()}` : window.location.search,
            hash: window.location.hash,
            fullUrl: window.location.href,
            origin: window.location.origin,
            host: window.location.host,
            protocol: window.location.protocol,
            referrer: document.referrer || "Acesso direto",
            historyLength: window.history.length,
        }
    }, [pathname, searchParams])

    const errorDetails = useMemo<ErrorDetails>(() => {
        const extendedError = error as Error & {
            fileName?: string
            lineNumber?: number
            columnNumber?: number
        }
        return {
            name: error.name || "Error",
            message: error.message || "Erro desconhecido",
            stack: error.stack,
            digest: error.digest,
            statusCode: error.statusCode,
            cause: error.cause ? String(error.cause) : undefined,
            fileName: extendedError.fileName,
            lineNumber: extendedError.lineNumber,
            columnNumber: extendedError.columnNumber,
        }
    }, [error])

    useEffect(() => {
        console.error("[Error Page]", {
            error,
            errorDetails,
            routeInfo,
            browserInfo,
            timestamp,
        })
    }, [error, errorDetails, routeInfo, browserInfo, timestamp])

    const getReportData = useMemo<ErrorReportData>(
        () => ({
            error: errorDetails,
            route: routeInfo
                ? {
                    ...routeInfo,
                }
                : null,
            browser: browserInfo
                ? {
                    ...browserInfo,
                }
                : null,
            timestamp,
            localTime,
        }),
        [errorDetails, routeInfo, browserInfo, timestamp, localTime],
    )

    const copyErrorInfo = () => {
        const report = generateTextReport(getReportData)
        navigator.clipboard.writeText(report)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleDownloadTxt = () => {
        downloadAsText(getReportData)
    }

    const handleDownloadPdf = () => {
        downloadAsPdf(getReportData)
    }

    const InfoRow = ({
        icon: Icon,
        label,
        value,
        mono = false,
    }: {
        icon: React.ElementType
        label: string
        value: string | number | boolean | undefined | null
        mono?: boolean
    }) => (
        <div className="flex items-start gap-3 py-2">
            <Icon className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
                <span className="text-xs text-muted-foreground">{label}</span>
                <p className={`text-sm text-foreground break-all ${mono ? "font-mono" : ""}`}>
                    {value === undefined || value === null || value === ""
                        ? "N/A"
                        : typeof value === "boolean"
                            ? value
                                ? "Sim"
                                : "Nao"
                            : String(value)}
                </p>
            </div>
        </div>
    )

    return (
        <ScrollArea className="h-dvh py-12 bg-background">
            <main className="size-full flex items-center justify-center p-4 ">
                <div className="w-full max-w-3xl space-y-6">
                    {/* Header */}
                    <div className="text-center space-y-4">
                        <div className="mx-auto w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center">
                            <AlertTriangle className="w-10 h-10 text-destructive" />
                        </div>
                        <div>
                            <div className="flex items-center justify-center gap-2 mb-2">
                                {errorDetails.statusCode && (
                                    <Badge variant="destructive" className="text-sm">
                                        {errorDetails.statusCode}
                                    </Badge>
                                )}
                                <Badge variant="outline" className="text-sm bg-transparent">
                                    {errorDetails.name}
                                </Badge>
                            </div>
                            <h1 className="text-3xl font-bold tracking-tight text-foreground text-balance">
                                Algo deu errado
                            </h1>
                            <p className="mt-2 text-muted-foreground max-w-md mx-auto">
                                Ocorreu um erro inesperado. Todas as informacoes relevantes estao disponiveis abaixo
                                para diagnostico.
                            </p>
                        </div>
                    </div>

                    {/* Quick Info Bar */}
                    <Card className="bg-muted/30">
                        <CardContent className="py-3">
                            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1.5">
                                    <MapPin className="w-3.5 h-3.5" />
                                    <span className="font-mono">{routeInfo?.pathname || "/"}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Clock className="w-3.5 h-3.5" />
                                    <span>{localTime}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Globe className="w-3.5 h-3.5" />
                                    <span>{browserInfo?.onLine ? "Online" : "Offline"}</span>
                                </div>
                                {errorDetails.digest && (
                                    <div className="flex items-center gap-1.5">
                                        <Hash className="w-3.5 h-3.5" />
                                        <span className="font-mono">{errorDetails.digest.slice(0, 8)}...</span>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Main Error Card */}
                    <Card className="border-destructive/20">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Bug className="w-5 h-5 text-destructive" />
                                    <CardTitle className="text-lg">Detalhes do Erro</CardTitle>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Button variant="outline" size="sm" onClick={copyErrorInfo} className="h-8 gap-1.5 bg-transparent">
                                        {copied ? (
                                            <>
                                                <Check className="w-3.5 h-3.5 text-green-500" />
                                                <span className="text-xs">Copiado!</span>
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="w-3.5 h-3.5" />
                                                <span className="text-xs">Copiar</span>
                                            </>
                                        )}
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={handleDownloadTxt} className="h-8 gap-1.5 bg-transparent">
                                        <FileText className="w-3.5 h-3.5" />
                                        <span className="text-xs">.txt</span>
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={handleDownloadPdf} className="h-8 gap-1.5 bg-transparent">
                                        <FileDown className="w-3.5 h-3.5" />
                                        <span className="text-xs">.pdf</span>
                                    </Button>
                                </div>
                            </div>
                            <CardDescription>Informacoes completas para diagnostico e suporte tecnico</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Error Message */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                    Mensagem do Erro
                                </label>
                                <div className="p-4 rounded-md bg-destructive/5 border border-destructive/20">
                                    <code className="text-sm text-destructive font-mono break-all leading-relaxed">
                                        {errorDetails.message}
                                    </code>
                                </div>
                            </div>

                            {/* Error Metadata Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {errorDetails.digest && (
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                            Digest (ID do Erro)
                                        </label>
                                        <div className="p-3 rounded-md bg-muted">
                                            <code className="text-sm font-mono text-foreground break-all">{errorDetails.digest}</code>
                                        </div>
                                    </div>
                                )}

                                {errorDetails.statusCode && (
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                            Status Code
                                        </label>
                                        <div className="p-3 rounded-md bg-muted">
                                            <code className="text-sm font-mono text-foreground">{errorDetails.statusCode}</code>
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                        Tipo do Erro
                                    </label>
                                    <div className="p-3 rounded-md bg-muted">
                                        <code className="text-sm font-mono text-foreground">{errorDetails.name}</code>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                        Timestamp (ISO)
                                    </label>
                                    <div className="p-3 rounded-md bg-muted">
                                        <code className="text-sm font-mono text-foreground">{timestamp}</code>
                                    </div>
                                </div>
                            </div>

                            {/* File/Line info if available */}
                            {(errorDetails.fileName || errorDetails.lineNumber) && (
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                        Localizacao no Codigo
                                    </label>
                                    <div className="p-3 rounded-md bg-muted flex items-center gap-2">
                                        <FileCode className="w-4 h-4 text-muted-foreground" />
                                        <code className="text-sm font-mono text-foreground">
                                            {errorDetails.fileName || "Unknown"}
                                            {errorDetails.lineNumber && `:${errorDetails.lineNumber}`}
                                            {errorDetails.columnNumber && `:${errorDetails.columnNumber}`}
                                        </code>
                                    </div>
                                </div>
                            )}

                            {/* Cause if available */}
                            {errorDetails.cause && (
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                        Causa Raiz
                                    </label>
                                    <div className="p-3 rounded-md bg-muted">
                                        <code className="text-sm font-mono text-muted-foreground break-all">{errorDetails.cause}</code>
                                    </div>
                                </div>
                            )}

                            {/* Stack Trace */}
                            {errorDetails.stack && (
                                <div className="space-y-1.5">
                                    <button
                                        onClick={() => setShowStack(!showStack)}
                                        className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wide hover:text-foreground transition-colors"
                                    >
                                        <Layers className="w-3.5 h-3.5" />
                                        Stack Trace
                                        {showStack ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                    </button>
                                    {showStack && (
                                        <div className="p-3 rounded-md bg-muted overflow-x-auto max-h-72 overflow-y-auto">
                                            <pre className="text-xs font-mono text-muted-foreground whitespace-pre-wrap break-all">
                                                {errorDetails.stack}
                                            </pre>
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Route Information Card */}
                    <Card>
                        <CardHeader className="pb-2">
                            <button
                                onClick={() => setShowRouteInfo(!showRouteInfo)}
                                className="flex items-center justify-between w-full"
                            >
                                <div className="flex items-center gap-2">
                                    <Link2 className="w-5 h-5 text-muted-foreground" />
                                    <CardTitle className="text-lg">Informacoes da Rota</CardTitle>
                                </div>
                                {showRouteInfo ? (
                                    <ChevronUp className="w-4 h-4 text-muted-foreground" />
                                ) : (
                                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                                )}
                            </button>
                            <CardDescription>Detalhes sobre a URL e navegacao</CardDescription>
                        </CardHeader>
                        {showRouteInfo && routeInfo && (
                            <CardContent>
                                <div className="grid grid-cols-1 divide-y divide-border">
                                    <InfoRow icon={Globe} label="URL Completa" value={routeInfo.fullUrl} mono />
                                    <InfoRow icon={MapPin} label="Pathname" value={routeInfo.pathname} mono />
                                    <InfoRow icon={Hash} label="Query String" value={routeInfo.search || "Nenhuma"} mono />
                                    <InfoRow icon={Hash} label="Hash" value={routeInfo.hash || "Nenhum"} mono />
                                    <InfoRow icon={Server} label="Origem" value={routeInfo.origin} mono />
                                    <InfoRow icon={Link2} label="Protocolo" value={routeInfo.protocol} />
                                    <InfoRow icon={Link2} label="Referrer" value={routeInfo.referrer} />
                                    <InfoRow icon={Layers} label="Historico de Navegacao" value={`${routeInfo.historyLength} paginas`} />
                                </div>
                            </CardContent>
                        )}
                    </Card>

                    {/* Browser & Device Information Card */}
                    <Card>
                        <CardHeader className="pb-2">
                            <button
                                onClick={() => setShowBrowserInfo(!showBrowserInfo)}
                                className="flex items-center justify-between w-full"
                            >
                                <div className="flex items-center gap-2">
                                    <Monitor className="w-5 h-5 text-muted-foreground" />
                                    <CardTitle className="text-lg">Navegador e Dispositivo</CardTitle>
                                </div>
                                {showBrowserInfo ? (
                                    <ChevronUp className="w-4 h-4 text-muted-foreground" />
                                ) : (
                                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                                )}
                            </button>
                            <CardDescription>Informacoes do ambiente do usuario</CardDescription>
                        </CardHeader>
                        {showBrowserInfo && browserInfo && (
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                                            User Agent
                                        </h4>
                                        <div className="p-3 rounded-md bg-muted">
                                            <code className="text-xs font-mono text-muted-foreground break-all">
                                                {browserInfo.userAgent}
                                            </code>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border">
                                        <div className="space-y-0 pr-0 sm:pr-4">
                                            <InfoRow icon={Globe} label="Idioma Principal" value={browserInfo.language} />
                                            <InfoRow
                                                icon={Globe}
                                                label="Idiomas Suportados"
                                                value={browserInfo.languages.join(", ")}
                                            />
                                            <InfoRow icon={Monitor} label="Plataforma" value={browserInfo.platform} />
                                            <InfoRow icon={Monitor} label="Vendor" value={browserInfo.vendor} />
                                            <InfoRow icon={Globe} label="Status Online" value={browserInfo.onLine} />
                                            <InfoRow icon={Globe} label="Cookies Habilitados" value={browserInfo.cookieEnabled} />
                                        </div>
                                        <div className="space-y-0 pl-0 sm:pl-4 pt-2 sm:pt-0">
                                            <InfoRow
                                                icon={Monitor}
                                                label="Resolucao da Tela"
                                                value={`${browserInfo.screenWidth} x ${browserInfo.screenHeight}`}
                                            />
                                            <InfoRow
                                                icon={Monitor}
                                                label="Tamanho da Janela"
                                                value={`${browserInfo.windowWidth} x ${browserInfo.windowHeight}`}
                                            />
                                            <InfoRow icon={Monitor} label="Pixel Ratio" value={`${browserInfo.pixelRatio}x`} />
                                            <InfoRow icon={Monitor} label="Color Depth" value={`${browserInfo.colorDepth} bits`} />
                                            <InfoRow icon={Cpu} label="CPU Cores" value={browserInfo.hardwareConcurrency} />
                                            {browserInfo.deviceMemory && (
                                                <InfoRow icon={Cpu} label="Memoria (aprox.)" value={`${browserInfo.deviceMemory} GB`} />
                                            )}
                                            <InfoRow icon={Monitor} label="Touch Points" value={browserInfo.maxTouchPoints} />
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="grid grid-cols-1 divide-y divide-border">
                                        <InfoRow icon={Clock} label="Timezone" value={browserInfo.timezone} />
                                        <InfoRow
                                            icon={Clock}
                                            label="UTC Offset"
                                            value={`${-browserInfo.timezoneOffset / 60} horas`}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        )}
                    </Card>

                    {/* Export Card */}
                    <Card className="bg-muted/30">
                        <CardContent className="py-4">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-2">
                                    <Download className="w-4 h-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium text-foreground">Exportar Relatorio Completo</p>
                                        <p className="text-xs text-muted-foreground">
                                            Baixe todas as informacoes do erro para compartilhar com o suporte
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="sm" onClick={handleDownloadTxt} className="gap-2 bg-transparent">
                                        <FileText className="w-4 h-4" />
                                        Baixar .txt
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={handleDownloadPdf} className="gap-2 bg-transparent">
                                        <FileDown className="w-4 h-4" />
                                        Baixar .pdf
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={copyErrorInfo} className="gap-2 bg-transparent">
                                        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                        {copied ? "Copiado!" : "Copiar"}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                        <Button onClick={reset} className="gap-2" size="lg">
                            <RefreshCw className="w-4 h-4" />
                            Tentar novamente
                        </Button>
                        <Button variant="outline" asChild className="gap-2 bg-transparent" size="lg">
                            <a href="/">
                                <Home className="w-4 h-4" />
                                Voltar ao inicio
                            </a>
                        </Button>
                    </div>

                    {/* Footer */}
                    <p className="text-center text-xs text-muted-foreground pt-2">
                        Se o problema persistir, exporte o relatorio e envie para o suporte tecnico.
                    </p>
                </div>
            </main>
        </ScrollArea>
    )
}

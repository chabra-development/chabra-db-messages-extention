export interface ErrorReportData {
    error: {
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
    route?: {
        fullUrl: string
        pathname: string
        search: string
        hash?: string
        origin: string
        host?: string
        protocol: string
        referrer: string
        historyLength?: number
    } | null
    browser?: {
        userAgent: string
        language: string
        languages?: string[]
        platform: string
        vendor?: string
        cookieEnabled?: boolean
        onLine: boolean
        hardwareConcurrency?: number
        deviceMemory?: number
        maxTouchPoints?: number
        screenWidth: number
        screenHeight: number
        windowWidth: number
        windowHeight: number
        pixelRatio?: number
        colorDepth?: number
        timezone: string
        timezoneOffset?: number
    } | null
    timestamp: string
    localTime: string
}

export function generateTextReport(data: ErrorReportData): string {
    const { error, route, browser, timestamp, localTime } = data

    return `
================================================================================
                           RELATORIO DE ERRO
================================================================================
Gerado em: ${localTime} (${timestamp})

================================================================================
  INFORMACOES DO ERRO
================================================================================
Nome/Tipo:       ${error.name}
Mensagem:        ${error.message}
Digest:          ${error.digest || "N/A"}
Status Code:     ${error.statusCode || "N/A"}
Causa Raiz:      ${error.cause || "N/A"}
${error.fileName ? `Arquivo:         ${error.fileName}` : ""}
${error.lineNumber ? `Linha:           ${error.lineNumber}` : ""}
${error.columnNumber ? `Coluna:          ${error.columnNumber}` : ""}

================================================================================
  INFORMACOES DA ROTA
================================================================================
URL Completa:    ${route?.fullUrl || "N/A"}
Pathname:        ${route?.pathname || "N/A"}
Query String:    ${route?.search || "Nenhuma"}
${route?.hash !== undefined ? `Hash:            ${route.hash || "Nenhum"}` : ""}
Origem:          ${route?.origin || "N/A"}
${route?.host ? `Host:            ${route.host}` : ""}
Protocolo:       ${route?.protocol || "N/A"}
Referrer:        ${route?.referrer || "N/A"}
${route?.historyLength !== undefined ? `Historico:       ${route.historyLength} paginas` : ""}

================================================================================
  INFORMACOES DO NAVEGADOR
================================================================================
User Agent:      ${browser?.userAgent || "N/A"}
Idioma:          ${browser?.language || "N/A"}
${browser?.languages ? `Idiomas:         ${browser.languages.join(", ")}` : ""}
Plataforma:      ${browser?.platform || "N/A"}
${browser?.vendor ? `Vendor:          ${browser.vendor}` : ""}
Online:          ${browser?.onLine ? "Sim" : "Nao"}
${browser?.cookieEnabled !== undefined ? `Cookies:         ${browser.cookieEnabled ? "Habilitados" : "Desabilitados"}` : ""}
${browser?.maxTouchPoints !== undefined ? `Touch Points:    ${browser.maxTouchPoints}` : ""}

================================================================================
  INFORMACOES DO DISPOSITIVO
================================================================================
Tela:            ${browser?.screenWidth || "N/A"} x ${browser?.screenHeight || "N/A"}
Janela:          ${browser?.windowWidth || "N/A"} x ${browser?.windowHeight || "N/A"}
${browser?.pixelRatio ? `Pixel Ratio:     ${browser.pixelRatio}x` : ""}
${browser?.colorDepth ? `Color Depth:     ${browser.colorDepth} bits` : ""}
${browser?.hardwareConcurrency ? `CPU Cores:       ${browser.hardwareConcurrency}` : ""}
${browser?.deviceMemory ? `Memoria:         ${browser.deviceMemory} GB` : ""}

================================================================================
  INFORMACOES DE TEMPO
================================================================================
Timestamp ISO:   ${timestamp}
Hora Local:      ${localTime}
Timezone:        ${browser?.timezone || "N/A"}
${browser?.timezoneOffset !== undefined ? `UTC Offset:      ${-browser.timezoneOffset / 60} horas` : ""}

================================================================================
  STACK TRACE
================================================================================
${error.stack || "Stack trace nao disponivel"}

================================================================================
                         FIM DO RELATORIO
================================================================================
`.trim()
}

export function downloadAsText(data: ErrorReportData): void {
    const report = generateTextReport(data)
    const blob = new Blob([report], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const date = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19)
    const filename = `erro-${data.error.name}-${date}.txt`

    const link = document.createElement("a")
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
}

export function downloadAsPdf(data: ErrorReportData): void {
    const { error, route, browser, timestamp, localTime } = data

    // PDF generation using canvas-based approach (no external deps)
    const pageWidth = 595.28 // A4 width in points
    const pageHeight = 841.89 // A4 height in points
    const margin = 40
    const contentWidth = pageWidth - margin * 2
    const lineHeight = 14
    const sectionGap = 10

    let currentPage = 1
    let yPos = margin
    const pages: string[][] = [[]]

    function addLine(text: string, indent = 0) {
        if (yPos + lineHeight > pageHeight - margin) {
            currentPage++
            pages.push([])
            yPos = margin
        }
        const prefix = " ".repeat(indent)
        pages[currentPage - 1].push(`${yPos}|${prefix}${text}`)
        yPos += lineHeight
    }

    function addGap() {
        yPos += sectionGap
    }

    function addSection(title: string) {
        addGap()
        addLine(`${"=".repeat(70)}`)
        addLine(`  ${title}`)
        addLine(`${"=".repeat(70)}`)
        addGap()
    }

    // Header
    addLine("RELATORIO DE ERRO")
    addLine(`Gerado em: ${localTime}`)
    addLine(`Timestamp: ${timestamp}`)

    // Error Info
    addSection("INFORMACOES DO ERRO")
    addLine(`Nome/Tipo:    ${error.name}`)
    addLine(`Mensagem:     ${error.message}`)
    addLine(`Digest:       ${error.digest || "N/A"}`)
    addLine(`Status Code:  ${error.statusCode || "N/A"}`)
    addLine(`Causa Raiz:   ${error.cause || "N/A"}`)
    if (error.fileName) addLine(`Arquivo:      ${error.fileName}`)
    if (error.lineNumber) addLine(`Linha:        ${error.lineNumber}`)
    if (error.columnNumber) addLine(`Coluna:       ${error.columnNumber}`)

    // Route Info
    addSection("INFORMACOES DA ROTA")
    addLine(`URL Completa: ${route?.fullUrl || "N/A"}`)
    addLine(`Pathname:     ${route?.pathname || "N/A"}`)
    addLine(`Query String: ${route?.search || "Nenhuma"}`)
    if (route?.hash !== undefined) addLine(`Hash:         ${route.hash || "Nenhum"}`)
    addLine(`Origem:       ${route?.origin || "N/A"}`)
    addLine(`Protocolo:    ${route?.protocol || "N/A"}`)
    addLine(`Referrer:     ${route?.referrer || "N/A"}`)
    if (route?.historyLength) addLine(`Historico:    ${route.historyLength} paginas`)

    // Browser Info
    addSection("INFORMACOES DO NAVEGADOR")
    addLine(`User Agent:   ${browser?.userAgent || "N/A"}`)
    addLine(`Idioma:       ${browser?.language || "N/A"}`)
    if (browser?.languages) addLine(`Idiomas:      ${browser.languages.join(", ")}`)
    addLine(`Plataforma:   ${browser?.platform || "N/A"}`)
    if (browser?.vendor) addLine(`Vendor:       ${browser.vendor}`)
    addLine(`Online:       ${browser?.onLine ? "Sim" : "Nao"}`)
    if (browser?.cookieEnabled !== undefined)
        addLine(`Cookies:      ${browser.cookieEnabled ? "Habilitados" : "Desabilitados"}`)

    // Device Info
    addSection("INFORMACOES DO DISPOSITIVO")
    addLine(`Tela:         ${browser?.screenWidth || "N/A"} x ${browser?.screenHeight || "N/A"}`)
    addLine(`Janela:       ${browser?.windowWidth || "N/A"} x ${browser?.windowHeight || "N/A"}`)
    if (browser?.pixelRatio) addLine(`Pixel Ratio:  ${browser.pixelRatio}x`)
    if (browser?.colorDepth) addLine(`Color Depth:  ${browser.colorDepth} bits`)
    if (browser?.hardwareConcurrency) addLine(`CPU Cores:    ${browser.hardwareConcurrency}`)
    if (browser?.deviceMemory) addLine(`Memoria:      ${browser.deviceMemory} GB`)

    // Time Info
    addSection("INFORMACOES DE TEMPO")
    addLine(`Timestamp:    ${timestamp}`)
    addLine(`Hora Local:   ${localTime}`)
    addLine(`Timezone:     ${browser?.timezone || "N/A"}`)
    if (browser?.timezoneOffset !== undefined)
        addLine(`UTC Offset:   ${-browser.timezoneOffset / 60} horas`)

    // Stack Trace
    addSection("STACK TRACE")
    const stackLines = (error.stack || "Stack trace nao disponivel").split("\n")
    for (const line of stackLines) {
        // Break long lines
        const maxChars = 80
        if (line.length > maxChars) {
            for (let i = 0; i < line.length; i += maxChars) {
                addLine(line.slice(i, i + maxChars), i > 0 ? 4 : 0)
            }
        } else {
            addLine(line)
        }
    }

    // Build PDF manually (minimal PDF spec)
    const date = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19)
    const filename = `erro-${error.name}-${date}.pdf`

    // Use a simpler approach: create canvas, render text, convert to PDF-like image
    // Actually, let's use a proper minimal PDF builder

    // For best compatibility, we'll use a print-based approach
    const printWindow = window.open("", "_blank")
    if (!printWindow) {
        // Fallback: download as TXT if popup blocked
        downloadAsText(data)
        return
    }

    const reportText = generateTextReport(data)
    const htmlContent = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Relatorio de Erro - ${error.name} - ${date}</title>
  <style>
    @media print {
      body { margin: 0; padding: 20mm; }
      .no-print { display: none !important; }
      @page { size: A4; margin: 15mm; }
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Courier New', Courier, monospace;
      font-size: 11px;
      line-height: 1.5;
      color: #1a1a1a;
      background: #fff;
      padding: 30px;
    }
    .header {
      text-align: center;
      border-bottom: 3px solid #dc2626;
      padding-bottom: 20px;
      margin-bottom: 25px;
    }
    .header h1 {
      font-size: 22px;
      color: #dc2626;
      margin-bottom: 5px;
      font-family: Arial, Helvetica, sans-serif;
    }
    .header .subtitle {
      font-size: 12px;
      color: #666;
    }
    .meta-bar {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 10px;
      background: #f8f8f8;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      padding: 10px 15px;
      margin-bottom: 25px;
      font-size: 10px;
    }
    .meta-bar span { color: #555; }
    .meta-bar strong { color: #1a1a1a; }
    .section {
      margin-bottom: 20px;
      page-break-inside: avoid;
    }
    .section-title {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 14px;
      font-weight: bold;
      color: #1a1a1a;
      border-bottom: 2px solid #e5e5e5;
      padding-bottom: 6px;
      margin-bottom: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .field {
      display: flex;
      margin-bottom: 4px;
      font-size: 11px;
    }
    .field-label {
      min-width: 150px;
      color: #666;
      font-weight: bold;
    }
    .field-value {
      color: #1a1a1a;
      word-break: break-all;
      flex: 1;
    }
    .error-message {
      background: #fef2f2;
      border: 1px solid #fecaca;
      border-left: 4px solid #dc2626;
      padding: 12px 15px;
      border-radius: 4px;
      margin-bottom: 15px;
      font-size: 12px;
      color: #991b1b;
      word-break: break-all;
    }
    .stack-trace {
      background: #f5f5f5;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      padding: 15px;
      font-size: 9px;
      line-height: 1.6;
      white-space: pre-wrap;
      word-break: break-all;
      max-height: none;
      overflow: visible;
      color: #555;
    }
    .badge {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 3px;
      font-size: 10px;
      font-weight: bold;
      font-family: Arial, Helvetica, sans-serif;
    }
    .badge-error {
      background: #dc2626;
      color: #fff;
    }
    .badge-type {
      background: #f5f5f5;
      color: #525252;
      border: 1px solid #e0e0e0;
    }
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4px 30px;
    }
    .footer {
      margin-top: 25px;
      padding-top: 15px;
      border-top: 1px solid #e0e0e0;
      text-align: center;
      font-size: 9px;
      color: #999;
    }
    .actions {
      text-align: center;
      margin: 20px 0;
    }
    .actions button {
      padding: 10px 24px;
      font-size: 13px;
      font-weight: 600;
      background: #171717;
      color: #fff;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-family: Arial, Helvetica, sans-serif;
    }
    .actions button:hover { background: #333; }
  </style>
</head>
<body>
  <div class="no-print actions">
    <button onclick="window.print()">Imprimir / Salvar como PDF</button>
  </div>

  <div class="header">
    <h1>RELATORIO DE ERRO</h1>
    <div class="subtitle">
      <span class="badge badge-error">${error.statusCode || "ERROR"}</span>
      <span class="badge badge-type">${error.name}</span>
    </div>
  </div>

  <div class="meta-bar">
    <span>Rota: <strong>${route?.pathname || "/"}</strong></span>
    <span>Data: <strong>${localTime}</strong></span>
    <span>Status: <strong>${browser?.onLine ? "Online" : "Offline"}</strong></span>
    ${error.digest ? `<span>Digest: <strong>${error.digest}</strong></span>` : ""}
  </div>

  <div class="section">
    <div class="section-title">Informacoes do Erro</div>
    <div class="error-message">${error.message}</div>
    <div class="grid-2">
      <div class="field"><span class="field-label">Nome/Tipo:</span><span class="field-value">${error.name}</span></div>
      <div class="field"><span class="field-label">Digest:</span><span class="field-value">${error.digest || "N/A"}</span></div>
      <div class="field"><span class="field-label">Status Code:</span><span class="field-value">${error.statusCode || "N/A"}</span></div>
      <div class="field"><span class="field-label">Causa Raiz:</span><span class="field-value">${error.cause || "N/A"}</span></div>
      ${error.fileName ? `<div class="field"><span class="field-label">Arquivo:</span><span class="field-value">${error.fileName}</span></div>` : ""}
      ${error.lineNumber ? `<div class="field"><span class="field-label">Linha:</span><span class="field-value">${error.lineNumber}${error.columnNumber ? `:${error.columnNumber}` : ""}</span></div>` : ""}
    </div>
  </div>

  <div class="section">
    <div class="section-title">Informacoes da Rota</div>
    <div class="field"><span class="field-label">URL Completa:</span><span class="field-value">${route?.fullUrl || "N/A"}</span></div>
    <div class="grid-2">
      <div class="field"><span class="field-label">Pathname:</span><span class="field-value">${route?.pathname || "N/A"}</span></div>
      <div class="field"><span class="field-label">Query String:</span><span class="field-value">${route?.search || "Nenhuma"}</span></div>
      ${route?.hash !== undefined ? `<div class="field"><span class="field-label">Hash:</span><span class="field-value">${route.hash || "Nenhum"}</span></div>` : ""}
      <div class="field"><span class="field-label">Origem:</span><span class="field-value">${route?.origin || "N/A"}</span></div>
      <div class="field"><span class="field-label">Protocolo:</span><span class="field-value">${route?.protocol || "N/A"}</span></div>
      <div class="field"><span class="field-label">Referrer:</span><span class="field-value">${route?.referrer || "N/A"}</span></div>
      ${route?.historyLength !== undefined ? `<div class="field"><span class="field-label">Historico:</span><span class="field-value">${route.historyLength} paginas</span></div>` : ""}
    </div>
  </div>

  <div class="section">
    <div class="section-title">Navegador e Dispositivo</div>
    <div class="field"><span class="field-label">User Agent:</span><span class="field-value" style="font-size:9px">${browser?.userAgent || "N/A"}</span></div>
    <div class="grid-2">
      <div class="field"><span class="field-label">Idioma:</span><span class="field-value">${browser?.language || "N/A"}</span></div>
      ${browser?.languages ? `<div class="field"><span class="field-label">Idiomas:</span><span class="field-value">${browser.languages.join(", ")}</span></div>` : ""}
      <div class="field"><span class="field-label">Plataforma:</span><span class="field-value">${browser?.platform || "N/A"}</span></div>
      ${browser?.vendor ? `<div class="field"><span class="field-label">Vendor:</span><span class="field-value">${browser.vendor}</span></div>` : ""}
      <div class="field"><span class="field-label">Online:</span><span class="field-value">${browser?.onLine ? "Sim" : "Nao"}</span></div>
      ${browser?.cookieEnabled !== undefined ? `<div class="field"><span class="field-label">Cookies:</span><span class="field-value">${browser.cookieEnabled ? "Habilitados" : "Desabilitados"}</span></div>` : ""}
    </div>
  </div>

  <div class="section">
    <div class="section-title">Dispositivo</div>
    <div class="grid-2">
      <div class="field"><span class="field-label">Resolucao Tela:</span><span class="field-value">${browser?.screenWidth || "N/A"} x ${browser?.screenHeight || "N/A"}</span></div>
      <div class="field"><span class="field-label">Tamanho Janela:</span><span class="field-value">${browser?.windowWidth || "N/A"} x ${browser?.windowHeight || "N/A"}</span></div>
      ${browser?.pixelRatio ? `<div class="field"><span class="field-label">Pixel Ratio:</span><span class="field-value">${browser.pixelRatio}x</span></div>` : ""}
      ${browser?.colorDepth ? `<div class="field"><span class="field-label">Color Depth:</span><span class="field-value">${browser.colorDepth} bits</span></div>` : ""}
      ${browser?.hardwareConcurrency ? `<div class="field"><span class="field-label">CPU Cores:</span><span class="field-value">${browser.hardwareConcurrency}</span></div>` : ""}
      ${browser?.deviceMemory ? `<div class="field"><span class="field-label">Memoria:</span><span class="field-value">${browser.deviceMemory} GB</span></div>` : ""}
      ${browser?.maxTouchPoints !== undefined ? `<div class="field"><span class="field-label">Touch Points:</span><span class="field-value">${browser.maxTouchPoints}</span></div>` : ""}
    </div>
  </div>

  <div class="section">
    <div class="section-title">Tempo</div>
    <div class="grid-2">
      <div class="field"><span class="field-label">Timestamp ISO:</span><span class="field-value">${timestamp}</span></div>
      <div class="field"><span class="field-label">Hora Local:</span><span class="field-value">${localTime}</span></div>
      <div class="field"><span class="field-label">Timezone:</span><span class="field-value">${browser?.timezone || "N/A"}</span></div>
      ${browser?.timezoneOffset !== undefined ? `<div class="field"><span class="field-label">UTC Offset:</span><span class="field-value">${-browser.timezoneOffset / 60} horas</span></div>` : ""}
    </div>
  </div>

  <div class="section">
    <div class="section-title">Stack Trace</div>
    <div class="stack-trace">${(error.stack || "Stack trace nao disponivel").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>
  </div>

  <div class="footer">
    Relatorio gerado automaticamente em ${localTime} | ${filename}
  </div>
</body>
</html>`

    printWindow.document.write(htmlContent)
    printWindow.document.close()
}

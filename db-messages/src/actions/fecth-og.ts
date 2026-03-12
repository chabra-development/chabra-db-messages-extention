"use server"

export interface OgData {
    title: string | null
    description: string | null
    image: string | null
    siteName: string | null
    favicon: string | null
    url: string
    hostname: string
}

export async function fetchOgData(url: string): Promise<OgData | null> {

    try {

        const response = await fetch(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (compatible; LinkPreview/1.0; +https://example.com)",
            },
            signal: AbortSignal.timeout(5000),
        })

        if (!response.ok) return null

        const html = await response.text()

        const getMetaContent = (property: string): string | null => {
            const patterns = [
                new RegExp(
                    `<meta[^>]*property=["']${property}["'][^>]*content=["']([^"']*)["']`,
                    "i"
                ),
                new RegExp(
                    `<meta[^>]*content=["']([^"']*)["'][^>]*property=["']${property}["']`,
                    "i"
                ),
                new RegExp(
                    `<meta[^>]*name=["']${property}["'][^>]*content=["']([^"']*)["']`,
                    "i"
                ),
                new RegExp(
                    `<meta[^>]*content=["']([^"']*)["'][^>]*name=["']${property}["']`,
                    "i"
                ),
            ]

            for (const pattern of patterns) {
                const match = html.match(pattern)
                if (match?.[1]) return match[1]
            }

            return null
        }

        const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i)

        const title =
            getMetaContent("og:title") ||
            getMetaContent("twitter:title") ||
            titleMatch?.[1] ||
            null

        const description =
            getMetaContent("og:description") ||
            getMetaContent("twitter:description") ||
            getMetaContent("description") ||
            null

        const image =
            getMetaContent("og:image") ||
            getMetaContent("twitter:image") ||
            null

        const siteName = getMetaContent("og:site_name") || null

        const parsedUrl = new URL(url)

        const favicon = `https://www.google.com/s2/favicons?domain=${parsedUrl.hostname}&sz=64`

        let resolvedImage = image

        if (image && !image.startsWith("http")) {
            resolvedImage = new URL(image, url).href
        }

        return {
            title,
            description,
            image: resolvedImage,
            siteName,
            favicon,
            url,
            hostname: parsedUrl.hostname,
        }
    } catch {
        return null
    }
}

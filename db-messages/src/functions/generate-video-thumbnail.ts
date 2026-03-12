export function generateVideoThumbnail(videoUrl: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const video = document.createElement("video")
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")!

        video.src = videoUrl
        video.crossOrigin = "anonymous"
        video.currentTime = 1 // segundo do frame capturado

        video.onloadeddata = () => {
            canvas.width = video.videoWidth
            canvas.height = video.videoHeight
            ctx.drawImage(video, 0, 0)
            resolve(canvas.toDataURL("image/jpeg"))
        }

        video.onerror = reject
    })
}
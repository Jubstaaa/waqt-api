import { env } from 'cloudflare:workers'

const MEDIA_BASE_URL = env.MEDIA_BASE_URL.replace(/\/+$/, '')

export function mediaUrl(path: string | null) {
    if (!path || /^https?:\/\//.test(path)) return path
    return `${MEDIA_BASE_URL}/${encodeURI(path)}`
}

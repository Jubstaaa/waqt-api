const MEDIA_BASE_URL = (process.env.MEDIA_BASE_URL ?? 'https://waqt.fra1.cdn.digitaloceanspaces.com').replace(/\/+$/, '')

export function mediaUrl(path: string | null) {
    if (!path || /^https?:\/\//.test(path)) return path
    return `${MEDIA_BASE_URL}/${encodeURI(path)}`
}

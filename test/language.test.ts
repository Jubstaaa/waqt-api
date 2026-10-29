import { describe, expect, it } from 'vitest'
import { get } from './helpers'

async function requestedLanguage(acceptLanguage?: string) {
    const res = await get('/faqs', acceptLanguage ? { 'Accept-Language': acceptLanguage } : {})
    const body = await res.json<{ data: { requestedLanguage: string } }>()
    return { res, language: body.data.requestedLanguage }
}

describe('language detection', () => {
    it.each([
        ['xx-CH,ar;q=0.9', 'ar'],
        ['de;q=0.5,tr', 'tr'],
        ['fr-CH,ar;q=0.9', 'fr'],
        [undefined, 'en'],
    ])('resolves %s to %s', async (header, expected) => {
        const { language } = await requestedLanguage(header)
        expect(language).toBe(expected)
    })

    it('does not set a language cookie', async () => {
        const { res } = await requestedLanguage('tr')
        expect(res.headers.get('Set-Cookie')).toBeNull()
    })
})

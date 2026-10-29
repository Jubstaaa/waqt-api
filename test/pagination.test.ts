import { beforeEach, describe, expect, it } from 'vitest'
import { get, resetDb, seedFaq } from './helpers'

interface Page {
    data: {
        pageIndex: number
        hasNextPage: boolean
        itemCount: number
        maxPageCount: number
        items: unknown[]
    }
}

async function page(query: string) {
    const res = await get(`/faqs?${query}`, { 'Accept-Language': 'en' })
    return { status: res.status, body: res.ok ? await res.json<Page>() : undefined }
}

beforeEach(async () => {
    await resetDb()
    for (const order of [1, 2, 3]) await seedFaq(order, ['en'])
})

describe('pagination', () => {
    it('defaults to the first page of 10', async () => {
        const { body } = await page('')
        expect(body?.data).toMatchObject({
            pageIndex: 1,
            hasNextPage: false,
            itemCount: 3,
            maxPageCount: 1,
        })
        expect(body?.data.items).toHaveLength(3)
    })

    it('splits results across pages', async () => {
        const first = await page('pageIndex=1&pageSize=2')
        const second = await page('pageIndex=2&pageSize=2')
        expect(first.body?.data).toMatchObject({ hasNextPage: true, maxPageCount: 2 })
        expect(first.body?.data.items).toHaveLength(2)
        expect(second.body?.data).toMatchObject({ hasNextPage: false })
        expect(second.body?.data.items).toHaveLength(1)
    })

    it.each(['pageIndex=0', 'pageSize=0', 'pageSize=101', 'pageIndex=abc'])(
        'rejects %s with 400',
        async (query) => {
            expect((await page(query)).status).toBe(400)
        },
    )

    it('accepts the maximum page size', async () => {
        expect((await page('pageSize=100')).status).toBe(200)
    })

    // itemCount counts active rows in every language, not just the requested one
    it.fails('counts only items translated in the requested language', async () => {
        await seedFaq(4, ['tr'])
        const { body } = await page('')
        expect(body?.data.itemCount).toBe(3)
    })
})

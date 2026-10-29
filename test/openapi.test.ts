import { describe, expect, it } from 'vitest'
import { get } from './helpers'

interface OpenApiDocument {
    paths: Record<string, Record<string, { parameters?: { name: string; in: string }[] }>>
}

describe('/openapi.json', () => {
    it('documents the Accept-Language header on every route', async () => {
        const res = await get('/openapi.json')
        expect(res.status).toBe(200)
        const doc = await res.json<OpenApiDocument>()
        const operations = Object.values(doc.paths).flatMap((methods) => Object.values(methods))
        expect(operations.length).toBeGreaterThan(0)
        for (const operation of operations) {
            expect(operation.parameters).toContainEqual(
                expect.objectContaining({ name: 'Accept-Language', in: 'header' }),
            )
        }
    })
})

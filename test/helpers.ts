import { exports } from 'cloudflare:workers'
import type { ZodType } from 'zod'
import app from '../src'
import { db } from '../src/lib/db'
import * as schema from '../src/lib/schema'

const timestamps = { createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' }

export function get(path: string, headers?: HeadersInit) {
    return exports.default.fetch(new Request(`http://localhost${path}`, { headers }))
}

export function responseSchema(method: string, path: string) {
    const definition = app.openAPIRegistry.definitions.find(
        (d) => d.type === 'route' && d.route.method === method && d.route.path === path,
    )
    if (definition?.type !== 'route') throw new Error(`No route for ${method} ${path}`)
    const response = definition.route.responses[200]
    const media = 'content' in response ? response.content?.['application/json'] : undefined
    if (!media || !('schema' in media)) throw new Error(`No 200 schema for ${method} ${path}`)
    return media.schema as ZodType
}

export async function resetDb() {
    await Promise.all(Object.values(schema).map((table) => db.delete(table)))
}

export async function seedFaq(order: number, languages: string[]) {
    const id = crypto.randomUUID()
    await db.insert(schema.faqs).values({ id, order, isActive: 1, ...timestamps })
    await db
        .insert(schema.faqTranslations)
        .values(languages.map((language) => ({ faqId: id, question: 'Q', answer: 'A', language })))
    return id
}

export async function seedStory(language: string) {
    const id = crypto.randomUUID()
    await db.insert(schema.stories).values({
        id,
        order: 1,
        type: 1,
        coverImageUrl: 'covers/a.png',
        contentImageUrl: null,
        isActive: 1,
        ...timestamps,
    })
    await db.insert(schema.storyTranslations).values({
        storyId: id,
        title: 'T',
        description: 'D',
        language,
    })
    return id
}

export async function seedReligiousStory(language: string) {
    const id = crypto.randomUUID()
    await db.insert(schema.religiousStories).values({
        id,
        order: 1,
        imageUrl: 'images/a.png',
        isActive: 1,
        ...timestamps,
    })
    await db.insert(schema.religiousStoryTranslations).values({
        storyId: id,
        title: 'T',
        description: 'D',
        content: 'C',
        mediaUrl: 'https://example.com/a.mp3',
        language,
    })
    return id
}

export async function seedTemplate(language: string) {
    const id = crypto.randomUUID()
    await db
        .insert(schema.templates)
        .values({ id, order: 1, imageUrl: null, isActive: 1, ...timestamps })
    await db.insert(schema.templateTranslations).values({ templateId: id, text: 'T', language })
    return id
}

import { createRoute, z, OpenAPIHono } from '@hono/zod-openapi'
import { eq, and, asc, count } from 'drizzle-orm'
import { PaginationQuerySchema, paginatedResponse, paginate } from '../lib/openapi'
import { getDb } from '../lib/db'
import { stories as storiesTable, storyTranslations } from '../lib/schema'
import type { Bindings } from '../lib/bindings'

export const STORY_TYPE = {
    none: 0,
    ayah: 1,
    hadith: 2,
    dua: 3,
    lesson: 4,
    religiousStory: 5,
} as const

const StoryItemSchema = z.object({
    id: z.string().uuid(),
    order: z.number(),
    type: z
        .number()
        .int()
        .min(0)
        .max(5)
        .openapi({
            description: '0=none, 1=ayah, 2=hadith, 3=dua, 4=lesson, 5=religiousStory',
            example: 1,
        }),
    coverImageUrl: z.string().url().nullable(),
    contentImageUrl: z.string().url().nullable(),
    title: z.string(),
    description: z.string(),
    language: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
}).openapi('StoryItem')

const stories = new OpenAPIHono<{ Bindings: Bindings }>()

stories.openapi(
    createRoute({
        method: 'get',
        path: '/',
        tags: ['Stories'],
        summary: 'List Stories',
        request: { query: PaginationQuerySchema },
        responses: {
            200: {
                description: 'Stories fetched successfully',
                content: { 'application/json': { schema: paginatedResponse(StoryItemSchema) } },
            },
        },
    }),
    async (c) => {
        const { lang, pageIndex, pageSize } = c.req.valid('query')
        const db = getDb(c.env.DB)

        const [items, [{ total }]] = await Promise.all([
            db.select({
                id: storiesTable.id,
                order: storiesTable.order,
                type: storiesTable.type,
                coverImageUrl: storiesTable.coverImageUrl,
                contentImageUrl: storiesTable.contentImageUrl,
                title: storyTranslations.title,
                description: storyTranslations.description,
                language: storyTranslations.language,
                createdAt: storiesTable.createdAt,
                updatedAt: storiesTable.updatedAt,
            })
                .from(storiesTable)
                .innerJoin(storyTranslations, eq(storyTranslations.storyId, storiesTable.id))
                .where(and(eq(storiesTable.isActive, 1), eq(storyTranslations.language, lang)))
                .orderBy(asc(storiesTable.order))
                .limit(pageSize)
                .offset(pageIndex * pageSize),
            db.select({ total: count() })
                .from(storiesTable)
                .where(eq(storiesTable.isActive, 1)),
        ])

        return c.json({
            message: 'Stories fetched successfully',
            data: {
                ...paginate(pageIndex, pageSize, total),
                items,
                requestedLanguage: lang,
                returnedLanguage: lang,
            },
        })
    },
)

export default stories

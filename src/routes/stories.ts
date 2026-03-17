import { createRoute, z, OpenAPIHono } from '@hono/zod-openapi'
import { PaginationQuerySchema, paginatedResponse, paginate } from '../lib/openapi'
import type { Bindings } from '../lib/bindings'

/**
 * Story type enum:
 * 0 = none
 * 1 = ayah
 * 2 = hadith
 * 3 = dua
 * 4 = lesson
 * 5 = religiousStory
 */
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
        const offset = pageIndex * pageSize

        const [{ results: items }, { results: countResult }] = await Promise.all([
            c.env.DB.prepare(`
                SELECT s.id, s."order", s.type, s.cover_image_url, s.content_image_url,
                       s.created_at, s.updated_at, t.title, t.description, t.language
                FROM stories s
                JOIN story_translations t ON t.story_id = s.id
                WHERE s.is_active = 1 AND t.language = ?
                ORDER BY s."order" ASC
                LIMIT ? OFFSET ?
            `).bind(lang, pageSize, offset).all<{
                id: string
                order: number
                type: number
                cover_image_url: string | null
                content_image_url: string | null
                created_at: string
                updated_at: string
                title: string
                description: string
                language: string
            }>(),
            c.env.DB.prepare(`
                SELECT COUNT(*) as count FROM stories WHERE is_active = 1
            `).all<{ count: number }>(),
        ])

        const totalCount = countResult[0]?.count ?? 0

        return c.json({
            message: 'Stories fetched successfully',
            data: {
                ...paginate(pageIndex, pageSize, totalCount),
                items: items.map((s) => ({
                    id: s.id,
                    order: s.order,
                    type: s.type,
                    coverImageUrl: s.cover_image_url,
                    contentImageUrl: s.content_image_url,
                    title: s.title,
                    description: s.description,
                    language: s.language,
                    createdAt: s.created_at,
                    updatedAt: s.updated_at,
                })),
                requestedLanguage: lang,
                returnedLanguage: lang,
            },
        })
    },
)

export default stories

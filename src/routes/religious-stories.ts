import { createRoute, z, OpenAPIHono } from '@hono/zod-openapi'
import { PaginationQuerySchema, paginatedResponse, paginate } from '../lib/openapi'
import type { Bindings } from '../lib/bindings'

const ReligiousStoryItemSchema = z.object({
    id: z.string().uuid(),
    order: z.number(),
    imageUrl: z.string().url().nullable(),
    videoUrl: z.string().url().nullable(),
    title: z.string(),
    description: z.string(),
    content: z.string(),
    language: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
}).openapi('ReligiousStoryItem')

const religiousStories = new OpenAPIHono<{ Bindings: Bindings }>()

religiousStories.openapi(
    createRoute({
        method: 'get',
        path: '/',
        tags: ['Religious Stories'],
        summary: 'List Religious Stories',
        request: { query: PaginationQuerySchema },
        responses: {
            200: {
                description: 'Religious stories fetched successfully',
                content: { 'application/json': { schema: paginatedResponse(ReligiousStoryItemSchema) } },
            },
        },
    }),
    async (c) => {
        const { lang, pageIndex, pageSize } = c.req.valid('query')
        const offset = pageIndex * pageSize

        const [{ results: items }, { results: countResult }] = await Promise.all([
            c.env.DB.prepare(`
                SELECT s.id, s."order", s.image_url, s.video_url, s.created_at, s.updated_at,
                       t.title, t.description, t.content, t.language
                FROM religious_stories s
                JOIN religious_story_translations t ON t.story_id = s.id
                WHERE s.is_active = 1 AND t.language = ?
                ORDER BY s."order" ASC
                LIMIT ? OFFSET ?
            `).bind(lang, pageSize, offset).all<{
                id: string
                order: number
                image_url: string | null
                video_url: string | null
                created_at: string
                updated_at: string
                title: string
                description: string
                content: string
                language: string
            }>(),
            c.env.DB.prepare(`
                SELECT COUNT(*) as count FROM religious_stories WHERE is_active = 1
            `).all<{ count: number }>(),
        ])

        const totalCount = countResult[0]?.count ?? 0

        return c.json({
            message: 'Religious stories fetched successfully',
            data: {
                ...paginate(pageIndex, pageSize, totalCount),
                items: items.map((s) => ({
                    id: s.id,
                    order: s.order,
                    imageUrl: s.image_url,
                    videoUrl: s.video_url,
                    title: s.title,
                    description: s.description,
                    content: s.content,
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

export default religiousStories

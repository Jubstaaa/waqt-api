import { createRoute, z, OpenAPIHono } from '@hono/zod-openapi'
import { PaginationQuerySchema, paginatedResponse, paginate } from '../lib/openapi'
import type { Bindings } from '../lib/bindings'

const TemplateItemSchema = z.object({
    id: z.string().uuid(),
    order: z.number(),
    imageUrl: z.string().url().nullable(),
    text: z.string(),
    language: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
}).openapi('TemplateItem')

const templates = new OpenAPIHono<{ Bindings: Bindings }>()

templates.openapi(
    createRoute({
        method: 'get',
        path: '/',
        tags: ['Templates'],
        summary: 'List Templates',
        request: { query: PaginationQuerySchema },
        responses: {
            200: {
                description: 'Templates fetched successfully',
                content: { 'application/json': { schema: paginatedResponse(TemplateItemSchema) } },
            },
        },
    }),
    async (c) => {
        const { lang, pageIndex, pageSize } = c.req.valid('query')
        const offset = pageIndex * pageSize

        const [{ results: items }, { results: countResult }] = await Promise.all([
            c.env.DB.prepare(`
                SELECT t.id, t."order", t.image_url, t.created_at, t.updated_at,
                       tr.text, tr.language
                FROM templates t
                JOIN template_translations tr ON tr.template_id = t.id
                WHERE t.is_active = 1 AND tr.language = ?
                ORDER BY t."order" ASC
                LIMIT ? OFFSET ?
            `).bind(lang, pageSize, offset).all<{
                id: string
                order: number
                image_url: string | null
                created_at: string
                updated_at: string
                text: string
                language: string
            }>(),
            c.env.DB.prepare(`
                SELECT COUNT(*) as count FROM templates WHERE is_active = 1
            `).all<{ count: number }>(),
        ])

        const totalCount = countResult[0]?.count ?? 0

        return c.json({
            message: 'Templates fetched successfully',
            data: {
                ...paginate(pageIndex, pageSize, totalCount),
                items: items.map((t) => ({
                    id: t.id,
                    order: t.order,
                    imageUrl: t.image_url,
                    text: t.text,
                    language: t.language,
                    createdAt: t.created_at,
                    updatedAt: t.updated_at,
                })),
                requestedLanguage: lang,
                returnedLanguage: lang,
            },
        })
    },
)

export default templates

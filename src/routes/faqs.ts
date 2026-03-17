import { createRoute, z, OpenAPIHono } from '@hono/zod-openapi'
import { PaginationQuerySchema, paginatedResponse, paginate } from '../lib/openapi'
import type { Bindings } from '../lib/bindings'

const FaqItemSchema = z.object({
    id: z.string().uuid(),
    order: z.number(),
    question: z.string(),
    answer: z.string(),
    language: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
}).openapi('FaqItem')

const faqs = new OpenAPIHono<{ Bindings: Bindings }>()

faqs.openapi(
    createRoute({
        method: 'get',
        path: '/',
        tags: ['FAQs'],
        summary: 'List FAQs',
        request: { query: PaginationQuerySchema },
        responses: {
            200: {
                description: 'FAQs fetched successfully',
                content: { 'application/json': { schema: paginatedResponse(FaqItemSchema) } },
            },
        },
    }),
    async (c) => {
        const { lang, pageIndex, pageSize } = c.req.valid('query')
        const offset = pageIndex * pageSize

        const [{ results: items }, { results: countResult }] = await Promise.all([
            c.env.DB.prepare(`
                SELECT f.id, f."order", f.created_at, f.updated_at,
                       t.question, t.answer, t.language
                FROM faqs f
                JOIN faq_translations t ON t.faq_id = f.id
                WHERE f.is_active = 1 AND t.language = ?
                ORDER BY f."order" ASC
                LIMIT ? OFFSET ?
            `).bind(lang, pageSize, offset).all<{
                id: string
                order: number
                created_at: string
                updated_at: string
                question: string
                answer: string
                language: string
            }>(),
            c.env.DB.prepare(`
                SELECT COUNT(*) as count FROM faqs WHERE is_active = 1
            `).all<{ count: number }>(),
        ])

        const totalCount = countResult[0]?.count ?? 0

        return c.json({
            message: 'FAQs fetched successfully',
            data: {
                ...paginate(pageIndex, pageSize, totalCount),
                items: items.map((f) => ({
                    id: f.id,
                    order: f.order,
                    question: f.question,
                    answer: f.answer,
                    language: f.language,
                    createdAt: f.created_at,
                    updatedAt: f.updated_at,
                })),
                requestedLanguage: lang,
                returnedLanguage: lang,
            },
        })
    },
)

export default faqs

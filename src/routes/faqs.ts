import { createRoute, z, OpenAPIHono } from '@hono/zod-openapi'
import { PaginationQuerySchema, paginatedResponse, paginate } from '../lib/openapi'
import { mockFaqs } from '../lib/mock-data'

const FaqItemSchema = z.object({
    id: z.string().uuid(),
    order: z.number(),
    question: z.string(),
    answer: z.string(),
    language: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
}).openapi('FaqItem')

const faqs = new OpenAPIHono()

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
    (c) => {
        const { lang, pageIndex, pageSize } = c.req.valid('query')

        const active = mockFaqs.filter((f) => f.is_active)
        const paged = active.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize)

        const items = paged.map((faq) => {
            const translation = faq.faq_translations.find((t) => t.language === lang)
                ?? faq.faq_translations[0]
            return {
                id: faq.id,
                order: faq.order,
                question: translation.question,
                answer: translation.answer,
                language: translation.language,
                createdAt: faq.created_at,
                updatedAt: faq.updated_at,
            }
        })

        return c.json({
            message: 'FAQs fetched successfully',
            data: { ...paginate(pageIndex, pageSize, active.length), items, requestedLanguage: lang, returnedLanguage: lang },
        })
    },
)

export default faqs

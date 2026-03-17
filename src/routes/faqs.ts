import { createRoute, z, OpenAPIHono } from '@hono/zod-openapi'
import { eq, and, asc, count } from 'drizzle-orm'
import { PaginationQuerySchema, LanguageHeaderSchema, paginatedResponse, paginate } from '../lib/openapi'
import { getDb } from '../lib/db'
import { faqs as faqsTable, faqTranslations } from '../lib/schema'
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
        request: {
            query: PaginationQuerySchema,
            headers: LanguageHeaderSchema,
        },
        responses: {
            200: {
                description: 'FAQs fetched successfully',
                content: { 'application/json': { schema: paginatedResponse(FaqItemSchema) } },
            },
        },
    }),
    async (c) => {
        const { pageIndex, pageSize } = c.req.valid('query')
        const { 'Accept-Language': lang } = c.req.valid('header')
        const db = getDb(c.env.DB)

        const [items, [{ total }]] = await Promise.all([
            db.select({
                id: faqsTable.id,
                order: faqsTable.order,
                question: faqTranslations.question,
                answer: faqTranslations.answer,
                language: faqTranslations.language,
                createdAt: faqsTable.createdAt,
                updatedAt: faqsTable.updatedAt,
            })
                .from(faqsTable)
                .innerJoin(faqTranslations, eq(faqTranslations.faqId, faqsTable.id))
                .where(and(eq(faqsTable.isActive, 1), eq(faqTranslations.language, lang)))
                .orderBy(asc(faqsTable.order))
                .limit(pageSize)
                .offset(pageIndex * pageSize),
            db.select({ total: count() })
                .from(faqsTable)
                .where(eq(faqsTable.isActive, 1)),
        ])

        return c.json({
            message: 'FAQs fetched successfully',
            data: {
                ...paginate(pageIndex, pageSize, total),
                items,
                requestedLanguage: lang,
                returnedLanguage: lang,
            },
        })
    },
)

export default faqs

import { createRoute, z, OpenAPIHono } from '@hono/zod-openapi'
import { eq, and, asc, count } from 'drizzle-orm'
import { PaginationQuerySchema, paginatedResponse, paginate } from '../lib/openapi'
import { getDb } from '../lib/db'
import { templates as templatesTable, templateTranslations } from '../lib/schema'
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
        const db = getDb(c.env.DB)

        const [items, [{ total }]] = await Promise.all([
            db.select({
                id: templatesTable.id,
                order: templatesTable.order,
                imageUrl: templatesTable.imageUrl,
                text: templateTranslations.text,
                language: templateTranslations.language,
                createdAt: templatesTable.createdAt,
                updatedAt: templatesTable.updatedAt,
            })
                .from(templatesTable)
                .innerJoin(templateTranslations, eq(templateTranslations.templateId, templatesTable.id))
                .where(and(eq(templatesTable.isActive, 1), eq(templateTranslations.language, lang)))
                .orderBy(asc(templatesTable.order))
                .limit(pageSize)
                .offset(pageIndex * pageSize),
            db.select({ total: count() })
                .from(templatesTable)
                .where(eq(templatesTable.isActive, 1)),
        ])

        return c.json({
            message: 'Templates fetched successfully',
            data: {
                ...paginate(pageIndex, pageSize, total),
                items,
                requestedLanguage: lang,
                returnedLanguage: lang,
            },
        })
    },
)

export default templates

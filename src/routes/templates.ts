import { createRoute, z, OpenAPIHono } from '@hono/zod-openapi'
import { PaginationQuerySchema, paginatedResponse, paginate } from '../lib/openapi'
import { mockTemplates } from '../lib/mock-data'

const TemplateItemSchema = z.object({
    id: z.string().uuid(),
    order: z.number(),
    imageUrl: z.string().url().nullable(),
    text: z.string(),
    language: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
}).openapi('TemplateItem')

const templates = new OpenAPIHono()

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
    (c) => {
        const { lang, pageIndex, pageSize } = c.req.valid('query')

        const active = mockTemplates.filter((t) => t.is_active)
        const paged = active.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize)

        const items = paged.map((template) => {
            const translation = template.template_translations.find((t) => t.language === lang)
                ?? template.template_translations[0]
            return {
                id: template.id,
                order: template.order,
                imageUrl: template.image_url,
                text: translation.text,
                language: translation.language,
                createdAt: template.created_at,
                updatedAt: template.updated_at,
            }
        })

        return c.json({
            message: 'Templates fetched successfully',
            data: { ...paginate(pageIndex, pageSize, active.length), items, requestedLanguage: lang, returnedLanguage: lang },
        })
    },
)

export default templates

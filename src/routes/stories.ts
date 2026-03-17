import { createRoute, z, OpenAPIHono } from '@hono/zod-openapi'
import { PaginationQuerySchema, paginatedResponse, paginate } from '../lib/openapi'
import { mockStories } from '../lib/mock-data'

const StoryItemSchema = z.object({
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
}).openapi('StoryItem')

const stories = new OpenAPIHono()

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
    (c) => {
        const { lang, pageIndex, pageSize } = c.req.valid('query')

        const active = mockStories.filter((s) => s.is_active)
        const paged = active.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize)

        const items = paged.map((story) => {
            const translation = story.story_translations.find((t) => t.language === lang)
                ?? story.story_translations[0]
            return {
                id: story.id,
                order: story.order,
                imageUrl: story.image_url,
                videoUrl: story.video_url,
                title: translation.title,
                description: translation.description,
                content: translation.content,
                language: translation.language,
                createdAt: story.created_at,
                updatedAt: story.updated_at,
            }
        })

        return c.json({
            message: 'Stories fetched successfully',
            data: { ...paginate(pageIndex, pageSize, active.length), items, requestedLanguage: lang, returnedLanguage: lang },
        })
    },
)

export default stories

import { createRoute, z, OpenAPIHono } from '@hono/zod-openapi'
import { eq, and, asc, count } from 'drizzle-orm'
import { PaginationQuerySchema, LanguageHeaderSchema, paginatedResponse, paginate } from '../lib/openapi'
import { getDb } from '../lib/db'
import { religiousStories as religiousStoriesTable, religiousStoryTranslations } from '../lib/schema'
import type { Bindings } from '../lib/bindings'

const ReligiousStoryItemSchema = z.object({
    id: z.string().uuid(),
    order: z.number(),
    imageUrl: z.string().url().nullable(),
    mediaUrl: z.string().url().nullable(),
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
        path: '/{id}',
        tags: ['Religious Stories'],
        summary: 'Get Religious Story by ID',
        request: {
            params: z.object({
                id: z.string().uuid().openapi({ param: { name: 'id', in: 'path' }, example: '550e8400-e29b-41d4-a716-446655440000' }),
            }),
            headers: LanguageHeaderSchema,
        },
        responses: {
            200: {
                description: 'Religious story fetched successfully',
                content: {
                    'application/json': {
                        schema: z.object({
                            message: z.string(),
                            data: ReligiousStoryItemSchema.extend({
                                requestedLanguage: z.string(),
                                returnedLanguage: z.string(),
                            }),
                        }),
                    },
                },
            },
            404: {
                description: 'Religious story not found',
                content: {
                    'application/json': {
                        schema: z.object({ message: z.string() }),
                    },
                },
            },
        },
    }),
    async (c) => {
        const { id } = c.req.valid('param')
        const { 'Accept-Language': lang } = c.req.valid('header')
        const db = getDb(c.env.DB)

        const [item] = await db.select({
            id: religiousStoriesTable.id,
            order: religiousStoriesTable.order,
            imageUrl: religiousStoriesTable.imageUrl,
            mediaUrl: religiousStoryTranslations.mediaUrl,
            title: religiousStoryTranslations.title,
            description: religiousStoryTranslations.description,
            content: religiousStoryTranslations.content,
            language: religiousStoryTranslations.language,
            createdAt: religiousStoriesTable.createdAt,
            updatedAt: religiousStoriesTable.updatedAt,
        })
            .from(religiousStoriesTable)
            .innerJoin(
                religiousStoryTranslations,
                eq(religiousStoryTranslations.storyId, religiousStoriesTable.id),
            )
            .where(and(
                eq(religiousStoriesTable.id, id),
                eq(religiousStoriesTable.isActive, 1),
                eq(religiousStoryTranslations.language, lang),
            ))
            .limit(1)

        if (!item) {
            return c.json({ message: 'Religious story not found' }, 404)
        }

        return c.json({
            message: 'Religious story fetched successfully',
            data: {
                ...item,
                requestedLanguage: lang,
                returnedLanguage: lang,
            },
        })
    },
)

religiousStories.openapi(
    createRoute({
        method: 'get',
        path: '/',
        tags: ['Religious Stories'],
        summary: 'List Religious Stories',
        request: {
            query: PaginationQuerySchema,
            headers: LanguageHeaderSchema,
        },
        responses: {
            200: {
                description: 'Religious stories fetched successfully',
                content: { 'application/json': { schema: paginatedResponse(ReligiousStoryItemSchema) } },
            },
        },
    }),
    async (c) => {
        const { pageIndex, pageSize } = c.req.valid('query')
        const { 'Accept-Language': lang } = c.req.valid('header')
        const db = getDb(c.env.DB)

        const [items, [{ total }]] = await Promise.all([
            db.select({
                id: religiousStoriesTable.id,
                order: religiousStoriesTable.order,
                imageUrl: religiousStoriesTable.imageUrl,
                mediaUrl: religiousStoryTranslations.mediaUrl,
                title: religiousStoryTranslations.title,
                description: religiousStoryTranslations.description,
                content: religiousStoryTranslations.content,
                language: religiousStoryTranslations.language,
                createdAt: religiousStoriesTable.createdAt,
                updatedAt: religiousStoriesTable.updatedAt,
            })
                .from(religiousStoriesTable)
                .innerJoin(
                    religiousStoryTranslations,
                    eq(religiousStoryTranslations.storyId, religiousStoriesTable.id),
                )
                .where(and(eq(religiousStoriesTable.isActive, 1), eq(religiousStoryTranslations.language, lang)))
                .orderBy(asc(religiousStoriesTable.order))
                .limit(pageSize)
                .offset(pageIndex * pageSize),
            db.select({ total: count() })
                .from(religiousStoriesTable)
                .where(eq(religiousStoriesTable.isActive, 1)),
        ])

        return c.json({
            message: 'Religious stories fetched successfully',
            data: {
                ...paginate(pageIndex, pageSize, total),
                items,
                requestedLanguage: lang,
                returnedLanguage: lang,
            },
        })
    },
)

export default religiousStories

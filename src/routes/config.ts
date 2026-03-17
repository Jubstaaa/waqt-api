import { createRoute, z, OpenAPIHono } from '@hono/zod-openapi'
import { eq, count } from 'drizzle-orm'
import { LanguageHeaderSchema } from '../lib/openapi'
import { getDb } from '../lib/db'
import {
    storyTranslations,
    religiousStoryTranslations,
    templateTranslations,
} from '../lib/schema'
import type { Bindings } from '../lib/bindings'

const ConfigResponseSchema = z.object({
    stories: z.boolean(),
    religiousStories: z.boolean(),
    templates: z.boolean(),
}).openapi('ConfigResponse')

const config = new OpenAPIHono<{ Bindings: Bindings }>()

config.openapi(
    createRoute({
        method: 'get',
        path: '/',
        tags: ['Config'],
        summary: 'Get Feature Configuration for Language',
        request: {
            headers: LanguageHeaderSchema,
        },
        responses: {
            200: {
                description: 'Feature configuration fetched successfully',
                content: { 'application/json': { schema: ConfigResponseSchema } },
            },
        },
    }),
    async (c) => {
        const { 'Accept-Language': lang } = c.req.valid('header')
        const db = getDb(c.env.DB)

        const [storyRes, religiousStoryRes, templateRes] = await Promise.all([
            db.select({ value: count() })
                .from(storyTranslations)
                .where(eq(storyTranslations.language, lang)),
            db.select({ value: count() })
                .from(religiousStoryTranslations)
                .where(eq(religiousStoryTranslations.language, lang)),
            db.select({ value: count() })
                .from(templateTranslations)
                .where(eq(templateTranslations.language, lang)),
        ])

        const storyCount = storyRes[0]?.value ?? 0
        const religiousStoryCount = religiousStoryRes[0]?.value ?? 0
        const templateCount = templateRes[0]?.value ?? 0

        return c.json({
            stories: storyCount > 0,
            religiousStories: religiousStoryCount > 0,
            templates: templateCount > 0,
        })
    },
)

export default config

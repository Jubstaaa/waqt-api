import { createRoute, z, OpenAPIHono } from '@hono/zod-openapi'
import { eq, and, count } from 'drizzle-orm'
import { defaultHook, LanguageHeaderSchema } from '../lib/openapi'
import { db } from '../lib/db'
import {
    stories,
    storyTranslations,
    religiousStories,
    religiousStoryTranslations,
    templates,
    templateTranslations,
} from '../lib/schema'

const ConfigResponseSchema = z.object({
    stories: z.boolean(),
    religiousStories: z.boolean(),
    templates: z.boolean(),
}).openapi('ConfigResponse')

const config = new OpenAPIHono({ defaultHook })

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
        const lang = c.get('language')

        const [storyRes, religiousStoryRes, templateRes] = await Promise.all([
            db.select({ value: count() })
                .from(storyTranslations)
                .innerJoin(stories, eq(stories.id, storyTranslations.storyId))
                .where(and(eq(stories.isActive, 1), eq(storyTranslations.language, lang))),
            db.select({ value: count() })
                .from(religiousStoryTranslations)
                .innerJoin(religiousStories, eq(religiousStories.id, religiousStoryTranslations.storyId))
                .where(and(eq(religiousStories.isActive, 1), eq(religiousStoryTranslations.language, lang))),
            db.select({ value: count() })
                .from(templateTranslations)
                .innerJoin(templates, eq(templates.id, templateTranslations.templateId))
                .where(and(eq(templates.isActive, 1), eq(templateTranslations.language, lang))),
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

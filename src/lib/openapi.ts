import { z } from '@hono/zod-openapi'

export const SUPPORTED_LANGUAGES = [
    'tr', 'en', 'ar', 'az', 'am', 'bn', 'bs', 'ckb', 'de', 'es', 'fa',
    'fr', 'ha', 'hi', 'id', 'it', 'ja', 'ko', 'ml', 'ms', 'nb', 'nl',
    'ps', 'pt', 'ru', 'so', 'sq', 'sv', 'sw', 'ta', 'th', 'ur', 'uz', 'zh',
] as const

export const LangParam = z
    .preprocess(
        (val) => {
            if (typeof val !== 'string') return 'en'
            // "en,en-US;q=0.9,tr;q=0.8" -> "en"
            const lang = val.split(',')[0].split(';')[0].split('-')[0].toLowerCase()
            return SUPPORTED_LANGUAGES.includes(lang as any) ? lang : 'en'
        },
        z.enum(SUPPORTED_LANGUAGES).default('en'),
    )
    .openapi({
        param: {
            name: 'Accept-Language',
            in: 'header',
            description: 'Standard Accept-Language header',
        },
        example: 'en',
        type: 'string',
        enum: [...SUPPORTED_LANGUAGES],
        default: 'en',
    })

export const LanguageHeaderSchema = z.object({
    'Accept-Language': LangParam,
})

export const PageIndexParam = z.coerce.number().int().min(0).default(0).openapi({
    param: { name: 'pageIndex', in: 'query' },
    example: 0,
})

export const PageSizeParam = z.coerce.number().int().min(1).max(100).default(10).openapi({
    param: { name: 'pageSize', in: 'query' },
    example: 10,
})

export const PaginationQuerySchema = z.object({
    pageIndex: PageIndexParam,
    pageSize: PageSizeParam,
})

export function paginatedResponse<T extends z.ZodTypeAny>(itemSchema: T) {
    return z.object({
        message: z.string(),
        data: z.object({
            pageIndex: z.number(),
            hasNextPage: z.boolean(),
            itemCount: z.number(),
            maxPageCount: z.number(),
            items: z.array(itemSchema),
            requestedLanguage: z.string(),
            returnedLanguage: z.string(),
        }),
    })
}

export function paginate(pageIndex: number, pageSize: number, totalCount: number) {
    const maxPageCount = Math.ceil(totalCount / pageSize)
    const hasNextPage = pageIndex + 1 < maxPageCount
    return { pageIndex, hasNextPage, itemCount: totalCount, maxPageCount }
}

import { z } from '@hono/zod-openapi'

export const LangParam = z.enum(['tr', 'en', 'ar']).default('tr').openapi({
    param: { name: 'lang', in: 'query' },
    example: 'tr',
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
    lang: LangParam,
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

import { z } from 'zod'

export const SUPPORTED_LANGUAGES = ['tr', 'en', 'ar'] as const
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number]
export const DEFAULT_LANGUAGE: SupportedLanguage = 'tr'

export const PaginationQuerySchema = z.object({
    lang: z.enum(SUPPORTED_LANGUAGES).optional().default(DEFAULT_LANGUAGE),
    pageIndex: z.coerce.number().int().min(0).optional().default(0),
    pageSize: z.coerce.number().int().min(1).max(100).optional().default(10),
})

export type PaginationQuery = z.infer<typeof PaginationQuerySchema>

export function paginate(pageIndex: number, pageSize: number, totalCount: number) {
    const maxPageCount = Math.ceil(totalCount / pageSize)
    const hasNextPage = pageIndex + 1 < maxPageCount
    return { pageIndex, hasNextPage, itemCount: totalCount, maxPageCount }
}

import { beforeEach, describe, expect, it } from 'vitest'
import {
    get,
    resetDb,
    responseSchema,
    seedFaq,
    seedReligiousStory,
    seedStory,
    seedTemplate,
} from './helpers'

const en = { 'Accept-Language': 'en' }

beforeEach(resetDb)

describe('public routes', () => {
    it.each([
        ['/faqs', () => seedFaq(1, ['en'])],
        ['/stories', () => seedStory('en')],
        ['/religious-stories', () => seedReligiousStory('en')],
        ['/templates', () => seedTemplate('en')],
        ['/config', () => seedStory('en')],
    ])('GET %s matches its response schema', async (path, seed) => {
        await seed()
        const res = await get(path, en)
        expect(res.status).toBe(200)
        responseSchema('get', path).parse(await res.json())
    })

    it('GET /religious-stories/{id} matches its response schema', async () => {
        const id = await seedReligiousStory('en')
        const res = await get(`/religious-stories/${id}`, en)
        expect(res.status).toBe(200)
        responseSchema('get', '/religious-stories/{id}').parse(await res.json())
    })

    it('GET /religious-stories/{id} returns 404 for an unknown id', async () => {
        const res = await get(`/religious-stories/${crypto.randomUUID()}`, en)
        expect(res.status).toBe(404)
    })

    it('GET /config reports only features translated in the requested language', async () => {
        await seedStory('en')
        await seedTemplate('tr')
        const res = await get('/config', en)
        expect(await res.json()).toEqual({
            stories: true,
            religiousStories: false,
            templates: false,
        })
    })

    it('GET /config ignores inactive items', async () => {
        await seedStory('en', 0)
        const res = await get('/config', en)
        expect(await res.json()).toMatchObject({ stories: false })
    })
})

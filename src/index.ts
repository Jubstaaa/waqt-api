import { OpenAPIHono } from '@hono/zod-openapi'
import { apiReference } from '@scalar/hono-api-reference'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import faqs from './routes/faqs'
import stories from './routes/stories'
import templates from './routes/templates'
import type { Bindings } from './lib/bindings'

const app = new OpenAPIHono<{ Bindings: Bindings }>()

app.use('*', logger())
app.use('*', cors())

app.get('/', (c) => c.json({ status: 'ok', version: '1.0.0' }))

app.route('/faqs', faqs)
app.route('/stories', stories)
app.route('/templates', templates)

app.doc('/openapi.json', {
    openapi: '3.0.0',
    info: { title: 'Waqt API', version: '1.0.0' },
})

app.get('/docs', apiReference({ spec: { url: '/openapi.json' } }))

app.notFound((c) => c.json({ message: 'Not found' }, 404))

export default app

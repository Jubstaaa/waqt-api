import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const faqs = sqliteTable('faqs', {
    id: text('id').primaryKey(),
    order: integer('order').notNull(),
    isActive: integer('is_active').notNull(),
    createdAt: text('created_at').notNull(),
    updatedAt: text('updated_at').notNull(),
})

export const faqTranslations = sqliteTable('faq_translations', {
    faqId: text('faq_id').notNull(),
    question: text('question').notNull(),
    answer: text('answer').notNull(),
    language: text('language').notNull(),
})

export const stories = sqliteTable('stories', {
    id: text('id').primaryKey(),
    order: integer('order').notNull(),
    type: integer('type').notNull(),
    coverImageUrl: text('cover_image_url'),
    contentImageUrl: text('content_image_url'),
    isActive: integer('is_active').notNull(),
    createdAt: text('created_at').notNull(),
    updatedAt: text('updated_at').notNull(),
})

export const storyTranslations = sqliteTable('story_translations', {
    storyId: text('story_id').notNull(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    language: text('language').notNull(),
})

export const religiousStories = sqliteTable('religious_stories', {
    id: text('id').primaryKey(),
    order: integer('order').notNull(),
    imageUrl: text('image_url'),
    mediaUrl: text('media_url'),
    isActive: integer('is_active').notNull(),
    createdAt: text('created_at').notNull(),
    updatedAt: text('updated_at').notNull(),
})

export const religiousStoryTranslations = sqliteTable('religious_story_translations', {
    storyId: text('story_id').notNull(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    content: text('content').notNull(),
    language: text('language').notNull(),
})

export const templates = sqliteTable('templates', {
    id: text('id').primaryKey(),
    order: integer('order').notNull(),
    imageUrl: text('image_url'),
    isActive: integer('is_active').notNull(),
    createdAt: text('created_at').notNull(),
    updatedAt: text('updated_at').notNull(),
})

export const templateTranslations = sqliteTable('template_translations', {
    templateId: text('template_id').notNull(),
    text: text('text').notNull(),
    language: text('language').notNull(),
})

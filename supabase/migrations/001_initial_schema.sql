-- FAQs
CREATE TABLE faqs (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))),
    "order" INTEGER NOT NULL UNIQUE,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE faq_translations (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))),
    faq_id TEXT NOT NULL REFERENCES faqs(id) ON DELETE CASCADE,
    language TEXT NOT NULL CHECK (language IN ('tr', 'en', 'ar')),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(faq_id, language)
);

-- Stories
CREATE TABLE stories (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))),
    "order" INTEGER NOT NULL UNIQUE,
    image_url TEXT,
    video_url TEXT,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE story_translations (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))),
    story_id TEXT NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
    language TEXT NOT NULL CHECK (language IN ('tr', 'en', 'ar')),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(story_id, language)
);

-- Templates
CREATE TABLE templates (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))),
    "order" INTEGER NOT NULL UNIQUE,
    image_url TEXT,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE template_translations (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))),
    template_id TEXT NOT NULL REFERENCES templates(id) ON DELETE CASCADE,
    language TEXT NOT NULL CHECK (language IN ('tr', 'en', 'ar')),
    text TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(template_id, language)
);

-- Indexes
CREATE INDEX idx_faqs_order ON faqs("order");
CREATE INDEX idx_faqs_active ON faqs(is_active);
CREATE INDEX idx_faq_translations_faq_id ON faq_translations(faq_id);
CREATE INDEX idx_faq_translations_language ON faq_translations(language);

CREATE INDEX idx_stories_order ON stories("order");
CREATE INDEX idx_stories_active ON stories(is_active);
CREATE INDEX idx_story_translations_story_id ON story_translations(story_id);
CREATE INDEX idx_story_translations_language ON story_translations(language);

CREATE INDEX idx_templates_order ON templates("order");
CREATE INDEX idx_templates_active ON templates(is_active);
CREATE INDEX idx_template_translations_template_id ON template_translations(template_id);
CREATE INDEX idx_template_translations_language ON template_translations(language);

-- updated_at triggers
CREATE TRIGGER faqs_updated_at AFTER UPDATE ON faqs BEGIN UPDATE faqs SET updated_at = datetime('now') WHERE id = NEW.id; END;
CREATE TRIGGER faq_translations_updated_at AFTER UPDATE ON faq_translations BEGIN UPDATE faq_translations SET updated_at = datetime('now') WHERE id = NEW.id; END;
CREATE TRIGGER stories_updated_at AFTER UPDATE ON stories BEGIN UPDATE stories SET updated_at = datetime('now') WHERE id = NEW.id; END;
CREATE TRIGGER story_translations_updated_at AFTER UPDATE ON story_translations BEGIN UPDATE story_translations SET updated_at = datetime('now') WHERE id = NEW.id; END;
CREATE TRIGGER templates_updated_at AFTER UPDATE ON templates BEGIN UPDATE templates SET updated_at = datetime('now') WHERE id = NEW.id; END;
CREATE TRIGGER template_translations_updated_at AFTER UPDATE ON template_translations BEGIN UPDATE template_translations SET updated_at = datetime('now') WHERE id = NEW.id; END;

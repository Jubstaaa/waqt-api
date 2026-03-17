-- ============================================
-- FAQS
-- ============================================

CREATE TABLE public.faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "order" INTEGER NOT NULL UNIQUE,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.faq_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    faq_id UUID NOT NULL REFERENCES public.faqs(id) ON DELETE CASCADE,
    language TEXT NOT NULL CHECK (language IN ('tr', 'en', 'ar')),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(faq_id, language)
);

-- ============================================
-- STORIES
-- ============================================

CREATE TABLE public.stories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "order" INTEGER NOT NULL UNIQUE,
    image_url TEXT,
    video_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.story_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    story_id UUID NOT NULL REFERENCES public.stories(id) ON DELETE CASCADE,
    language TEXT NOT NULL CHECK (language IN ('tr', 'en', 'ar')),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(story_id, language)
);

-- ============================================
-- TEMPLATES
-- ============================================

CREATE TABLE public.templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "order" INTEGER NOT NULL UNIQUE,
    image_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.template_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id UUID NOT NULL REFERENCES public.templates(id) ON DELETE CASCADE,
    language TEXT NOT NULL CHECK (language IN ('tr', 'en', 'ar')),
    text TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(template_id, language)
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_faqs_order ON public.faqs("order");
CREATE INDEX idx_faqs_active ON public.faqs(is_active) WHERE is_active = true;
CREATE INDEX idx_faq_translations_faq_id ON public.faq_translations(faq_id);
CREATE INDEX idx_faq_translations_language ON public.faq_translations(language);

CREATE INDEX idx_stories_order ON public.stories("order");
CREATE INDEX idx_stories_active ON public.stories(is_active) WHERE is_active = true;
CREATE INDEX idx_story_translations_story_id ON public.story_translations(story_id);
CREATE INDEX idx_story_translations_language ON public.story_translations(language);

CREATE INDEX idx_templates_order ON public.templates("order");
CREATE INDEX idx_templates_active ON public.templates(is_active) WHERE is_active = true;
CREATE INDEX idx_template_translations_template_id ON public.template_translations(template_id);
CREATE INDEX idx_template_translations_language ON public.template_translations(language);

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_faqs_updated_at BEFORE UPDATE ON public.faqs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_faq_translations_updated_at BEFORE UPDATE ON public.faq_translations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_stories_updated_at BEFORE UPDATE ON public.stories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_story_translations_updated_at BEFORE UPDATE ON public.story_translations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_templates_updated_at BEFORE UPDATE ON public.templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_template_translations_updated_at BEFORE UPDATE ON public.template_translations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- RLS (public read, no auth needed)
-- ============================================

ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faq_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.template_translations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read faqs" ON public.faqs FOR SELECT USING (true);
CREATE POLICY "public read faq_translations" ON public.faq_translations FOR SELECT USING (true);
CREATE POLICY "public read stories" ON public.stories FOR SELECT USING (true);
CREATE POLICY "public read story_translations" ON public.story_translations FOR SELECT USING (true);
CREATE POLICY "public read templates" ON public.templates FOR SELECT USING (true);
CREATE POLICY "public read template_translations" ON public.template_translations FOR SELECT USING (true);

export const mockFaqs = [
    {
        id: '1a2b3c4d-0001-0000-0000-000000000001',
        order: 1,
        is_active: true,
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
        faq_translations: [
            { language: 'tr', question: 'Waqt nedir?', answer: 'Waqt, günlük rutinlerini ve zamanını yönetmene yardımcı olan bir uygulamadır.' },
            { language: 'en', question: 'What is Waqt?', answer: 'Waqt is an app that helps you manage your daily routines and time.' },
            { language: 'ar', question: 'ما هو وقت؟', answer: 'وقت هو تطبيق يساعدك على إدارة روتينك اليومي ووقتك.' },
        ],
    },
    {
        id: '1a2b3c4d-0001-0000-0000-000000000002',
        order: 2,
        is_active: true,
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
        faq_translations: [
            { language: 'tr', question: 'Uygulama ücretsiz mi?', answer: 'Evet, temel özellikler tamamen ücretsizdir. Premium özellikler için abonelik gerekmektedir.' },
            { language: 'en', question: 'Is the app free?', answer: 'Yes, basic features are completely free. A subscription is required for premium features.' },
            { language: 'ar', question: 'هل التطبيق مجاني؟', answer: 'نعم، الميزات الأساسية مجانية تمامًا. يلزم اشتراك للميزات المميزة.' },
        ],
    },
    {
        id: '1a2b3c4d-0001-0000-0000-000000000003',
        order: 3,
        is_active: true,
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
        faq_translations: [
            { language: 'tr', question: 'Verilerimi nasıl silerim?', answer: 'Ayarlar > Hesap > Hesabı Sil adımlarını takip ederek tüm verilerinizi silebilirsiniz.' },
            { language: 'en', question: 'How do I delete my data?', answer: 'You can delete all your data by following Settings > Account > Delete Account steps.' },
            { language: 'ar', question: 'كيف أحذف بياناتي؟', answer: 'يمكنك حذف جميع بياناتك باتباع الخطوات: الإعدادات > الحساب > حذف الحساب.' },
        ],
    },
]

export const mockStories = [
    {
        id: '2a2b3c4d-0002-0000-0000-000000000001',
        order: 1,
        image_url: 'https://picsum.photos/seed/story1/800/600',
        video_url: null,
        is_active: true,
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
        story_translations: [
            { language: 'tr', title: 'Sabah Rutinin Gücü', description: 'Güne nasıl başladığın, günün geri kalanını şekillendirir.', content: 'Her sabah aynı saatte kalkmak, beynini düzene sokar. İlk 30 dakikayı telefon olmadan geçirmeye çalış. Su iç, hafif bir egzersiz yap ve o günün tek önemli hedefini belirle.' },
            { language: 'en', title: 'The Power of Morning Routine', description: 'How you start your day shapes the rest of it.', content: 'Waking up at the same time every morning puts your brain in order. Try to spend the first 30 minutes without your phone. Drink water, do some light exercise, and set the one important goal for the day.' },
            { language: 'ar', title: 'قوة روتين الصباح', description: 'طريقة بدء يومك تشكّل بقية اليوم.', content: 'الاستيقاظ في نفس الوقت كل صباح ينظم عقلك. حاول قضاء أول 30 دقيقة بدون هاتف. اشرب الماء، مارس تمرينًا خفيفًا، وحدد الهدف الأهم لهذا اليوم.' },
        ],
    },
    {
        id: '2a2b3c4d-0002-0000-0000-000000000002',
        order: 2,
        image_url: 'https://picsum.photos/seed/story2/800/600',
        video_url: 'https://www.w3schools.com/html/mov_bbb.mp4',
        is_active: true,
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
        story_translations: [
            { language: 'tr', title: 'Odaklanmanın Sırrı', description: 'Çoklu görev aslında seni yavaşlatıyor.', content: 'Araştırmalar, aynı anda birden fazla iş yapmanın verimliliği %40 düşürdüğünü gösteriyor. Bir göreve odaklan, bitir, sonra bir sonrakine geç. Pomodoro tekniğini dene: 25 dakika çalış, 5 dakika dinlen.' },
            { language: 'en', title: 'The Secret of Focus', description: 'Multitasking is actually slowing you down.', content: 'Research shows that multitasking reduces productivity by 40%. Focus on one task, finish it, then move to the next. Try the Pomodoro technique: work for 25 minutes, rest for 5 minutes.' },
            { language: 'ar', title: 'سر التركيز', description: 'تعدد المهام في الواقع يبطئك.', content: 'تظهر الأبحاث أن تعدد المهام يقلل الإنتاجية بنسبة 40٪. ركّز على مهمة واحدة، أكملها، ثم انتقل إلى التالية. جرّب تقنية بومودورو: اعمل 25 دقيقة، استرح 5 دقائق.' },
        ],
    },
    {
        id: '2a2b3c4d-0002-0000-0000-000000000003',
        order: 3,
        image_url: 'https://picsum.photos/seed/story3/800/600',
        video_url: null,
        is_active: true,
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
        story_translations: [
            { language: 'tr', title: 'Uyku ve Performans', description: 'Az uyku, daha fazla çalışmak anlamına gelmiyor.', content: '7-8 saat uyku; hafıza, karar verme ve yaratıcılık için kritik. Gece yatmadan 1 saat önce ekranları kapat. Yatmadan önce kısa bir "yarın yapacaklarım" listesi çıkar — zihni boşaltır.' },
            { language: 'en', title: 'Sleep & Performance', description: 'Less sleep doesn\'t mean more work done.', content: '7-8 hours of sleep is critical for memory, decision-making, and creativity. Turn off screens 1 hour before bed. Before sleeping, make a short "things to do tomorrow" list — it clears your mind.' },
            { language: 'ar', title: 'النوم والأداء', description: 'النوم القليل لا يعني إنجاز عمل أكثر.', content: '7-8 ساعات من النوم ضرورية للذاكرة واتخاذ القرار والإبداع. أغلق الشاشات قبل ساعة من النوم. قبل النوم، اكتب قائمة قصيرة بـ"مهام الغد" — تفرّغ الذهن.' },
        ],
    },
]

export const mockTemplates = [
    {
        id: '3a2b3c4d-0003-0000-0000-000000000001',
        order: 1,
        image_url: 'https://picsum.photos/seed/template1/400/400',
        is_active: true,
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
        template_translations: [
            { language: 'tr', text: 'Bugün bir adım at. Küçük olsun, ama at.' },
            { language: 'en', text: 'Take one step today. Let it be small, but take it.' },
            { language: 'ar', text: 'خذ خطوة واحدة اليوم. لتكن صغيرة، لكن خذها.' },
        ],
    },
    {
        id: '3a2b3c4d-0003-0000-0000-000000000002',
        order: 2,
        image_url: 'https://picsum.photos/seed/template2/400/400',
        is_active: true,
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
        template_translations: [
            { language: 'tr', text: 'Zamanın sınırlı. Ama önceliklerin daha da sınırlı.' },
            { language: 'en', text: 'Your time is limited. But your priorities are even more so.' },
            { language: 'ar', text: 'وقتك محدود. لكن أولوياتك أكثر محدودية.' },
        ],
    },
    {
        id: '3a2b3c4d-0003-0000-0000-000000000003',
        order: 3,
        image_url: 'https://picsum.photos/seed/template3/400/400',
        is_active: true,
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
        template_translations: [
            { language: 'tr', text: 'Disiplin, motivasyon bittiğinde devreye girer.' },
            { language: 'en', text: 'Discipline kicks in when motivation runs out.' },
            { language: 'ar', text: 'الانضباط يتدخل عندما ينفد الحافز.' },
        ],
    },
    {
        id: '3a2b3c4d-0003-0000-0000-000000000004',
        order: 4,
        image_url: 'https://picsum.photos/seed/template4/400/400',
        is_active: true,
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
        template_translations: [
            { language: 'tr', text: 'Mükemmel plan yok. Başlayan plan var.' },
            { language: 'en', text: 'There\'s no perfect plan. There\'s only the plan you start.' },
            { language: 'ar', text: 'لا توجد خطة مثالية. يوجد فقط الخطة التي تبدأها.' },
        ],
    },
    {
        id: '3a2b3c4d-0003-0000-0000-000000000005',
        order: 5,
        image_url: 'https://picsum.photos/seed/template5/400/400',
        is_active: true,
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
        template_translations: [
            { language: 'tr', text: 'Her gün biraz daha iyi olmak yeter.' },
            { language: 'en', text: 'Getting a little better every day is enough.' },
            { language: 'ar', text: 'يكفي أن تتحسن قليلًا كل يوم.' },
        ],
    },
]

import type { ArticleRss } from '@/models/article';
import type { RecommendedRssSource } from '@/models/rssSource';

export const MOCK_ARTICLES: ArticleRss[] = [
    {
        id: '1',
        title: 'How AI is Changing Education',
        description: 'Artificial Intelligence is revolutionizing the way we learn components in the classroom. This article explores the impact of AI on personalized learning and administrative efficiency.',
        source: 'TechCrunch',
        pubDate: new Date('2025-12-20T08:30:00Z'),
        link: 'https://example.com/ai-edu',
        picUrl: 'https://picsum.photos/seed/ai-edu/600/400'
    },
    {
        id: '2',
        title: 'The Future of Renewable Energy',
        description: 'Solar and wind power are becoming increasingly cost-effective. Discover how global energy grids are adapting to these fluctuating power sources.',
        source: 'Wired',
        pubDate: new Date('2025-12-19T14:15:00Z'),
        link: 'https://example.com/renewable',
        picUrl: 'https://picsum.photos/seed/energy/600/400'
    },
    {
        id: '3',
        title: 'SpaceX Mars Mission Updates',
        description: 'The latest progress on the Starship development and the roadmap for the first crewed mission to the Red Planet.',
        source: 'Space.com',
        pubDate: new Date('2025-12-18T10:00:00Z'),
        link: 'https://example.com/spacex',
        picUrl: 'https://picsum.photos/seed/mars/600/400'
    },
    {
        id: '4',
        title: 'Quantum Computing Breakthrough',
        description: 'Researchers have achieved a new record in qubit coherence time, bringing us one step closer to practical quantum computers.',
        source: 'Nature',
        pubDate: new Date('2025-12-17T09:45:00Z'),
        link: 'https://example.com/quantum',
        picUrl: 'https://picsum.photos/seed/quantum/600/400'
    },
    {
        id: '5',
        title: 'Neuroscience and Learning',
        description: 'Understanding how the brain forms memories can help educators design better teaching strategies for diverse learners.',
        source: 'Scientific American',
        pubDate: new Date('2025-12-16T16:20:00Z'),
        link: 'https://example.com/neuro',
        picUrl: 'https://picsum.photos/seed/neuro/600/400'
    }
];

export const MOCK_RECOMMENDED_SOURCES: RecommendedRssSource[] = [
    {
        id: 'rec-1',
        url: 'https://techcrunch.com/feed/',
        name: 'TechCrunch',
        description: 'The latest technology news and information on startups.'
    },
    {
        id: 'rec-2',
        url: 'https://www.wired.com/feed/rss',
        name: 'Wired',
        description: 'In-depth coverage of current and future trends in technology, culture, and business.'
    },
    {
        id: 'rec-3',
        url: 'https://www.theverge.com/rss/index.xml',
        name: 'The Verge',
        description: 'Reporting on the intersection of technology, science, art, and culture.'
    }
];

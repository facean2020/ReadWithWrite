import React, { useState } from 'react';
import type { ArticleRss } from '@/models/article';
import { useImageCache } from '@/hooks/useImageCache';
import { MOCK_ARTICLES } from '@/mocks/readMock';
import { RssSourceDialog } from '@/components/RssSourceDialog';
import { Skeleton } from '@/components/ui/skeleton';

const ArticleCard: React.FC<{ article: ArticleRss }> = ({ article }) => {
    const { src, loading, error } = useImageCache(article.picUrl);

    const formatDate = (date: Date) => {
        return date.toLocaleDateString(undefined, { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    };

    return (
        <div className="flex bg-card rounded-lg border shadow-sm overflow-hidden hover:shadow-md transition-shadow group mb-6">
            {/* Image Area 3:2 */}
            <div className="w-1/3 min-w-[120px] md:min-w-[180px] lg:min-w-[240px] aspect-[3/2] bg-muted relative shrink-0">
                {loading && (
                    <Skeleton className="absolute inset-0 w-full h-full" />
                )}
                {src && !loading && !error && (
                    <img 
                        src={src} 
                        alt={article.title} 
                        className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                    />
                )}
                {(error || (!src && !loading)) && (
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-muted p-2 text-center text-[10px] md:text-sm">
                        {error ? 'Err' : 'No Img'}
                    </div>
                )}
            </div>

            {/* Content Area */}
            <div className="flex-1 p-3 md:p-4 lg:p-6 flex flex-col justify-between text-left">
                <div>
                    <div className="flex justify-between items-start mb-1 md:mb-2">
                        <span className="text-[10px] md:text-xs font-medium text-blue-500 uppercase tracking-wider">{article.source}</span>
                        <span className="text-[10px] md:text-xs text-muted-foreground">
                            {formatDate(article.pubDate)}
                        </span>
                    </div>
                    <h3 className="text-sm md:text-lg lg:text-xl font-bold leading-tight line-clamp-2 mb-1 md:mb-2 group-hover:text-primary transition-colors">
                        <a href={article.link} target="_blank" rel="noopener noreferrer">
                            {article.title}
                        </a>
                    </h3>
                    <p className="text-xs md:text-sm text-muted-foreground line-clamp-2 md:line-clamp-3">
                        {article.description}
                    </p>
                </div>
            </div>
        </div>
    );
};

const Read: React.FC = () => {
    const [articles] = useState<ArticleRss[]>(MOCK_ARTICLES);

    const handleAddSource = (url: string, name: string) => {
        console.log(`Adding source: ${name} (${url})`);
        alert(`Adding source: ${name}. Implementation for fetching will be added soon.`);
    };

    return (
        <div className="max-w-4xl mx-auto flex flex-col items-stretch">
            {/* Header with RSS Management */}
            <div className="flex justify-between items-center mb-8 border-b pb-4">
                <div className="text-left">
                    <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Read</h1>
                    <p className="text-muted-foreground text-sm mt-1">Discover latest articles from your favorite RSS feeds.</p>
                </div>
                <RssSourceDialog onAddSource={handleAddSource} />
            </div>

            {/* Articles List */}
            <div className="w-full space-y-4">
                {articles.map(article => (
                    <ArticleCard key={article.id} article={article} />
                ))}
            </div>
        </div>
    );
}

export default Read;

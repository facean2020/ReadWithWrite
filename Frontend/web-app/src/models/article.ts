
export interface ArticleRss {
    id: string; // Unique identifier for the article
    title: string; // Title of the article
    source: string; // Source of the article
    pubDate: Date; // Publication date
    link: string; // Link to the full article
}

export interface ArticleDetail {
    id: string;
    title: string;
    summary: string;
    source: string;
    link: string;
    pubDate: Date;
    picUrl?: string; // Optional picture URL
}
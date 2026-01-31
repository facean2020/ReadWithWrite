
export interface ArticleRss {
    id: string; // Unique identifier for the article
    title: string; // Title of the article
    despcription: string; // Short description or summary
    source: string; // Source of the article
    pubDate: Date; // Publication date
    link: string; // Link to the full article
    picUrl: string; // URL of the article's image
}
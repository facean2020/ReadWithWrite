# Web API Design

Status: Not Started

# Reader Related

1. Get article list

```jsx
GET /api/articles
Query: 
  page=1
  pageSize=10
  
Response 200:
{
  "items": [
    {
      "id": "guid-or-url-hash",
      "title": "How AI is Changing Education",
      "description": "Description"
      "source": "TechCrunch",
      "publishDate": "2025-12-20T08:30:00Z"
      "link": "https://example.com/blog/blogid"
      "picUrl": "https://example.com/blog/blogid/media/img?imgid"
    }
  ],
  "totalCount": 45,
  "page": 1,
  "pageSize": 10
}
```

2. Upload RSS source

```jsx
POST /api/rss-sources
Body:
{
  "url": "https://example.com/rss",
  "name": "Example RSS"
}

Response 200:
{
  "message": "RSS source uploaded successfully",
  "url": "https://example.com/rss"
}
```

3. Get recommended RSS sources

```jsx
GET /api/rss-sources/recommended

Response 200:
[
  {
    "id": "guid",
    "url": "https://techcrunch.com/feed/",
    "name": "TechCrunch",
    "description": "The latest technology news and information on startups."
  }
]
```

# Writing Related

1. Provide daily writing prompt

```jsx
GET /api/writing/daily-prompt

Response 200:
{
  "prompt": "Describe a recent technological breakthrough and its potential impact on society.",
  "date": "2026-01-03"
}
```

2. Submit writing for revision and feedback

```jsx
POST /api/writing/revise
Body:
{
  "text": "I has went to school yesterday.",
  "originalLanguage": "Chinese"
}

Response 200:
{
  "original": "I has went to school yesterday.",
  "revised": "I went to school yesterday.",
  "feedback": "Verb tense error: 'has went' → 'went'. Also, 'I has' should be 'I have' or simply use past simple."
}
```

3. Get writing history list

```jsx
GET /api/writing/history
Query: 
  page=1
  pageSize=50

Response 200:
[
  {
    "id": "guid",
    "topicTitle": "...",
    "content": "...",
    "revisedContent": "...",
    "feedback": "...",
    "createdAt": "2026-01-20T10:00:00Z"
  }
]
```

4. Get specific writing history

```jsx
GET /api/writing/history/{id}

Response 200:
{
  "id": "guid",
  "topicTitle": "...",
  "content": "...",
  "revisedContent": "...",
  "feedback": "...",
  "createdAt": "2026-01-20T10:00:00Z"
}
```
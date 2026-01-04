# Web API Design

状态: 未开始

# Reader相关

1. 获取文章列表

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
      "source": "TechCrunch",
      "publishDate": "2025-12-20T08:30:00Z"
    }
  ],
  "totalCount": 45,
  "page": 1,
  "pageSize": 10
}
```

2. 上传RSS信息源

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

3. 获取推荐RSS信息源

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

# Writing相关

1. 提供每日写作题目

```jsx
GET /api/writing/daily-prompt

Response 200:
{
  "prompt": "Describe a recent technological breakthrough and its potential impact on society.",
  "date": "2026-01-03"
}
```

1. 上传写作，获取提示与修改

```jsx
POST /api/writing/revise
Body:
{
  "text": "I has went to school yesterday."
}

Response 200:
{
  "original": "I has went to school yesterday.",
  "revised": "I went to school yesterday.",
  "feedback": "Verb tense error: 'has went' → 'went'. Also, 'I has' should be 'I have' or simply use past simple."
}
```
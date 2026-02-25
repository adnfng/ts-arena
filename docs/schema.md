# Schema and API Rules

## Official docs

- [Are.na V3 Explorer](https://www.are.na/developers/explore)
- [Are.na V3 OpenAPI JSON](https://api.are.na/v3/openapi.json)

## Base URL

All API requests use:

```text
https://api.are.na
```

## Authentication model

Use standard bearer auth:

```http
Authorization: Bearer YOUR_TOKEN
```

Supported token types:

- OAuth2 access token
- Personal access token

OAuth2 endpoints:

- Authorize: `https://www.are.na/oauth/authorize`
- Token: `https://api.are.na/v3/oauth/token`

Auth levels in v3 docs:

- `Public`: no token required
- `Optional`: works without token, respects permissions when authenticated
- `Required`: returns `401` without valid token

## Rate limits

Per-minute limits by tier:

| Tier | Requests/min |
| --- | --- |
| Guest (unauthenticated) | 30 |
| Free | 120 |
| Premium | 300 |
| Supporter/Lifetime | 600 |

Rate limit headers:

- `X-RateLimit-Limit`
- `X-RateLimit-Tier`
- `X-RateLimit-Window`
- `X-RateLimit-Reset`

## Pagination

List endpoints support:

- `page` (default `1`)
- `per` (default `24`, max `100`)

Expected response shape:

```json
{
  "data": [],
  "meta": {
    "current_page": 1,
    "per_page": 24,
    "total_pages": 1,
    "total_count": 0,
    "next_page": null,
    "prev_page": null,
    "has_more_pages": false
  }
}
```

## Common errors

- `400` invalid request
- `401` missing/invalid auth
- `403` insufficient permissions
- `404` not found
- `429` rate limited

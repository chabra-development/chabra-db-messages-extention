# API Routes - cURL Reference

Base URL: `http://localhost:3000`

---

## Auth

Gerenciado pelo **better-auth**. Aceita múltiplos subpaths via `[...all]`.

### GET /api/auth/[...all]

```bash
curl -X GET http://localhost:3000/api/auth/session \
  -H "Cookie: <session-cookie>"
```

### POST /api/auth/[...all]

```bash
curl -X POST http://localhost:3000/api/auth/sign-in/email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "senha123"
  }'
```

---

## Tags

### GET /api/tags

Lista todas as tags com suporte a paginação e busca.

**Query params opcionais:** `take`, `skip`, `search`

```bash
# Listar todas as tags
curl -X GET "http://localhost:3000/api/tags"

# Com paginação
curl -X GET "http://localhost:3000/api/tags?take=10&skip=0"

# Com busca por nome
curl -X GET "http://localhost:3000/api/tags?search=vip&take=5"
```

### POST /api/tags

Cria uma ou mais tags.

```bash
curl -X POST http://localhost:3000/api/tags \
  -H "Content-Type: application/json" \
  -d '{
    "tags": ["VIP", "Urgente", "Suporte"],
    "createdById": "00000000-0000-0000-0000-000000000000"
  }'
```

---

## Tags por Contato

### GET /api/tags/[id]

Retorna as tags de um contato. O `id` pode ser o `id` ou o `identity` do contato.

```bash
# Por ID do contato
curl -X GET "http://localhost:3000/api/tags/00000000-0000-0000-0000-000000000000"

# Por identity do contato
curl -X GET "http://localhost:3000/api/tags/5511999999999"
```

### PUT /api/tags/[id]

Associa tags a um contato.

```bash
curl -X PUT "http://localhost:3000/api/tags/00000000-0000-0000-0000-000000000000" \
  -H "Content-Type: application/json" \
  -d '{
    "tagIds": ["tag-id-1", "tag-id-2"]
  }'
```

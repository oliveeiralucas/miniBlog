# MiniBlog API — FastAPI + Prisma + PostgreSQL

REST backend para o miniBlog. Substitui completamente o Firebase (Auth + Firestore).

---

## Stack

- **FastAPI** 0.115 — framework web assíncrono
- **Prisma ORM** (prisma-client-py) — ORM type-safe com PostgreSQL
- **PostgreSQL** — banco de dados relacional (via provedor em nuvem)
- **JWT** (python-jose) — autenticação stateless com rotação de refresh token
- **bcrypt** — hashing seguro de senhas (rounds=12)
- **slowapi** — rate limiting por IP

---

## Pré-requisitos

- Python 3.11+
- Conta em um provedor PostgreSQL (Supabase, Railway, Neon, etc.)

---

## Setup

### 1. Criar ambiente virtual

```bash
cd backend
python -m venv .venv
# Windows
.venv\Scripts\activate
# Linux/macOS
source .venv/bin/activate
```

### 2. Instalar dependências

```bash
pip install -r requirements-dev.txt
```

### 3. Configurar variáveis de ambiente

```bash
cp .env.example .env
```

Edite `.env` e preencha:

```env
SECRET_KEY=<gere com: python scripts/generate_secret.py>
DATABASE_URL=postgresql://user:pass@host:5432/miniblog_db?sslmode=require
```

### 4. Gerar o Prisma Client e aplicar o schema ao banco

```bash
python -m prisma generate
python -m prisma db push
```

> `db push` aplica o schema diretamente sem criar arquivos de migration. Use `migrate dev` em produção se quiser histórico de migrations.

### 5. (Opcional) Seed de desenvolvimento

```bash
python scripts/seed.py
```

### 6. Rodar o servidor

```bash
uvicorn app.main:app --reload
```

Acesse: `http://localhost:8000/docs`

---

## Estrutura

```
app/
├── api/v1/routes/     # Endpoints HTTP (auth, posts, comments, tags)
├── services/          # Lógica de negócio
├── repositories/      # Queries ao banco via Prisma
├── schemas/           # Validação de request/response (Pydantic)
├── core/              # Config, segurança, exceções, logging
├── middleware/        # CORS, rate limit, security headers
└── main.py            # App factory
```

---

## Endpoints principais

| Método | Rota | Auth |
|--------|------|------|
| POST | `/api/v1/auth/register` | Não |
| POST | `/api/v1/auth/login` | Não |
| POST | `/api/v1/auth/logout` | Sim |
| GET | `/api/v1/auth/me` | Sim |
| POST | `/api/v1/auth/refresh` | Não |
| GET | `/api/v1/posts` | Opcional |
| GET | `/api/v1/posts/{id}` | Não |
| POST | `/api/v1/posts` | Sim |
| PUT | `/api/v1/posts/{id}` | Sim |
| DELETE | `/api/v1/posts/{id}` | Sim |
| POST | `/api/v1/posts/{id}/like` | Sim |
| DELETE | `/api/v1/posts/{id}/like` | Sim |
| GET | `/api/v1/posts/{id}/comments` | Não |
| POST | `/api/v1/posts/{id}/comments` | Sim |
| DELETE | `/api/v1/comments/{id}` | Sim |
| GET | `/api/v1/tags` | Não |
| GET | `/health` | Não |

---

## Testes

```bash
pytest tests/ -v --cov=app
```

---

## Migração do Firebase

Se você tem dados existentes no Firebase:

```bash
# 1. Coloque o serviceAccountKey.json na pasta backend/
# 2. Execute:
pip install firebase-admin
python migrations/firebase_to_postgres.py
```

"""Development seed script — populates the database with sample data.

Usage (from backend/ directory):
    python scripts/seed.py
"""

import asyncio
import os
import sys

# Ensure the app package is importable when running from the backend/ dir
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.security import hash_password  # noqa: E402
from app.db.engine import close_engine, get_session_factory  # noqa: E402
from app.db.models import Comment, Post, PostLike, PostTag, Tag, User  # noqa: E402
from sqlalchemy import select  # noqa: E402

SAMPLE_USERS = [
    {"email": "alice@example.com", "displayName": "Alice Silva", "password": "password123"},
    {"email": "bob@example.com", "displayName": "Bob Santos", "password": "password123"},
    {"email": "carol@example.com", "displayName": "Carol Oliveira", "password": "password123"},
]

SAMPLE_POSTS = [
    {
        "title": "Começando com FastAPI",
        "image": "https://fastapi.tiangolo.com/img/logo-margin/logo-teal.png",
        "body": (
            "FastAPI é um framework web moderno e rápido para construir APIs com Python. "
            "Ele é baseado em type hints do Python 3.7+ e usa Pydantic para validação de dados. "
            "Com suporte nativo a async/await, consegue alta performance comparável ao NodeJS e Go. "
            "Além disso, gera documentação automática com Swagger UI e ReDoc."
        ),
        "tags": ["fastapi", "python", "backend"],
        "author_index": 0,
    },
    {
        "title": "Por que usar PostgreSQL?",
        "image": "https://www.postgresql.org/media/img/about/press/elephant.png",
        "body": (
            "PostgreSQL é um poderoso sistema de banco de dados objeto-relacional de código aberto. "
            "Com mais de 35 anos de desenvolvimento ativo, tem uma forte reputação de confiabilidade, "
            "robustez e desempenho. Suporta JSON nativo, full-text search, índices parciais e muito mais. "
            "É a escolha ideal para aplicações que precisam de consistência e recursos avançados."
        ),
        "tags": ["postgresql", "database", "sql"],
        "author_index": 1,
    },
    {
        "title": "SQLAlchemy 2.0: ORM Moderno para Python",
        "image": "https://www.sqlalchemy.org/img/sqla_logo.png",
        "body": (
            "SQLAlchemy 2.0 trouxe grandes melhorias em relação à versão anterior. "
            "O novo estilo declarativo com Mapped[] e mapped_column() traz type safety real. "
            "O suporte a async com AsyncSession e create_async_engine permite uso com asyncpg. "
            "A API de queries com select() é muito mais intuitiva e pythônica do que o estilo antigo."
        ),
        "tags": ["sqlalchemy", "python", "orm", "backend"],
        "author_index": 0,
    },
    {
        "title": "React Hooks na Prática",
        "image": "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",
        "body": (
            "Os React Hooks mudaram completamente a forma como escrevemos componentes funcionais. "
            "useState e useEffect cobrem a maioria dos casos de uso. "
            "useContext elimina prop drilling em muitas situações. "
            "Custom hooks permitem reutilizar lógica de estado entre componentes de forma elegante."
        ),
        "tags": ["react", "javascript", "frontend"],
        "author_index": 2,
    },
    {
        "title": "Docker para Desenvolvedores Python",
        "image": "https://www.docker.com/wp-content/uploads/2022/03/Moby-logo.png",
        "body": (
            "Docker é uma ferramenta essencial para qualquer desenvolvedor Python moderno. "
            "Com multi-stage builds, é possível criar imagens enxutas sem ferramentas de build. "
            "Docker Compose simplifica o gerenciamento de múltiplos serviços como app + banco + redis. "
            "Usar volumes para desenvolvimento local mantém o hot-reload funcionando perfeitamente."
        ),
        "tags": ["docker", "python", "devops"],
        "author_index": 1,
    },
    {
        "title": "Autenticação JWT com FastAPI",
        "image": "https://jwt.io/img/pic_logo.svg",
        "body": (
            "Implementar autenticação JWT em FastAPI é direto ao ponto. "
            "O fluxo access token + refresh token oferece segurança e boa experiência ao usuário. "
            "Armazenar apenas o hash SHA-256 do refresh token no banco protege contra vazamentos. "
            "A rotação de tokens a cada uso previne reutilização de tokens comprometidos."
        ),
        "tags": ["fastapi", "jwt", "segurança", "backend"],
        "author_index": 0,
    },
]

SAMPLE_COMMENTS = [
    {"post_index": 0, "author_index": 1, "body": "Ótimo artigo! FastAPI realmente é muito produtivo."},
    {"post_index": 0, "author_index": 2, "body": "Uso em produção há 1 ano, recomendo demais!"},
    {"post_index": 1, "author_index": 0, "body": "PostgreSQL com asyncpg é uma combinação incrível de performance."},
    {"post_index": 2, "author_index": 1, "body": "Finalmente migrei do Prisma pro SQLAlchemy 2.0, muito melhor!"},
    {"post_index": 2, "author_index": 2, "body": "O Mapped[] com type hints é uma mão na roda para IDEs."},
    {"post_index": 3, "author_index": 0, "body": "useCallback e useMemo também valem muito a pena estudar."},
    {"post_index": 4, "author_index": 2, "body": "Multi-stage builds reduzem o tamanho da imagem dramaticamente."},
    {"post_index": 5, "author_index": 1, "body": "Implementei exatamente essa estratégia de tokens no meu projeto!"},
]


async def seed() -> None:
    factory = get_session_factory()

    async with factory() as session:
        print("Seeding users...")
        user_ids: list[str] = []
        for user_data in SAMPLE_USERS:
            result = await session.execute(
                select(User).where(User.email == user_data["email"])
            )
            existing = result.scalar_one_or_none()
            if existing:
                user_ids.append(existing.id)
                print(f"  Skipped (already exists): {user_data['email']}")
                continue

            user = User(
                email=user_data["email"],
                displayName=user_data["displayName"],
                passwordHash=hash_password(user_data["password"]),
            )
            session.add(user)
            await session.flush()
            user_ids.append(user.id)
            print(f"  Created: {user.email}")

        await session.commit()

        print("Seeding posts...")
        post_ids: list[str] = []
        for post_data in SAMPLE_POSTS:
            author_id = user_ids[post_data["author_index"]]

            post = Post(
                title=post_data["title"],
                image=post_data["image"],
                body=post_data["body"],
                authorId=author_id,
            )
            session.add(post)
            await session.flush()

            for tag_name in post_data["tags"]:
                result = await session.execute(
                    select(Tag).where(Tag.name == tag_name)
                )
                tag = result.scalar_one_or_none()
                if tag is None:
                    tag = Tag(name=tag_name)
                    session.add(tag)
                    await session.flush()
                session.add(PostTag(postId=post.id, tagId=tag.id))

            post_ids.append(post.id)
            print(f"  Created: {post.title}")

        await session.commit()

        print("Seeding comments...")
        for comment_data in SAMPLE_COMMENTS:
            comment = Comment(
                body=comment_data["body"],
                postId=post_ids[comment_data["post_index"]],
                authorId=user_ids[comment_data["author_index"]],
            )
            session.add(comment)
            print(f"  Created comment on post #{comment_data['post_index']}")

        await session.commit()

        print("Seeding likes...")
        likes = [
            (0, 1), (0, 2),   # post 0 liked by bob and carol
            (1, 0), (1, 2),   # post 1 liked by alice and carol
            (2, 1),           # post 2 liked by bob
            (3, 0), (3, 1),   # post 3 liked by alice and bob
            (4, 0),           # post 4 liked by alice
            (5, 1), (5, 2),   # post 5 liked by bob and carol
        ]
        for post_index, user_index in likes:
            session.add(PostLike(
                postId=post_ids[post_index],
                userId=user_ids[user_index],
            ))
        await session.commit()
        print(f"  Created {len(likes)} likes")

    await close_engine()
    print("\nSeed complete.")
    print(f"  {len(SAMPLE_USERS)} users")
    print(f"  {len(SAMPLE_POSTS)} posts")
    print(f"  {len(SAMPLE_COMMENTS)} comments")
    print(f"  {len(likes)} likes")


if __name__ == "__main__":
    asyncio.run(seed())

"""One-time Firebase → PostgreSQL migration script.

Prerequisites:
    pip install firebase-admin

Usage:
    1. Download your Firebase service account key from Firebase Console
       (Project Settings → Service Accounts → Generate new private key)
    2. Save it as serviceAccountKey.json in the backend/ directory
    3. Set DATABASE_URL in your .env
    4. Run: python migrations/firebase_to_postgres.py

Notes:
    - User passwords CANNOT be migrated (Firebase does not expose them).
      After migration, users must set a new password via a password reset flow.
    - Firebase document IDs are preserved as post IDs to maintain URL continuity.
"""

import asyncio
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

try:
    import firebase_admin
    from firebase_admin import auth as firebase_auth
    from firebase_admin import credentials, firestore
except ImportError:
    print("ERROR: firebase-admin is not installed.")
    print("Run: pip install firebase-admin")
    sys.exit(1)

from datetime import datetime, timezone

from prisma import Prisma

from app.core.security import hash_password

SERVICE_ACCOUNT_KEY = os.path.join(os.path.dirname(__file__), "..", "serviceAccountKey.json")


def _unusable_password() -> str:
    """Return a hash that can never be reverse-engineered to a plain password."""
    import secrets

    return hash_password(secrets.token_hex(64))


async def migrate() -> None:
    if not os.path.exists(SERVICE_ACCOUNT_KEY):
        print(f"ERROR: serviceAccountKey.json not found at {SERVICE_ACCOUNT_KEY}")
        sys.exit(1)

    cred = credentials.Certificate(SERVICE_ACCOUNT_KEY)
    firebase_admin.initialize_app(cred)
    db_firebase = firestore.client()

    db = Prisma()
    await db.connect()

    print("─── Migrating users ───────────────────────────────────────────────")
    firebase_uid_map: dict[str, str] = {}
    page = firebase_auth.list_users()

    while page:
        for fb_user in page.users:
            if not fb_user.email:
                continue

            existing = await db.user.find_unique(where={"email": fb_user.email})
            if existing:
                firebase_uid_map[fb_user.uid] = existing.id
                print(f"  Skipped (exists): {fb_user.email}")
                continue

            created_at = (
                datetime.fromtimestamp(
                    fb_user.user_metadata.creation_timestamp / 1000, tz=timezone.utc
                )
                if fb_user.user_metadata.creation_timestamp
                else datetime.now(timezone.utc)
            )

            new_user = await db.user.create(
                data={
                    "email": fb_user.email,
                    "displayName": fb_user.display_name or "User",
                    "passwordHash": _unusable_password(),
                    "createdAt": created_at,
                }
            )
            firebase_uid_map[fb_user.uid] = new_user.id
            print(f"  Migrated: {fb_user.email}")

        page = page.get_next_page()

    print(f"\n✓ {len(firebase_uid_map)} users processed")

    print("\n─── Migrating posts ───────────────────────────────────────────────")
    posts_migrated = 0
    posts_skipped = 0

    posts_stream = (
        db_firebase.collection("posts")
        .order_by("createdAt", direction=firestore.Query.DESCENDING)
        .stream()
    )

    for doc in posts_stream:
        data = doc.to_dict()
        firebase_uid = data.get("uid")
        author_id = firebase_uid_map.get(firebase_uid) if firebase_uid else None

        if not author_id:
            print(f"  SKIP post {doc.id}: author UID '{firebase_uid}' not found")
            posts_skipped += 1
            continue

        existing_post = await db.post.find_unique(where={"id": doc.id})
        if existing_post:
            print(f"  Skipped (exists): {doc.id}")
            posts_skipped += 1
            continue

        created_at = (
            data["createdAt"].datetime
            if hasattr(data.get("createdAt"), "datetime")
            else datetime.now(timezone.utc)
        )

        # Preserve Firebase document ID for URL continuity
        post = await db.post.create(
            data={
                "id": doc.id,
                "title": data.get("title", "Untitled"),
                "image": data.get("image", ""),
                "body": data.get("body", ""),
                "authorId": author_id,
                "createdAt": created_at,
            }
        )

        # Migrate tags
        for tag_name in data.get("tags") or []:
            tag_name_clean = tag_name.strip().lower()
            if not tag_name_clean:
                continue
            tag = await db.tag.upsert(
                where={"name": tag_name_clean},
                data={"create": {"name": tag_name_clean}, "update": {}},
            )
            await db.posttag.upsert(
                where={"postId_tagId": {"postId": post.id, "tagId": tag.id}},
                data={
                    "create": {"postId": post.id, "tagId": tag.id},
                    "update": {},
                },
            )

        posts_migrated += 1
        print(f"  Migrated: [{doc.id}] {post.title}")

    await db.disconnect()

    print(f"\n✓ Posts migrated: {posts_migrated}")
    print(f"✓ Posts skipped:  {posts_skipped}")
    print("\nMigration complete!")
    print("\nIMPORTANT: Send password reset emails to all migrated users.")
    print("They cannot log in until they set a new password.")


if __name__ == "__main__":
    asyncio.run(migrate())

from __future__ import annotations

from datetime import datetime
from typing import Optional

from cuid2 import cuid_wrapper
from sqlalchemy import (
    Boolean,
    DateTime,
    ForeignKey,
    Index,
    Integer,
    JSON,
    String,
    Text,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

_cuid_gen = cuid_wrapper()


def new_cuid() -> str:
    return _cuid_gen()


class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=new_cuid)
    email: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    displayName: Mapped[str] = mapped_column("display_name", String, nullable=False)
    passwordHash: Mapped[str] = mapped_column("password_hash", String, nullable=False)
    isActive: Mapped[bool] = mapped_column(
        "is_active", Boolean, nullable=False, default=True
    )
    isAdmin: Mapped[bool] = mapped_column(
        "is_admin", Boolean, nullable=False, default=False
    )
    createdAt: Mapped[datetime] = mapped_column(
        "created_at",
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )
    updatedAt: Mapped[datetime] = mapped_column(
        "updated_at",
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )

    posts: Mapped[list["Post"]] = relationship(
        back_populates="author", cascade="all, delete-orphan"
    )
    refreshTokens: Mapped[list["RefreshToken"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )
    comments: Mapped[list["Comment"]] = relationship(
        back_populates="author", cascade="all, delete-orphan"
    )
    likes: Mapped[list["PostLike"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )

    __table_args__ = (Index("ix_users_email", "email"),)


class Post(Base):
    __tablename__ = "posts"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=new_cuid)
    title: Mapped[str] = mapped_column(String, nullable=False)
    image: Mapped[str] = mapped_column(String, nullable=False)
    body: Mapped[str] = mapped_column(Text, nullable=False)
    createdAt: Mapped[datetime] = mapped_column(
        "created_at",
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )
    updatedAt: Mapped[datetime] = mapped_column(
        "updated_at",
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )
    authorId: Mapped[str] = mapped_column(
        "author_id",
        String,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )

    author: Mapped["User"] = relationship(back_populates="posts")
    tags: Mapped[list["PostTag"]] = relationship(
        back_populates="post",
        cascade="all, delete-orphan",
    )
    comments: Mapped[list["Comment"]] = relationship(
        back_populates="post", cascade="all, delete-orphan"
    )
    likes: Mapped[list["PostLike"]] = relationship(
        back_populates="post", cascade="all, delete-orphan"
    )

    __table_args__ = (
        Index("ix_posts_author_id", "author_id"),
        Index("ix_posts_created_at", "created_at"),
    )


class Tag(Base):
    __tablename__ = "tags"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=new_cuid)
    name: Mapped[str] = mapped_column(String, unique=True, nullable=False)

    posts: Mapped[list["PostTag"]] = relationship(back_populates="tag")

    __table_args__ = (Index("ix_tags_name", "name"),)


class PostTag(Base):
    __tablename__ = "post_tags"

    postId: Mapped[str] = mapped_column(
        "post_id",
        String,
        ForeignKey("posts.id", ondelete="CASCADE"),
        primary_key=True,
    )
    tagId: Mapped[str] = mapped_column(
        "tag_id",
        String,
        ForeignKey("tags.id", ondelete="CASCADE"),
        primary_key=True,
    )

    post: Mapped["Post"] = relationship(back_populates="tags")
    tag: Mapped["Tag"] = relationship(back_populates="posts", lazy="joined")

    __table_args__ = (Index("ix_post_tags_tag_id", "tag_id"),)


class Comment(Base):
    __tablename__ = "comments"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=new_cuid)
    body: Mapped[str] = mapped_column(String, nullable=False)
    createdAt: Mapped[datetime] = mapped_column(
        "created_at",
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )
    updatedAt: Mapped[datetime] = mapped_column(
        "updated_at",
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )
    postId: Mapped[str] = mapped_column(
        "post_id",
        String,
        ForeignKey("posts.id", ondelete="CASCADE"),
        nullable=False,
    )
    authorId: Mapped[str] = mapped_column(
        "author_id",
        String,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )
    parentId: Mapped[Optional[str]] = mapped_column(
        "parent_id",
        String,
        ForeignKey("comments.id", ondelete="SET NULL"),
        nullable=True,
    )

    # Not a DB column — assigned by repository after batch count query
    reply_count: int = 0

    post: Mapped["Post"] = relationship(back_populates="comments")
    author: Mapped["User"] = relationship(back_populates="comments", lazy="joined")
    parent: Mapped[Optional["Comment"]] = relationship(
        back_populates="replies",
        remote_side="Comment.id",
        foreign_keys="[Comment.parentId]",
    )
    replies: Mapped[list["Comment"]] = relationship(
        back_populates="parent",
        foreign_keys="[Comment.parentId]",
    )

    __table_args__ = (
        Index("ix_comments_post_id", "post_id"),
        Index("ix_comments_author_id", "author_id"),
        Index("ix_comments_parent_id", "parent_id"),
    )


class PostLike(Base):
    __tablename__ = "post_likes"

    postId: Mapped[str] = mapped_column(
        "post_id",
        String,
        ForeignKey("posts.id", ondelete="CASCADE"),
        primary_key=True,
    )
    userId: Mapped[str] = mapped_column(
        "user_id",
        String,
        ForeignKey("users.id", ondelete="CASCADE"),
        primary_key=True,
    )
    createdAt: Mapped[datetime] = mapped_column(
        "created_at",
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )

    post: Mapped["Post"] = relationship(back_populates="likes")
    user: Mapped["User"] = relationship(back_populates="likes")

    __table_args__ = (Index("ix_post_likes_post_id", "post_id"),)


class RefreshToken(Base):
    __tablename__ = "refresh_tokens"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=new_cuid)
    tokenHash: Mapped[str] = mapped_column(
        "token_hash", String, unique=True, nullable=False
    )
    userId: Mapped[str] = mapped_column(
        "user_id",
        String,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )
    expiresAt: Mapped[datetime] = mapped_column(
        "expires_at", DateTime(timezone=True), nullable=False
    )
    createdAt: Mapped[datetime] = mapped_column(
        "created_at",
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )
    revokedAt: Mapped[Optional[datetime]] = mapped_column(
        "revoked_at", DateTime(timezone=True), nullable=True
    )
    userAgent: Mapped[Optional[str]] = mapped_column(
        "user_agent", String, nullable=True
    )
    ipAddress: Mapped[Optional[str]] = mapped_column(
        "ip_address", String, nullable=True
    )

    user: Mapped["User"] = relationship(back_populates="refreshTokens")

    __table_args__ = (
        Index("ix_refresh_tokens_token_hash", "token_hash"),
        Index("ix_refresh_tokens_user_id", "user_id"),
        Index("ix_refresh_tokens_expires_at", "expires_at"),
    )


class Project(Base):
    __tablename__ = "projects"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=new_cuid)
    slug: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    title: Mapped[str] = mapped_column(String, nullable=False)
    tagline: Mapped[str] = mapped_column(String, nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    category: Mapped[str] = mapped_column(String, nullable=False)
    url: Mapped[str] = mapped_column(String, nullable=False)
    githubUrl: Mapped[Optional[str]] = mapped_column("github_url", String, nullable=True)
    image: Mapped[str] = mapped_column(String, nullable=False)
    tags: Mapped[list] = mapped_column(JSON, nullable=False, default=list)
    techStack: Mapped[list] = mapped_column("tech_stack", JSON, nullable=False, default=list)
    stats: Mapped[list] = mapped_column(JSON, nullable=False, default=list)
    features: Mapped[list] = mapped_column(JSON, nullable=False, default=list)
    year: Mapped[int] = mapped_column(Integer, nullable=False)
    featured: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    createdAt: Mapped[datetime] = mapped_column(
        "created_at",
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )
    updatedAt: Mapped[datetime] = mapped_column(
        "updated_at",
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )

    __table_args__ = (
        Index("ix_projects_slug", "slug"),
        Index("ix_projects_featured", "featured"),
        Index("ix_projects_year", "year"),
    )

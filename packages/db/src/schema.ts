import { relations, sql } from "drizzle-orm";
import { pgTable, primaryKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

/**
 * Post table and relations
 */
export const Post = pgTable("post", (t) => ({
  id: t.text().primaryKey(), // Bluesky post ID
  uri: t.text().unique(), // Bluesky post URI

  content: t.text().notNull(),

  likesCount: t.integer().default(0),
  replyCount: t.integer().default(0),
  repostCount: t.integer().default(0),
  quoteCount: t.integer().default(0),

  websiteUrl: t.text("website_url"),

  authorDid: t
    .text("author_did")
    .notNull()
    .references(() => User.did, { onDelete: "cascade" }),

  createdAt: t.timestamp().defaultNow().notNull(),
  indexedAt: t.timestamp({ mode: "date", withTimezone: true }).defaultNow(),

  updatedAt: t
    .timestamp({ mode: "date", withTimezone: true })
    .$onUpdateFn(() => sql`now()`),
}));

export const PostRelations = relations(Post, ({ one, many }) => ({
  author: one(User, { fields: [Post.authorDid], references: [User.did] }),
  media: many(PostMedia),
  links: many(Link),
}));

/**
 * Post Interactions
 */
export const PostLike = pgTable(
  "post_like",
  (t) => ({
    postId: t
      .text("post_id")
      .notNull()
      .references(() => Post.id, { onDelete: "cascade" }),
    userDid: t
      .text("user_did")
      .notNull()
      .references(() => User.did, { onDelete: "cascade" }),

    createdAt: t.timestamp({ mode: "date", withTimezone: true }).defaultNow(),
    indexedAt: t.timestamp({ mode: "date", withTimezone: true }).defaultNow(),
  }),
  (t) => ({
    pk: primaryKey({ columns: [t.postId, t.userDid] }),
  }),
);

export const PostMedia = pgTable("post_media", (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),

  postId: t
    .text("post_id")
    .notNull()
    .references(() => Post.id, { onDelete: "cascade" }), // Links to Post

  url: t.text("url").notNull(),
  mimeType: t.text("mime_type").notNull(),
  size: t.integer("size").notNull(),
  width: t.integer("width").notNull().default(0),
  height: t.integer("height").notNull().default(0),

  createdAt: t
    .timestamp("created_at", {
      mode: "date",
      withTimezone: true,
    })
    .defaultNow(),
}));

export const PostMediaRelations = relations(PostMedia, ({ one }) => ({
  post: one(Post, { fields: [PostMedia.postId], references: [Post.id] }),
}));

/**
 * Link tables and relations
 */
export const Link = pgTable("link", (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),

  postId: t
    .text("post_id")
    .notNull()
    .references(() => Post.id, { onDelete: "cascade" }),

  uri: t.text().notNull().unique(),
  domainUrl: t
    .text()
    .notNull()
    .references(() => Domain.url, {
      onDelete: "set null",
    }),
  trustScore: t.integer().notNull().default(0),

  $type: t.text(),

  lastCheckedAt: t.timestamp({ mode: "date", withTimezone: true }),
  parsedAt: t.timestamp({ mode: "date", withTimezone: true }).defaultNow(),
}));

export const LinkRelations = relations(Link, ({ one }) => ({
  post: one(Post, { fields: [Link.postId], references: [Post.id] }),
  domain: one(Domain, { fields: [Link.domainUrl], references: [Domain.url] }),
}));

export const Domain = pgTable("domain", (t) => ({
  url: t.text().notNull().unique(),

  isSslValid: t.boolean().notNull().default(false),
  trustScore: t.integer().notNull().default(0),

  lastCheckedAt: t.timestamp({ mode: "date", withTimezone: true }),
}));

export const DomainRelations = relations(Domain, ({ many }) => ({
  links: many(Link),
}));

/**
 * User tables and relations
 */
export const User = pgTable("user", (t) => ({
  did: t.varchar({ length: 255 }).notNull().primaryKey(),

  handle: t.varchar({ length: 255 }).unique().notNull(),
  displayName: t.varchar({ length: 255 }),
  avatar: t.varchar({ length: 255 }),

  followersCount: t.integer().default(0),
  followsCount: t.integer().default(0),

  parsedAt: t.timestamp({ mode: "date", withTimezone: true }),

  createdAt: t.timestamp().defaultNow().notNull(),
}));

export const UserFollower = pgTable(
  "user_follower",
  (t) => ({
    userDid: t
      .varchar({ length: 255 })
      .notNull()
      .references(() => User.did, { onDelete: "cascade" }), // The user being followed

    followerDid: t
      .varchar({ length: 255 })
      .notNull()
      .references(() => User.did, { onDelete: "cascade" }), // The user who is following

    followedAt: t.timestamp({ mode: "date", withTimezone: true }).defaultNow(),
  }),
  (t) => ({
    pk: primaryKey({ columns: [t.userDid, t.followerDid] }), // Prevent duplicate follows
  }),
);

export const UserRelations = relations(User, ({ many }) => ({
  accounts: many(Account),

  posts: many(Post),
  followers: many(UserFollower, { relationName: "user_followers" }), // Followers of this user
  following: many(UserFollower, { relationName: "user_following" }), // Users this user is following
}));

export const UserFollowerRelations = relations(UserFollower, ({ one }) => ({
  user: one(User, {
    fields: [UserFollower.userDid],
    references: [User.did],
    relationName: "user_followers",
  }),

  follower: one(User, {
    fields: [UserFollower.followerDid],
    references: [User.did],
    relationName: "user_following",
  }),
}));

export const Account = pgTable(
  "account",
  (t) => ({
    userId: t
      .varchar({ length: 255 })
      .notNull()
      .references(() => User.did, { onDelete: "cascade" }),
    type: t
      .varchar({ length: 255 })
      .$type<"email" | "oauth" | "oidc" | "webauthn">()
      .notNull(),
    provider: t.varchar({ length: 255 }).notNull(),
    providerAccountId: t.varchar({ length: 255 }).notNull(),
    refresh_token: t.varchar({ length: 255 }),
    access_token: t.text(),
    expires_at: t.integer(),
    token_type: t.varchar({ length: 255 }),
    scope: t.varchar({ length: 255 }),
    id_token: t.text(),
    session_state: t.varchar({ length: 255 }),
  }),
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  }),
);

export const AccountRelations = relations(Account, ({ one }) => ({
  user: one(User, { fields: [Account.userId], references: [User.did] }),
}));

export const Session = pgTable("session", (t) => ({
  sessionToken: t.varchar({ length: 255 }).notNull().primaryKey(),
  userId: t
    .varchar({ length: 255 })
    .notNull()
    .references(() => User.did, { onDelete: "cascade" }),
  expires: t.timestamp({ mode: "date", withTimezone: true }).notNull(),
}));

export const SessionRelations = relations(Session, ({ one }) => ({
  user: one(User, { fields: [Session.userId], references: [User.did] }),
}));

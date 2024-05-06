import { relations } from "drizzle-orm";
import {
    pgTableCreator,
    serial,
    boolean,
    index,
    text,
    timestamp,
    varchar,
    uuid,
    numeric,
} from "drizzle-orm/pg-core";

export const pgTable = pgTableCreator((name) => `${"digital"}_${name}`);


export const users = pgTable(
    "users",
    {
        id: varchar("id", { length: 21 }).primaryKey(),
        discordId: varchar("discord_id", { length: 255 }).unique(),
        email: varchar("email", { length: 255 }).unique().notNull(),
        emailVerified: boolean("email_verified").default(false).notNull(),
        hashedPassword: varchar("hashed_password", { length: 255 }),
        avatar: varchar("avatar", { length: 255 }),
        stripeSubscriptionId: varchar("stripe_subscription_id", { length: 191 }),
        stripePriceId: varchar("stripe_price_id", { length: 191 }),
        stripeCustomerId: varchar("stripe_customer_id", { length: 191 }),
        stripeCurrentPeriodEnd: timestamp("stripe_current_period_end"),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at", { mode: "date" }).$onUpdate(() => new Date()),
    },
    (t) => ({
        emailIdx: index("user_email_idx").on(t.email),
        discordIdx: index("user_discord_idx").on(t.discordId),
    }),
);
export const sessions = pgTable(
    "sessions",
    {
        id: varchar("id", { length: 255 }).primaryKey(),
        userId: varchar("user_id", { length: 21 }).notNull(),
        expiresAt: timestamp("expires_at", { withTimezone: true, mode: "date" }).notNull(),
    },
    (t) => ({
        userIdx: index("session_user_idx").on(t.userId),
    }),
);

export const emailVerificationCodes = pgTable(
    "email_verification_codes",
    {
        id: serial("id").primaryKey(),
        userId: varchar("user_id", { length: 21 }).unique().notNull(),
        email: varchar("email", { length: 255 }).notNull(),
        code: varchar("code", { length: 8 }).notNull(),
        expiresAt: timestamp("expires_at", { withTimezone: true, mode: "date" }).notNull(),
    },
    (t) => ({
        userIdx: index("verification_code_user_idx").on(t.userId),
        emailIdx: index("verification_code_email_idx").on(t.email),
    }),
);

export const passwordResetTokens = pgTable(
    "password_reset_tokens",
    {
        id: varchar("id", { length: 40 }).primaryKey(),
        userId: varchar("user_id", { length: 21 }).notNull(),
        expiresAt: timestamp("expires_at", { withTimezone: true, mode: "date" }).notNull(),
    },
    (t) => ({
        userIdx: index("password_token_user_idx").on(t.userId),
    }),
);

export const stores = pgTable("stores", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }),
    userId: varchar("user_id", { length: 255 }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

export const storeRelation = relations(stores, ({ many }) => ({
    billboards: many(billboards),
    categories: many(categories),
    products: many(products),
    sizes: many(sizes),
    colors: many(colors),
    orders: many(orders)
}))

export const billboards = pgTable("billboards", {
    id: uuid("id").defaultRandom().primaryKey(),
    storeId: varchar("store_id", { length: 255 }),
    label: varchar("label", { length: 255 }),
    imageUrl: varchar("image_url", { length: 255 }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

export const categories = pgTable("categories", {
    id: uuid("id").defaultRandom().primaryKey(),
    storeId: varchar("store_id", { length: 255 }),
    billboardId: varchar("billboard_id", { length: 255 }),
    name: varchar("name", { length: 255 }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

export const products = pgTable("products", {
    id: uuid("id").defaultRandom().primaryKey(),
    storeId: varchar("store_id", { length: 255 }),
    categoryId: varchar("category_id", { length: 255 }),
    name: varchar("name", { length: 255 }),
    price: numeric("price", { precision: 10, scale: 2 }),
    isFeatured: boolean("is_featured").default(false),
    isArchived: boolean("is_archived").default(false),
    sizeId: varchar("size_id", { length: 255 }),
    colorId: varchar("color_id", { length: 255 }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

export const orders = pgTable("orders", {
    id: uuid("id").defaultRandom().primaryKey(),
    storeId: varchar("store_id", { length: 255 }),
    isPaid: boolean("is_paid").default(false),
    phone: varchar("phone", { length: 255 }).default(""),
    address: varchar("address", { length: 255 }).default(""),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

export const orderItems = pgTable("order_items", {
    id: uuid("id").defaultRandom().primaryKey(),
    orderId: varchar("order_id", { length: 255 }),
    productId: varchar("product_id", { length: 255 }),
});

export const orderRelation = relations(orders, ({ many }) => ({
    orderItems: many(orderItems)
}));

export const sizes = pgTable("sizes", {
    id: uuid("id").defaultRandom().primaryKey(),
    storeId: varchar("store_id", { length: 255 }),
    name: varchar("name", { length: 255 }),
    value: varchar("value", { length: 255 }),
});

export const sizesRelations = relations(sizes, ({ many }) => ({
    products: many(products)
}))

export const colors = pgTable("colors", {
    id: uuid("id").defaultRandom().primaryKey(),
    storeId: varchar("store_id", { length: 255 }),
    name: varchar("name", { length: 255 }),
    value: varchar("value", { length: 255 }),
});

export const images = pgTable("images", {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: varchar("product_id", { length: 255 }),
    url: varchar("url", { length: 255 }),
});

export const productRelations = relations(products, ({ many }) => ({
    images: many(images),
    orderItems: many(orderItems)
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
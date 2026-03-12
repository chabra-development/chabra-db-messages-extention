-- CreateEnum
CREATE TYPE "roles" AS ENUM ('USER', 'SUPERVISOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "message_directions" AS ENUM ('sent', 'received');

-- CreateEnum
CREATE TYPE "message_status" AS ENUM ('consumed', 'dispatched');

-- CreateEnum
CREATE TYPE "ticket_status" AS ENUM ('waiting', 'in_attendance', 'closed_attendant', 'closed_client', 'closed_system', 'transferred');

-- CreateEnum
CREATE TYPE "import_job_status" AS ENUM ('pending', 'running', 'completed', 'failed', 'cancelled');

-- CreateEnum
CREATE TYPE "ImportLogType" AS ENUM ('CONTACTS', 'ATTENDANTS', 'MESSAGES');

-- CreateTable
CREATE TABLE "contacts" (
    "id" TEXT NOT NULL,
    "identity" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "phone_number" TEXT,
    "email" TEXT,
    "tax_document" TEXT,
    "group" TEXT,
    "extras" JSONB,
    "message_count" INTEGER NOT NULL DEFAULT 0,
    "last_message_date" TIMESTAMP(3),
    "last_update_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" TEXT NOT NULL,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_tags" (
    "contact_id" TEXT NOT NULL,
    "tag_id" TEXT NOT NULL,

    CONSTRAINT "contact_tags_pkey" PRIMARY KEY ("contact_id","tag_id")
);

-- CreateTable
CREATE TABLE "contact_user_preferences" (
    "id" TEXT NOT NULL,
    "pinned" BOOLEAN NOT NULL DEFAULT false,
    "favorite" BOOLEAN NOT NULL DEFAULT false,
    "pinned_at" TIMESTAMP(3),
    "favorited_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "contact_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "contact_user_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "import_jobs" (
    "id" TEXT NOT NULL,
    "total" INTEGER NOT NULL,
    "processed" INTEGER NOT NULL DEFAULT 0,
    "succeeded" INTEGER NOT NULL DEFAULT 0,
    "failed_count" INTEGER NOT NULL DEFAULT 0,
    "failed" JSONB[] DEFAULT ARRAY[]::JSONB[],
    "metadata" JSONB,
    "status" "import_job_status" NOT NULL DEFAULT 'pending',
    "started_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "import_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "import_logs" (
    "id" TEXT NOT NULL,
    "type" "ImportLogType" NOT NULL,
    "total" INTEGER NOT NULL,
    "succeeded" INTEGER NOT NULL,
    "failed" INTEGER NOT NULL,
    "duration" INTEGER NOT NULL,
    "pay_load_size" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "import_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" TEXT NOT NULL,
    "blip_id" TEXT NOT NULL,
    "direction" "message_directions" NOT NULL,
    "type" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "status" "message_status" NOT NULL,
    "metadata" JSONB,
    "sent_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "contact_id" TEXT NOT NULL,
    "ticket_id" TEXT,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tickets" (
    "id" TEXT NOT NULL,
    "blip_id" TEXT NOT NULL,
    "sequential_id" INTEGER NOT NULL,
    "parent_sequential_id" INTEGER,
    "external_id" TEXT,
    "owner_identity" TEXT NOT NULL,
    "customer_identity" TEXT NOT NULL,
    "customer_domain" TEXT NOT NULL,
    "agent_identity" TEXT,
    "provider" TEXT NOT NULL,
    "status" "ticket_status" NOT NULL,
    "closed" BOOLEAN NOT NULL DEFAULT false,
    "closed_by" TEXT,
    "team" TEXT NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 0,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "is_automatic_distribution" BOOLEAN,
    "distribution_type" TEXT,
    "storage_date" TIMESTAMP(3) NOT NULL,
    "status_date" TIMESTAMP(3) NOT NULL,
    "open_date" TIMESTAMP(3),
    "close_date" TIMESTAMP(3),
    "first_response_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "message_count" INTEGER NOT NULL DEFAULT 0,
    "last_message_date" TIMESTAMP(3),
    "contact_id" TEXT NOT NULL,

    CONSTRAINT "tickets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "identity" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "teams" TEXT[],
    "image" TEXT,
    "banner" TEXT,
    "role" "roles" NOT NULL DEFAULT 'USER',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "contacts_identity_key" ON "contacts"("identity");

-- CreateIndex
CREATE INDEX "contacts_phone_number_idx" ON "contacts"("phone_number");

-- CreateIndex
CREATE INDEX "contacts_email_idx" ON "contacts"("email");

-- CreateIndex
CREATE INDEX "contacts_source_idx" ON "contacts"("source");

-- CreateIndex
CREATE INDEX "contacts_name_idx" ON "contacts"("name");

-- CreateIndex
CREATE INDEX "contacts_name_source_idx" ON "contacts"("name", "source");

-- CreateIndex
CREATE INDEX "contacts_last_message_date_idx" ON "contacts"("last_message_date");

-- CreateIndex
CREATE INDEX "contacts_message_count_idx" ON "contacts"("message_count");

-- CreateIndex
CREATE INDEX "contacts_created_at_idx" ON "contacts"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "tags_name_key" ON "tags"("name");

-- CreateIndex
CREATE INDEX "tags_name_idx" ON "tags"("name");

-- CreateIndex
CREATE INDEX "contact_user_preferences_user_id_idx" ON "contact_user_preferences"("user_id");

-- CreateIndex
CREATE INDEX "contact_user_preferences_contact_id_idx" ON "contact_user_preferences"("contact_id");

-- CreateIndex
CREATE INDEX "contact_user_preferences_pinned_idx" ON "contact_user_preferences"("pinned");

-- CreateIndex
CREATE INDEX "contact_user_preferences_favorite_idx" ON "contact_user_preferences"("favorite");

-- CreateIndex
CREATE INDEX "contact_user_preferences_user_id_pinned_idx" ON "contact_user_preferences"("user_id", "pinned");

-- CreateIndex
CREATE INDEX "contact_user_preferences_user_id_favorite_idx" ON "contact_user_preferences"("user_id", "favorite");

-- CreateIndex
CREATE UNIQUE INDEX "contact_user_preferences_contact_id_user_id_key" ON "contact_user_preferences"("contact_id", "user_id");

-- CreateIndex
CREATE INDEX "import_jobs_status_idx" ON "import_jobs"("status");

-- CreateIndex
CREATE INDEX "import_jobs_created_at_idx" ON "import_jobs"("created_at");

-- CreateIndex
CREATE INDEX "import_logs_type_idx" ON "import_logs"("type");

-- CreateIndex
CREATE INDEX "import_logs_created_at_idx" ON "import_logs"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "messages_blip_id_key" ON "messages"("blip_id");

-- CreateIndex
CREATE INDEX "messages_blip_id_idx" ON "messages"("blip_id");

-- CreateIndex
CREATE INDEX "messages_contact_id_idx" ON "messages"("contact_id");

-- CreateIndex
CREATE INDEX "messages_ticket_id_idx" ON "messages"("ticket_id");

-- CreateIndex
CREATE INDEX "messages_direction_idx" ON "messages"("direction");

-- CreateIndex
CREATE INDEX "messages_type_idx" ON "messages"("type");

-- CreateIndex
CREATE INDEX "messages_sent_at_idx" ON "messages"("sent_at");

-- CreateIndex
CREATE INDEX "messages_contact_id_sent_at_idx" ON "messages"("contact_id", "sent_at");

-- CreateIndex
CREATE INDEX "messages_ticket_id_sent_at_idx" ON "messages"("ticket_id", "sent_at");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");

-- CreateIndex
CREATE INDEX "session_userId_idx" ON "session"("userId");

-- CreateIndex
CREATE INDEX "account_userId_idx" ON "account"("userId");

-- CreateIndex
CREATE INDEX "verification_identifier_idx" ON "verification"("identifier");

-- CreateIndex
CREATE UNIQUE INDEX "tickets_blip_id_key" ON "tickets"("blip_id");

-- CreateIndex
CREATE INDEX "tickets_blip_id_idx" ON "tickets"("blip_id");

-- CreateIndex
CREATE INDEX "tickets_sequential_id_idx" ON "tickets"("sequential_id");

-- CreateIndex
CREATE INDEX "tickets_contact_id_idx" ON "tickets"("contact_id");

-- CreateIndex
CREATE INDEX "tickets_owner_identity_idx" ON "tickets"("owner_identity");

-- CreateIndex
CREATE INDEX "tickets_customer_identity_idx" ON "tickets"("customer_identity");

-- CreateIndex
CREATE INDEX "tickets_agent_identity_idx" ON "tickets"("agent_identity");

-- CreateIndex
CREATE INDEX "tickets_status_idx" ON "tickets"("status");

-- CreateIndex
CREATE INDEX "tickets_closed_idx" ON "tickets"("closed");

-- CreateIndex
CREATE INDEX "tickets_team_idx" ON "tickets"("team");

-- CreateIndex
CREATE INDEX "tickets_priority_idx" ON "tickets"("priority");

-- CreateIndex
CREATE INDEX "tickets_storage_date_idx" ON "tickets"("storage_date");

-- CreateIndex
CREATE INDEX "tickets_open_date_idx" ON "tickets"("open_date");

-- CreateIndex
CREATE INDEX "tickets_close_date_idx" ON "tickets"("close_date");

-- CreateIndex
CREATE INDEX "tickets_last_message_date_idx" ON "tickets"("last_message_date");

-- CreateIndex
CREATE INDEX "tickets_message_count_idx" ON "tickets"("message_count");

-- CreateIndex
CREATE UNIQUE INDEX "users_identity_key" ON "users"("identity");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_identity_idx" ON "users"("identity");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE INDEX "users_is_active_idx" ON "users"("is_active");

-- AddForeignKey
ALTER TABLE "contact_tags" ADD CONSTRAINT "contact_tags_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contact_tags" ADD CONSTRAINT "contact_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contact_user_preferences" ADD CONSTRAINT "contact_user_preferences_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contact_user_preferences" ADD CONSTRAINT "contact_user_preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_ticket_id_fkey" FOREIGN KEY ("ticket_id") REFERENCES "tickets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Prevent re-registration abuse for free signup credits
-- Run this against your Neon database before deploying

-- 1. Change default credits from 2 to 0 (new users get 0 by default)
ALTER TABLE "User" ALTER COLUMN "credits" SET DEFAULT 0;

-- 2. Create table to track emails that already received signup bonus
CREATE TABLE "UsedSignupEmail" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "grantedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "UsedSignupEmail_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "UsedSignupEmail_email_key" ON "UsedSignupEmail"("email");

-- 3. Backfill: mark all existing users' emails as already used
INSERT INTO "UsedSignupEmail" ("id", "email", "grantedAt")
SELECT gen_random_uuid()::text, lower("email"), "createdAt"
FROM "User"
WHERE "email" IS NOT NULL
ON CONFLICT ("email") DO NOTHING;

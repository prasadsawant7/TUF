-- CreateTable
CREATE TABLE "submission" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "language_id" INTEGER NOT NULL,
    "source_code" TEXT NOT NULL,
    "stdin" TEXT NOT NULL,
    "stdout" TEXT,
    "time" TEXT,
    "memory" INTEGER,
    "status" TEXT NOT NULL,
    "token" UUID NOT NULL,
    "submitted_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "submission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "submission_token_key" ON "submission"("token");

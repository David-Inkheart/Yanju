/*
  Warnings:

  - You are about to drop the `BankDetails` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "BankDetails";

-- CreateTable
CREATE TABLE "TransferAttempt" (
    "id" SERIAL NOT NULL,
    "sender_acc_id" INTEGER NOT NULL,
    "account_name" TEXT NOT NULL,
    "account_number" TEXT NOT NULL,
    "bank_code" TEXT NOT NULL,
    "recipient_code" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "TransferAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TransferAttempt_sender_acc_id_key" ON "TransferAttempt"("sender_acc_id");

-- CreateIndex
CREATE UNIQUE INDEX "TransferAttempt_account_number_key" ON "TransferAttempt"("account_number");

-- CreateIndex
CREATE UNIQUE INDEX "TransferAttempt_recipient_code_key" ON "TransferAttempt"("recipient_code");

-- CreateIndex
CREATE UNIQUE INDEX "TransferAttempt_reference_key" ON "TransferAttempt"("reference");

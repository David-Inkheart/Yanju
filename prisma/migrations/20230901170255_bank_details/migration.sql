-- CreateTable
CREATE TABLE "BankDetails" (
    "id" SERIAL NOT NULL,
    "account_number" INTEGER NOT NULL,
    "bank_code" INTEGER NOT NULL,
    "recipient_code" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "BankDetails_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BankDetails_account_number_key" ON "BankDetails"("account_number");

-- CreateIndex
CREATE UNIQUE INDEX "BankDetails_recipient_code_key" ON "BankDetails"("recipient_code");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");
CREATE INDEX "Session_expiresAt_idx" ON "Session"("expiresAt");
CREATE INDEX "CartItem_userId_idx" ON "CartItem"("userId");
CREATE INDEX "Order_userId_idx" ON "Order"("userId");
CREATE INDEX "Order_externalOrderId_idx" ON "Order"("externalOrderId");
CREATE INDEX "Order_uplefOrderId_idx" ON "Order"("uplefOrderId");
CREATE INDEX "Order_status_idx" ON "Order"("status");
CREATE INDEX "PaymentLink_merchantId_idx" ON "PaymentLink"("merchantId");
CREATE INDEX "LinkTransaction_paymentLinkId_idx" ON "LinkTransaction"("paymentLinkId");
CREATE INDEX "Ticket_status_idx" ON "Ticket"("status");
CREATE INDEX "Ticket_userId_idx" ON "Ticket"("userId");
CREATE INDEX "Review_page_approved_idx" ON "Review"("page", "approved");

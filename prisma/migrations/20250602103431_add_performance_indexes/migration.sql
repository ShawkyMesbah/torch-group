-- CreateIndex
CREATE INDEX "AnalyticsEvent_createdAt_idx" ON "AnalyticsEvent"("createdAt");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_type_idx" ON "AnalyticsEvent"("type");

-- CreateIndex
CREATE INDEX "BlogPost_createdAt_idx" ON "BlogPost"("createdAt");

-- CreateIndex
CREATE INDEX "BlogPost_isPublished_idx" ON "BlogPost"("isPublished");

-- CreateIndex
CREATE INDEX "BlogPost_authorId_idx" ON "BlogPost"("authorId");

-- CreateIndex
CREATE INDEX "ContactMessage_createdAt_idx" ON "ContactMessage"("createdAt");

-- CreateIndex
CREATE INDEX "ContactMessage_isRead_idx" ON "ContactMessage"("isRead");

-- CreateIndex
CREATE INDEX "Talent_createdAt_idx" ON "Talent"("createdAt");

-- CreateIndex
CREATE INDEX "Talent_status_idx" ON "Talent"("status");

-- CreateIndex
CREATE INDEX "Talent_category_idx" ON "Talent"("category");

-- CreateIndex
CREATE INDEX "analytics_timestamp_idx" ON "analytics"("timestamp");

-- CreateIndex
CREATE INDEX "analytics_userId_idx" ON "analytics"("userId");

-- CreateIndex
CREATE INDEX "analytics_path_idx" ON "analytics"("path");

-- CreateIndex
CREATE INDEX "analytics_event_idx" ON "analytics"("event");

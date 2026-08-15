# Danh sách entity dữ liệu

Ba mươi tư entity của hệ thống kèm field chính và quan hệ. Type thực tế dùng trong code
được sinh từ `openapi.json` sang `packages/types` — tài liệu này để hiểu ngữ nghĩa và quan
hệ, không phải để chép tay type.

---

> Mọi entity có `id` (uuid, PK), `createdAt`, `updatedAt`; entity nghiệp vụ có `deletedAt` (soft delete). Enum khớp đúng BR.

| Entity | Mô tả | Field chính | Quan hệ |
|---|---|---|---|
| **User** | Tài khoản | `phoneNumber` (unique), `email` (unique, null), `passwordHash`, `status` (Active/Locked) | n-n Role; 1-1 Profile |
| **Role** | Vai trò | `name` (Renter/Seller/Admin/Moderator) | n-n User |
| **Profile** | Hồ sơ | `userId`, `fullName`, `avatarUrl`, `contactPhone`, `displaySettings` (jsonb) | 1-1 User |
| **RefreshToken** | Phiên đăng nhập | `userId`, `tokenHash`, `expiresAt`, `revokedAt` (null) | n-1 User |
| **RentalListing** | Tin cho thuê | `sellerId`, `roomId` (null), `propertyId` (null — gắn qua form chọn khu hoặc tạo từ phòng; validate thuộc cùng seller), `title`, `propertyType` (enum: BoardingRoom/ServicedApartment/Apartment), `address`, `district`, `area`, `price`, `description`, `electricityPrice/waterPrice/servicePrice/deposit`, `accessPolicy` (Free/Restricted), `accessOpenTime`/`accessCloseTime` (null), `contactPhone`, `status`, `rejectReason`, `approvedAt`, `expireAt` (= approvedAt + 60d), `boostExpireAt` | n-1 User/Room(null)/Property(null); n-n Amenity; 1-n Media/Favorite/Report/Conversation/ContactEvent |
| **RoomWantedPost** | Tin tìm phòng | `renterId`, `desiredDistricts` (jsonb), `priceMin/priceMax`, `propertyType`, `minArea`, `desiredAmenities` (jsonb), `moveInDate`, `description`, `status`, `expireAt` | n-1 User; 1-n Conversation/Report |
| **RoommateWantedPost** | Tin ở ghép | `renterId`, `currentAddress`, `district`, `sharePrice`, `neededCount`, `genderRequirement`, `requirements`, `status`, `expireAt` | n-1 User; 1-n Media/Conversation/Report |
| **Property** | Khu trọ + nhận tiền + hồ sơ public | `sellerId`, `name`, `address`, `district`, `floorCount`, `note`, `bankName/bankAccountNumber/bankAccountName` (null), `isPublicProfileEnabled` (default false), `publicSlug` (unique, null), `avgRating` (null), `reviewCount` (default 0), **`allowOccupantMeterSubmission` (default false)** | n-1 User; 1-n Room/Review |
| **Room** | Phòng | `propertyId`, `roomCode` (unique trong property), `floor`, `area`, `price`, `status`, `accessPolicy`, `accessOpenTime/CloseTime`, `note` | n-1 Property; n-n Amenity; 1-n Occupancy/Contract/Invoice/UtilityReading; 0-n RentalListing |
| **Occupancy** | Người ở thực tế | `roomId`, `userId` (null), **`linkStatus` (Pending/Confirmed/Rejected, null khi userId null)**, `fullName`, `phoneNumber`, `startDate`, **`endDate` (null)**, `occupantCount`, `note`, `isActive` | n-1 Room; n-1 User (null) |
| **Contract** | Hợp đồng | `roomId`, `occupancyId` (đại diện), `startDate`, `endDate`, `rentPrice`, `deposit`, `status`, `terminateReason` | n-1 Room/Occupancy; 1-n Media (scan); tối đa 1 Review |
| **Invoice** | Hóa đơn kỳ | `roomId`, `contractId`, `period` (YYYY-MM), `dueDate`, `totalAmount`, `status`; **unique (contractId, period)** | n-1 Room/Contract; 1-n InvoiceItem/Payment/Media |
| **InvoiceItem** | Dòng hóa đơn | `invoiceId`, `type` (Rent/Electricity/Water/Service/Deposit/Other), `description`, `quantity`, `unitPrice`, `amount` | n-1 Invoice |
| **UtilityReading** | Chỉ số điện nước | `roomId`, `type` (Electricity/Water), `period`, `previousReading`, `currentReading`, `unitPrice`, **`invoiceId` (null — đánh dấu đã lên hóa đơn)**; **unique (roomId, type, period)** | n-1 Room; n-1 Invoice (null) |
| **Payment** | Ghi nhận thu **tiền thuê** (tay) | `invoiceId` (bắt buộc), `amount`, `method` (Cash/BankTransfer), `paidAt`, `note` | n-1 Invoice |
| **PlatformTransaction** | Giao dịch **phí nền tảng** qua gateway | `sellerId`, `type` (Boost/Subscription), `listingId` (null), `userSubscriptionId` (null), `amount`, `status` (Pending/Success/Failed), `gatewayTxnId` (null), `idempotencyKey` (unique), `paidAt` (null) | n-1 User; n-1 RentalListing/UserSubscription (null) |
| **Notification** | Thông báo | `userId`, `type` (ListingApproved/Rejected/NewMessage/ContractExpiring/InvoiceDue/InvoiceOverdue/**InvoiceReceived**/SubscriptionRenewal/TrialEnding/ReviewModerated/**OccupancyLinked**/**ListingAutoRented**/FavoriteChanged/System), `title`, `content`, `isRead`, `refType/refId` | n-1 User |
| **Favorite** | Tin đã lưu | `renterId`, `listingId`; unique (renterId, listingId) | n-1 User/RentalListing |
| **Report** | Báo cáo vi phạm | `reporterId`, `targetType` (RentalListing/RoomWantedPost/RoommateWantedPost/Conversation/Message/Review), `targetId`, `reason`, `description`, `status`, `resolution`, `handledBy` | n-1 User |
| **Conversation** | Hội thoại | `refType`, `refId`, **`initiatorId`** (người bắt chuyện), **`posterId`** (người đăng tin), `status` (Active/Archived/Blocked), `lastMessageAt`; **unique (initiatorId, refType, refId)** | n-1 User (x2); 1-n Message |
| **Message** | Tin nhắn | `conversationId`, `senderId`, `content`, `isRead`, `readAt` (null) | n-1 Conversation/User |
| **ContactEvent** | Tương tác liên hệ | `listingId`, `userId` (null), `type` (Call/Message) | n-1 RentalListing; n-1 User (null) |
| **SubscriptionPlan** | Gói SaaS | `name`, `durationMonths`, `price`, `renewalPrice`, `trialDays` (default 30), `maxProperties`, `maxRooms`, **`isTrialPlan` (boolean — plan Trial định nghĩa hạn mức dùng thử)**, `isActive` | 1-n UserSubscription |
| **UserSubscription** | Gói của Seller | `sellerId`, `planId`, `startDate`, `expireDate`, `status` (Trial/Active/Expired/Cancelled) | n-1 User/SubscriptionPlan; 1-n PlatformTransaction |
| **TaxSetting** | Cấu hình thuế | `year`, `thresholdRevenue`, `vatRate`, `pitRate`, `isActive` | (danh mục Admin) |
| **TaxDeclaration** | Bản tính thuế | `sellerId`, `year`, `totalRevenue` (cash basis), `vatAmount`, `pitAmount`, `generatedFileUrl` (null) | n-1 User |
| **Amenity** | Tiện ích (danh mục) | `name`, `icon`, `type` (Room/Surrounding) | n-n RentalListing/Room |
| **BannedKeyword** | Từ khóa cấm | `keyword`, `isActive` | (danh mục Admin) |
| **Media** | File/ảnh | `ownerType` (RentalListing/RoommateWantedPost/Contract/Profile/Invoice/TaxDeclaration), `ownerId` (null khi mới upload), `url`, `mimeType`, `sizeBytes`, `isPrivate` | đa hình; media chưa gắn owner sau 24h bị job dọn |
| **Review** | Đánh giá khu trọ | `propertyId`, `authorUserId`, `contractId` (bằng chứng, unique), `rating` (1–5), `content` (≤1.000), `status` (Visible/Hidden/Reported), `sellerReply` (null, V2) | n-1 Property/User/Contract |

| **UtilityReadingSubmission** | Đề xuất chỉ số từ người ở | `roomId`, `occupancyId`, `submittedByUserId`, `type` (Electricity/Water), `period`, `submittedValue`, `photoMediaId` (bắt buộc), `status` (Pending/Approved/Rejected), `reviewedByUserId` (null), `approvedValue` (null), `rejectReason` (null) | n-1 Room/Occupancy/User |
| **Incident** | Báo cáo sự cố của người ở | `roomId`, `occupancyId`, `reportedByUserId`, `title`, `description`, `priority` (Low/Normal/High/Urgent), `status` (Open/Acknowledged/InProgress/Resolved/Closed), `resolvedAt` (null) | n-1 Room/Occupancy/User; 1-n IncidentComment/Media |
| **IncidentComment** | Trao đổi trong một sự cố | `incidentId`, `authorUserId`, `content`, `isFromSeller` | n-1 Incident/User |
| **DeviceToken** | Token push cho app mobile | `userId`, `token` (unique), `platform` (iOS/Android), `lastActiveAt` | n-1 User |

**Index đề xuất:** `RentalListing(status, district, price, propertyType, approvedAt, boostExpireAt, propertyId)`; `Room(propertyId, status)`; `Occupancy(roomId, userId)`; `Invoice(contractId, period unique)`; `UtilityReading(roomId, type, period unique)`; `Notification(userId, isRead)`; `Conversation(initiatorId, refType, refId unique)`; `Message(conversationId, createdAt)`; `Review(propertyId, status)`; `Property(publicSlug unique, isPublicProfileEnabled)`; `PlatformTransaction(idempotencyKey unique)`; `RefreshToken(userId)`; `Incident(roomId, status)`; `UtilityReadingSubmission(roomId, period, status)`; `DeviceToken(userId, token unique)`.

---

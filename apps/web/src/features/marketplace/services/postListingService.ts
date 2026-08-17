import type { PostListingFormValues } from '@/features/marketplace/types/postListing';

const MOCK_REQUEST_DELAY_MS = 220;
const MOCK_UPLOAD_DELAY_MS = 600;

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}

export interface UploadedPhoto {
  url: string;
  fileName: string;
}

/**
 * Tải một ảnh lên **ngay khi người dùng chọn**, không đợi tới lúc bấm Đăng tin.
 *
 * `DATA_ENTITIES.md` mô tả `Media` có `ownerId` null khi mới upload và "media chưa gắn owner
 * sau 24h bị job dọn" — tức backend vốn thiết kế cho việc tải trước, gắn chủ sau. Nhờ vậy
 * bản nháp chỉ cần lưu URL, và người dùng thấy ảnh lên ngay thay vì chờ một cục lúc gửi.
 */
// TODO: nối API thật khi packages/types sinh xong: POST /media (trả về url + id, ownerId null).
export async function uploadListingPhoto(file: File): Promise<UploadedPhoto> {
  await wait(MOCK_UPLOAD_DELAY_MS);

  if (!file.type.startsWith('image/')) {
    throw new Error('Chỉ nhận tệp ảnh.');
  }

  // Giai đoạn mock: giữ ảnh bằng object URL để xem trước được thật. Khi nối API thật thì
  // đây là URL do backend trả về.
  return { url: URL.createObjectURL(file), fileName: file.name };
}

export interface SubmitListingInput {
  values: PostListingFormValues;
  /** `true` = lưu nháp (BR-001 `Draft`), `false` = gửi duyệt (`PendingApproval`). */
  isDraft: boolean;
  listingId?: string;
}

export interface SubmitListingResult {
  listingId: string;
  status: 'Draft' | 'PendingApproval';
}

/**
 * Gửi tin. Trạng thái do server quyết định, client chỉ nói rõ ý định là lưu nháp hay gửi
 * duyệt — không tự gán `status` rồi đẩy lên.
 */
// TODO: nối API thật khi packages/types sinh xong:
// POST /marketplace/listings (tạo) và PUT /marketplace/listings/{id} (sửa).
export async function submitListing(input: SubmitListingInput): Promise<SubmitListingResult> {
  await wait(MOCK_REQUEST_DELAY_MS);

  return {
    listingId: input.listingId ?? `70000000-0000-4000-8000-${Date.now().toString().slice(-12)}`,
    status: input.isDraft ? 'Draft' : 'PendingApproval',
  };
}

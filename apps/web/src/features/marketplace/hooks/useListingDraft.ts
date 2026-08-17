'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type {
  ListingDraftSnapshot,
  PostListingFormValues,
} from '@/features/marketplace/types/postListing';

const DRAFT_KEY_PREFIX = 'tronhanh:listing-draft';
const AUTOSAVE_DELAY_MS = 1_000;
const DRAFT_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Tự lưu form đăng tin xuống máy để cứu khi mất mạng, sập nguồn hoặc đóng nhầm tab.
 *
 * Cố ý lưu **cục bộ**, không gọi API: đúng tình huống cần cứu nhất là lúc mạng đã hỏng, khi
 * đó gọi server cũng vô ích. Nút "Lưu nháp" (trạng thái `Draft`, BR-001) vẫn là lớp riêng,
 * dành cho việc lưu có chủ đích và dùng lại được ở máy khác.
 *
 * Ảnh không nằm ở đây: tệp ảnh là dữ liệu nhị phân, không lưu vừa. Đó là lý do ảnh được tải
 * lên ngay khi chọn — bản nháp chỉ giữ URL trả về.
 */
function draftKey(sellerId: string, listingId?: string) {
  return `${DRAFT_KEY_PREFIX}:${sellerId}:${listingId ?? 'new'}`;
}

function readDraft(key: string): ListingDraftSnapshot | null {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as ListingDraftSnapshot;
    if (!parsed?.savedAt || !parsed.values) return null;

    // Bản nháp quá cũ thường là tin người dùng đã bỏ hẳn; hỏi lại chỉ gây khó hiểu.
    if (Date.now() - Date.parse(parsed.savedAt) > DRAFT_MAX_AGE_MS) {
      window.localStorage.removeItem(key);
      return null;
    }

    return parsed;
  } catch {
    // Bộ nhớ hỏng hoặc bị chặn (chế độ riêng tư) — coi như không có nháp, không làm hỏng form.
    return null;
  }
}

/**
 * Form còn trắng thì không có gì để cứu.
 *
 * Thiếu chốt này thì chỉ cần mở trang rồi bỏ đi là đã ghi một bản nháp rỗng, và lần sau vào
 * người dùng bị hỏi "khôi phục bản nhập dở?" cho một cái form chưa hề nhập gì.
 */
function hasContent(values: PostListingFormValues): boolean {
  return Boolean(
    values.address.trim() ||
    values.wardCode ||
    values.title.trim() ||
    values.description.trim() ||
    values.area.trim() ||
    values.price.trim() ||
    values.contactPhone.trim() ||
    values.photoUrls.length > 0 ||
    values.amenities.length > 0 ||
    values.otherFees.length > 0 ||
    values.nearbyPlaces.length > 0 ||
    values.latitude !== null,
  );
}

export interface UseListingDraftOptions {
  sellerId: string;
  listingId?: string;
  values: PostListingFormValues;
  step: number;
  /** Tắt trong lúc đang khôi phục hoặc sau khi gửi thành công. */
  isEnabled: boolean;
}

export interface UseListingDraftResult {
  /** Bản nháp tìm thấy lúc mở trang, chờ người dùng quyết định khôi phục hay bỏ. */
  pendingDraft: ListingDraftSnapshot | null;
  savedAt: string | null;
  dismissDraft: () => void;
  clearDraft: () => void;
}

export function useListingDraft({
  sellerId,
  listingId,
  values,
  step,
  isEnabled,
}: UseListingDraftOptions): UseListingDraftResult {
  const key = draftKey(sellerId, listingId);
  const [pendingDraft, setPendingDraft] = useState<ListingDraftSnapshot | null>(null);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const hasCheckedRef = useRef(false);

  // Chỉ dò một lần lúc mở trang. Dò lại sau mỗi lần ghi sẽ tự hỏi khôi phục chính bản vừa lưu.
  useEffect(() => {
    if (hasCheckedRef.current) return;
    hasCheckedRef.current = true;
    setPendingDraft(readDraft(key));
  }, [key]);

  useEffect(() => {
    if (!isEnabled || pendingDraft || !hasContent(values)) return;

    const timer = setTimeout(() => {
      try {
        const snapshot: ListingDraftSnapshot = {
          values,
          step,
          savedAt: new Date().toISOString(),
        };
        window.localStorage.setItem(key, JSON.stringify(snapshot));
        setSavedAt(snapshot.savedAt);
      } catch {
        // Hết dung lượng hoặc bị chặn: bỏ qua im lặng. Mất tự lưu vẫn hơn là chặn người dùng
        // nhập tiếp; nút "Lưu nháp" thủ công vẫn dùng được.
      }
    }, AUTOSAVE_DELAY_MS);

    return () => clearTimeout(timer);
  }, [isEnabled, key, pendingDraft, step, values]);

  const clearDraft = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
    } catch {
      // Không có gì để dọn thì thôi.
    }
    setPendingDraft(null);
    setSavedAt(null);
  }, [key]);

  const dismissDraft = useCallback(() => {
    setPendingDraft(null);
  }, []);

  return { pendingDraft, savedAt, dismissDraft, clearDraft };
}

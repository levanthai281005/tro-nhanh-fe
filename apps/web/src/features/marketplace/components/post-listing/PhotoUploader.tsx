'use client';

import { ImagePlus, Loader2, X } from 'lucide-react';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { uploadListingPhoto } from '@/features/marketplace/services/postListingService';
import { cn } from '@/utils/cn';

const MIN_PHOTOS = 3;
const MAX_PHOTOS = 12;

export interface PhotoUploaderProps {
  value: string[];
  onChange: (next: string[]) => void;
  hasError?: boolean;
}

/**
 * Tải ảnh lên **ngay khi chọn**, không đợi tới lúc bấm Đăng tin.
 *
 * Nhờ vậy bản nháp tự lưu chỉ cần giữ URL — tệp ảnh là dữ liệu nhị phân, không lưu xuống máy
 * được, nên nếu đợi tới lúc gửi thì sập nguồn là mất sạch phần nặng công nhất. Người dùng
 * cũng thấy ảnh lên ngay và biết liền nếu tệp lỗi.
 */
export function PhotoUploader({ value, onChange, hasError }: PhotoUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploadingCount, setUploadingCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList?.length) return;

    const remaining = MAX_PHOTOS - value.length;
    const files = Array.from(fileList).slice(0, Math.max(0, remaining));
    if (!files.length) {
      setError(`Tối đa ${MAX_PHOTOS} ảnh.`);
      return;
    }

    setError(null);
    setUploadingCount(files.length);

    const uploaded: string[] = [];
    for (const file of files) {
      try {
        const result = await uploadListingPhoto(file);
        uploaded.push(result.url);
      } catch (uploadError) {
        setError(uploadError instanceof Error ? uploadError.message : 'Không tải được ảnh.');
      }
    }

    setUploadingCount(0);
    if (uploaded.length) onChange([...value, ...uploaded]);
  };

  const removePhoto = (url: string) => {
    onChange(value.filter((item) => item !== url));
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {value.map((url, index) => (
          <div
            className="group relative aspect-[4/3] overflow-hidden rounded-md border border-line"
            key={url}
          >
            <Image alt={`Ảnh ${index + 1}`} className="object-cover" fill sizes="200px" src={url} />
            {index === 0 ? (
              <span className="absolute left-1.5 top-1.5 rounded-sm bg-primary px-2 py-0.5 text-[10px] font-bold text-surface">
                Ảnh bìa
              </span>
            ) : null}
            <button
              aria-label={`Xóa ảnh ${index + 1}`}
              className="absolute right-1.5 top-1.5 flex size-6 items-center justify-center rounded-full bg-ink/70 text-surface transition-colors hover:bg-error"
              onClick={() => removePhoto(url)}
              type="button"
            >
              <X aria-hidden="true" className="size-3.5" />
            </button>
          </div>
        ))}

        {Array.from({ length: uploadingCount }, (_, index) => (
          <div
            className="flex aspect-[4/3] items-center justify-center rounded-md border border-dashed border-line bg-canvas"
            key={`uploading-${index}`}
          >
            <Loader2 aria-hidden="true" className="size-5 animate-spin text-ink-muted" />
          </div>
        ))}

        {value.length + uploadingCount < MAX_PHOTOS ? (
          <button
            className={cn(
              'flex aspect-[4/3] flex-col items-center justify-center gap-1.5 rounded-md border-[1.5px] border-dashed text-ink-muted transition-colors hover:border-primary hover:text-primary',
              hasError ? 'border-error' : 'border-line',
            )}
            data-testid="photo-upload-btn"
            onClick={() => inputRef.current?.click()}
            type="button"
          >
            <ImagePlus aria-hidden="true" className="size-5" />
            <span className="text-xs font-semibold">Thêm ảnh</span>
          </button>
        ) : null}
      </div>

      <input
        accept="image/*"
        className="hidden"
        multiple
        onChange={(event) => {
          void handleFiles(event.target.files);
          event.target.value = '';
        }}
        ref={inputRef}
        type="file"
      />

      <p className="m-0 text-xs text-ink-muted">
        Cần ít nhất {MIN_PHOTOS} ảnh — đã có {value.length}. Ảnh đầu tiên dùng làm ảnh bìa.
      </p>

      {error ? (
        <p className="m-0 text-xs font-semibold text-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

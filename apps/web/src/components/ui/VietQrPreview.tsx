'use client';

import { findBankByCode } from '@tronhanh/constants';
import { buildVietQrPayload } from '@tronhanh/utils';
import { QrCode } from 'lucide-react';
import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { cn } from '@/utils/cn';

export interface VietQrPreviewProps {
  /** `Property.bankName` — mã ngân hàng, không phải tên đầy đủ. */
  bankCode: string | null | undefined;
  accountNumber: string | null | undefined;
  accountName?: string | null;
  /** Số tiền VND. Bỏ trống ⇒ QR tĩnh, người chuyển tự nhập. */
  amount?: number | null;
  /** Nội dung chuyển khoản (tự bỏ dấu, tự cắt 25 ký tự). */
  purpose?: string;
  size?: number;
  className?: string;
}

/**
 * Mã VietQR để người ở chuyển tiền thẳng cho chủ trọ.
 *
 * **AS-002 — nền tảng không giữ tiền thuê.** Mã này là thật, không phải giả lập; tiền đi
 * thẳng vào tài khoản chủ trọ. (Mã VietQR ở màn mua gói SaaS thì ngược lại — chỗ đó phải ghi
 * rõ "giả lập".)
 *
 * QR được vẽ **tại máy người dùng**: số tài khoản không đi qua máy chủ nào khác. Đây là lý do
 * không dùng quicklink `img.vietqr.io`, vốn nhận số tài khoản và số tiền qua URL query.
 */
export function VietQrPreview({
  bankCode,
  accountNumber,
  accountName,
  amount,
  purpose,
  size = 176,
  className,
}: VietQrPreviewProps) {
  const [dataUrl, setDataUrl] = useState('');
  const [renderError, setRenderError] = useState('');

  const result = buildVietQrPayload({ bankCode, accountNumber, amount, purpose });
  const bank = findBankByCode(bankCode);
  const payload = result.ok ? result.payload : '';

  useEffect(() => {
    if (!payload) {
      setDataUrl('');
      return;
    }

    let isCancelled = false;
    setRenderError('');

    QRCode.toDataURL(payload, {
      errorCorrectionLevel: 'M',
      margin: 1,
      // Vẽ gấp đôi kích thước hiển thị để không rỗ trên màn hình mật độ cao — QR mờ thì máy
      // quét đọc chậm hoặc không đọc được.
      width: size * 2,
      color: { dark: '#2A1A0C', light: '#FFFFFF' },
    })
      .then((url) => {
        if (!isCancelled) setDataUrl(url);
      })
      .catch(() => {
        if (!isCancelled) setRenderError('Không tạo được mã QR. Vui lòng thử lại.');
      });

    return () => {
      isCancelled = true;
    };
  }, [payload, size]);

  if (!result.ok) {
    return (
      <div
        className={cn(
          'flex items-start gap-2.5 rounded-sm border border-line bg-canvas px-3.5 py-3',
          className,
        )}
      >
        <QrCode aria-hidden="true" className="mt-px size-4 shrink-0 text-ink-muted" />
        <p className="m-0 text-[13px] leading-relaxed text-ink-muted">{result.reason}</p>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col items-center gap-2.5', className)}>
      <div
        className="flex items-center justify-center rounded-sm border border-line bg-surface p-2.5"
        style={{ width: size + 20, height: size + 20 }}
      >
        {dataUrl ? (
          // Ảnh là data URI sinh tại chỗ, không qua mạng — `next/image` không tối ưu được gì
          // thêm (không có gì để tải, không có domain để cấu hình) mà lại thêm một lớp bọc
          // giữa QR và người quét. Đây là ngoại lệ có chủ đích của luật "không dùng thẻ img".
          <img alt="Mã VietQR nhận tiền" height={size} src={dataUrl} width={size} />
        ) : (
          <span className="text-xs text-ink-muted">{renderError || 'Đang tạo mã…'}</span>
        )}
      </div>

      <p className="m-0 text-center text-xs leading-relaxed text-ink-muted">
        {bank ? <span className="font-bold text-ink">{bank.name}</span> : null}
        {accountName ? <> · {accountName}</> : null}
        <br />
        {accountNumber}
      </p>
    </div>
  );
}

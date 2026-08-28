import { describe, expect, it } from 'vitest';
import {
  buildInvoiceCode,
  buildInvoiceTransferNote,
  MAX_TRANSFER_NOTE_LENGTH,
} from '../invoiceNote';

describe('buildInvoiceCode', () => {
  it('ghép mã phòng với kỳ đã bỏ gạch nối', () => {
    expect(buildInvoiceCode({ roomCode: 'P101', period: '2026-08' })).toBe('P101-202608');
  });

  it('bỏ khoảng trắng thừa quanh mã phòng', () => {
    expect(buildInvoiceCode({ roomCode: ' A1 ', period: '2026-12' })).toBe('A1-202612');
  });
});

describe('buildInvoiceTransferNote', () => {
  it('giữ dạng dễ đọc nhất khi còn chỗ', () => {
    expect(buildInvoiceTransferNote({ roomCode: 'P101', period: '2026-08' })).toBe(
      'HD P101 2026 08',
    );
  });

  /**
   * Cạm bẫy đã ghi trong `PROJECT_STATE.md`: "Tiền phòng P101 kỳ 2026-08" dài 26 ký tự sau khi
   * bỏ dấu, bị `toAsciiPurpose` cắt cụt mất chữ số cuối của kỳ mà không báo gì.
   */
  it('không bao giờ vượt 25 ký tự, kể cả với mã phòng dài nhất schema cho phép', () => {
    const roomCode = 'PHONG TANG 3 SO 12AB'; // 20 ký tự — trần của `roomCodeSchema`
    const note = buildInvoiceTransferNote({ roomCode, period: '2026-08' });

    expect(note.length).toBeLessThanOrEqual(MAX_TRANSFER_NOTE_LENGTH);
  });

  it('cắt mã phòng chứ không cắt kỳ', () => {
    const note = buildInvoiceTransferNote({ roomCode: 'PHONG TANG 3 SO 12AB', period: '2026-08' });

    expect(note.endsWith('202608')).toBe(true);
  });

  it('bỏ dấu tiếng Việt trong mã phòng', () => {
    expect(buildInvoiceTransferNote({ roomCode: 'Phòng Đ1', period: '2026-08' })).toBe(
      'HD Phong D1 2026 08',
    );
  });

  it('rơi xuống kỳ dạng gọn khi dạng dài không vừa', () => {
    // Mã phòng 15 ký tự: "… 2026 08" dài 23 nhưng "HD …" dài 26 nên bậc 1 rớt, bậc 2 vừa.
    const note = buildInvoiceTransferNote({ roomCode: 'PHONG SO 12 A B', period: '2026-08' });

    expect(note).toBe('PHONG SO 12 A B 2026 08');
    expect(note.length).toBeLessThanOrEqual(MAX_TRANSFER_NOTE_LENGTH);
  });
});

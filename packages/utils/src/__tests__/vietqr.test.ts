import { describe, expect, it } from 'vitest';
import { buildVietQrPayload, crc16CcittFalse, toAsciiPurpose } from '../vietqr';

/** MB Bank — BIN 970422, có trong `VIETNAM_BANKS`. */
const VALID_INPUT = { bankCode: 'MB', accountNumber: '0912345678' } as const;

function payloadOf(result: ReturnType<typeof buildVietQrPayload>): string {
  if (!result.ok) throw new Error(`Đáng lẽ dựng được chuỗi, nhưng: ${result.reason}`);
  return result.payload;
}

/**
 * Đọc giá trị của một trường TLV ở cấp ngoài cùng.
 *
 * Test tự parse lại chuỗi thay vì so với một chuỗi vàng chép tay: chép tay thì test chỉ chứng
 * minh code khớp với chính nó tại thời điểm chép, còn parse lại thì bắt được lỗi độ dài —
 * loại lỗi khiến app ngân hàng từ chối mà mắt người không thấy.
 */
function readTlv(payload: string, tag: string): string | null {
  let cursor = 0;
  while (cursor + 4 <= payload.length) {
    const currentTag = payload.slice(cursor, cursor + 2);
    const length = Number(payload.slice(cursor + 2, cursor + 4));
    const value = payload.slice(cursor + 4, cursor + 4 + length);
    if (currentTag === tag) return value;
    cursor += 4 + length;
  }
  return null;
}

describe('crc16CcittFalse', () => {
  /**
   * `"123456789"` → `29B1` là **check value chuẩn** của CRC-16/CCITT-FALSE, lấy từ catalog
   * CRC chứ không phải từ code này. Đây là điểm neo duy nhất chứng minh thuật toán đúng.
   */
  it('khớp check value chuẩn của thuật toán', () => {
    expect(crc16CcittFalse('123456789')).toBe('29B1');
  });

  it('luôn trả 4 ký tự hex hoa, pad 0 khi cần', () => {
    for (const sample of ['', 'A', 'Trọ Nhanh', '000201']) {
      expect(crc16CcittFalse(sample)).toMatch(/^[0-9A-F]{4}$/);
    }
  });
});

describe('toAsciiPurpose', () => {
  it('bỏ dấu tiếng Việt — app ngân hàng không nhận unicode ở trường 62.08', () => {
    expect(toAsciiPurpose('Tiền phòng P101')).toBe('Tien phong P101');
  });

  it('chuyển đ/Đ thành d/D', () => {
    expect(toAsciiPurpose('đóng Điện')).toBe('dong Dien');
  });

  it('gộp khoảng trắng thừa sinh ra khi thay ký tự lạ', () => {
    expect(toAsciiPurpose('P101 - kỳ 2026/08')).toBe('P101 ky 2026 08');
  });

  it('cắt còn 25 ký tự theo giới hạn NAPAS', () => {
    expect(toAsciiPurpose('a'.repeat(40))).toHaveLength(25);
  });

  /**
   * Giới hạn 25 ký tự **cắn vào nội dung thật**, không phải trường hợp biên hiếm gặp:
   * "Tiền phòng P101 kỳ 2026-08" là đúng dạng nội dung mà màn hóa đơn (B12) sẽ sinh, và nó
   * dài 26 ký tự sau khi bỏ dấu. Ghi lại ở đây để lúc làm B12 biết mà rút gọn chủ động
   * (VD "P101 2026-08") thay vì để chuỗi bị cắt cụt giữa chừng.
   */
  it('nội dung hóa đơn dạng đầy đủ bị cắt — B12 phải tự rút gọn', () => {
    expect(toAsciiPurpose('Tiền phòng P101 kỳ 2026-08')).toBe('Tien phong P101 ky 2026 0');
  });
});

describe('buildVietQrPayload — cấu trúc EMVCo', () => {
  it('mở đầu bằng Payload Format Indicator "01"', () => {
    expect(readTlv(payloadOf(buildVietQrPayload(VALID_INPUT)), '00')).toBe('01');
  });

  it('không có số tiền ⇒ QR tĩnh (Point of Initiation "11")', () => {
    expect(readTlv(payloadOf(buildVietQrPayload(VALID_INPUT)), '01')).toBe('11');
  });

  it('có số tiền ⇒ QR động (Point of Initiation "12") và mang đúng số tiền', () => {
    const payload = payloadOf(buildVietQrPayload({ ...VALID_INPUT, amount: 3200000 }));
    expect(readTlv(payload, '01')).toBe('12');
    expect(readTlv(payload, '54')).toBe('3200000');
  });

  it('tiền tệ VND và mã quốc gia VN', () => {
    const payload = payloadOf(buildVietQrPayload(VALID_INPUT));
    expect(readTlv(payload, '53')).toBe('704');
    expect(readTlv(payload, '58')).toBe('VN');
  });

  it('nhúng đúng mã BIN của ngân hàng và số tài khoản', () => {
    const merchant = readTlv(payloadOf(buildVietQrPayload(VALID_INPUT)), '38');
    expect(merchant).toContain('970422');
    expect(merchant).toContain('0912345678');
  });

  it('VND không có phần thập phân — làm tròn số tiền lẻ', () => {
    const payload = payloadOf(buildVietQrPayload({ ...VALID_INPUT, amount: 1234.6 }));
    expect(readTlv(payload, '54')).toBe('1235');
  });

  it('CRC ở cuối khớp với phần còn lại của chuỗi', () => {
    const payload = payloadOf(buildVietQrPayload(VALID_INPUT));
    const body = payload.slice(0, -4);
    expect(body.endsWith('6304')).toBe(true);
    expect(payload.slice(-4)).toBe(crc16CcittFalse(body));
  });

  it('mọi trường khai đúng độ dài — chuỗi parse hết, không dư byte', () => {
    const payload = payloadOf(buildVietQrPayload({ ...VALID_INPUT, amount: 500000 }));
    let cursor = 0;
    while (cursor < payload.length) {
      const length = Number(payload.slice(cursor + 2, cursor + 4));
      expect(Number.isNaN(length)).toBe(false);
      cursor += 4 + length;
    }
    expect(cursor).toBe(payload.length);
  });
});

describe('buildVietQrPayload — từ chối dữ liệu thiếu', () => {
  it('chưa chọn ngân hàng', () => {
    const result = buildVietQrPayload({ bankCode: null, accountNumber: '0912345678' });
    expect(result).toEqual({ ok: false, reason: 'Khu trọ chưa chọn ngân hàng nhận tiền.' });
  });

  it('mã ngân hàng không có trong danh sách — không đoán bừa BIN', () => {
    const result = buildVietQrPayload({ bankCode: 'mbbank', accountNumber: '0912345678' });
    expect(result.ok).toBe(false);
  });

  it('nhận mã ngân hàng viết thường hoặc thừa khoảng trắng', () => {
    expect(buildVietQrPayload({ bankCode: ' mb ', accountNumber: '0912345678' }).ok).toBe(true);
  });

  it.each([
    ['', 'rỗng'],
    ['12345', 'quá ngắn'],
    ['0912 345 678', 'có khoảng trắng'],
    ['09A2345678', 'có chữ'],
  ])('từ chối số tài khoản %s (%s)', (accountNumber) => {
    expect(buildVietQrPayload({ bankCode: 'MB', accountNumber }).ok).toBe(false);
  });
});

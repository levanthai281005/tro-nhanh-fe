import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';

export default function RoomDetailNotFound() {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-[720px] items-center px-4 py-10 md:px-8">
      <EmptyState
        action={
          <Link href="/tim-phong">
            <Button>Xem phòng đang đăng</Button>
          </Link>
        }
        description="Tin này có thể không còn hiển thị hoặc đường dẫn không chính xác."
        title="Không tìm thấy thông tin phòng trọ này"
      />
    </div>
  );
}

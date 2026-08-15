import { ArrowRight, Search, Users } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ModalShell } from '@/components/ui/ModalShell';

export interface PostTypeModalProps {
  onClose: () => void;
  onSelect: (kind: 'RoomWanted' | 'RoommateWanted') => void;
}

const POST_TYPE_OPTIONS = [
  {
    kind: 'RoomWanted',
    Icon: Search,
    title: 'Đăng nhu cầu tìm phòng',
    description: 'Cho chủ trọ biết khu vực, ngân sách và loại phòng bạn cần.',
  },
  {
    kind: 'RoommateWanted',
    Icon: Users,
    title: 'Đăng tin tìm người ở ghép',
    description: 'Tìm người phù hợp để cùng chia sẻ phòng và chi phí thuê.',
  },
] as const;

export function PostTypeModal({ onClose, onSelect }: PostTypeModalProps) {
  return (
    <ModalShell
      footer={
        <Button onClick={onClose} variant="ghost">
          Đóng
        </Button>
      }
      onClose={onClose}
      title="Chọn loại tin muốn đăng"
    >
      <p className="text-[13px] leading-[1.65] text-ink-muted">
        Người thuê có thể đăng nhu cầu tìm phòng hoặc tìm người phù hợp để ở ghép.
      </p>
      {POST_TYPE_OPTIONS.map(({ kind, Icon, title, description }) => (
        <button
          key={kind}
          className="flex min-h-[72px] w-full items-center gap-3 rounded-md border border-line bg-canvas p-3.5 text-left transition-colors hover:bg-cream"
          onClick={() => onSelect(kind)}
          type="button"
        >
          <span className="flex size-[38px] shrink-0 items-center justify-center rounded-[10px] bg-primary-soft text-primary">
            <Icon aria-hidden="true" className="size-[18px]" />
          </span>
          <span className="min-w-0 flex-1">
            <strong className="mb-1 block text-sm font-bold text-ink">{title}</strong>
            <span className="block text-xs leading-[1.5] text-ink-muted">{description}</span>
          </span>
          <ArrowRight aria-hidden="true" className="size-4 shrink-0 text-sand" />
        </button>
      ))}
    </ModalShell>
  );
}

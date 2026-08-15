import { Button } from '@/components/ui/Button';
import { ModalShell } from '@/components/ui/ModalShell';

export interface InfoModalProps {
  description: string;
  onClose: () => void;
  title: string;
}

export function InfoModal({ description, onClose, title }: InfoModalProps) {
  return (
    <ModalShell
      footer={<Button onClick={onClose}>Đã hiểu</Button>}
      onClose={onClose}
      title={title}
    >
      <p className="text-sm leading-[1.7] text-ink-muted">{description}</p>
    </ModalShell>
  );
}

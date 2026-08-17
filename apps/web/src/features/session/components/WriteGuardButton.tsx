'use client';

import type { SurfaceId } from '@tronhanh/access';
import { Button, type ButtonProps } from '@/components/ui/Button';
import { useSurfaceAccess } from '@/features/session/hooks/useSurfaceAccess';

export interface WriteGuardButtonProps extends ButtonProps {
  surface: SurfaceId;
}

/**
 * Nút thực hiện thao tác **ghi**, tự khóa khi Surface không cho ghi (BR-015).
 *
 * Vì sao là một wrapper chứ không nhét `requiresWrite` thẳng vào `Button` dùng chung như bản
 * prototype: `components/ui/` là hạ tầng cho cả ba Surface: buộc nó phụ thuộc context của
 * tầng phiên sẽ kéo ngược ranh giới vừa dựng, và `Button` sẽ không dùng được ở màn công khai
 * không có provider.
 *
 * Đánh đổi đã biết: quên dùng đúng wrapper thì nút hở. Bù lại bằng quy ước — **mọi nút gọi
 * mutation trong Surface có gating đều dùng component này**, và bản thân service vẫn phải bị
 * backend chặn (`WORKSPACE_READ_ONLY`) vì guard client chỉ là UX.
 */
export function WriteGuardButton({ surface, disabled, title, ...props }: WriteGuardButtonProps) {
  const { canWrite, denial } = useSurfaceAccess(surface);

  return (
    <Button
      {...props}
      disabled={disabled || !canWrite}
      title={canWrite ? title : (denial?.message ?? title)}
    />
  );
}

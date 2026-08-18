import { Skeleton } from '@/components/ui/Skeleton';

export default function RoomDetailLoading() {
  return (
    <div className="mx-auto w-full max-w-[1200px] px-4 py-6 md:px-8 md:py-8">
      <Skeleton className="h-[280px] md:h-[460px]" count={1} />
      <div className="mt-8 grid gap-8 md:grid-cols-[minmax(0,1fr)_340px]">
        <Skeleton count={8} />
        <Skeleton count={5} />
      </div>
    </div>
  );
}

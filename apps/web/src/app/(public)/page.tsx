import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import type { Metadata } from 'next';
import { HomePage } from '@/features/marketplace/components/home/HomePage';
import { HOME_QUERY_KEYS } from '@/features/marketplace/constants/homeQueryKeys';
import {
  getFeaturedListings,
  listActiveDemandPosts,
} from '@/features/marketplace/services/homeService';

export const metadata: Metadata = {
  title: 'Trọ Nhanh — Tìm phòng và quản lý trọ dễ dàng',
  description: 'Tìm phòng trọ, căn hộ và đăng nhu cầu thuê trực tiếp trên nền tảng Trọ Nhanh.',
};

export const revalidate = 60;

const FEATURED_LIMIT = 4;

export default async function HomePageRoute() {
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: HOME_QUERY_KEYS.featuredListings(FEATURED_LIMIT),
      queryFn: () => getFeaturedListings(FEATURED_LIMIT),
    }),
    queryClient.prefetchQuery({
      queryKey: HOME_QUERY_KEYS.demandPosts(),
      queryFn: listActiveDemandPosts,
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HomePage />
    </HydrationBoundary>
  );
}

import type { Metadata } from 'next';
import { PostListingForm } from '@/features/marketplace/components/post-listing/PostListingForm';
import { MOCK_SELLER_ID } from '@/features/marketplace/constants/mockMyListings';

export const metadata: Metadata = {
  title: 'Đăng tin cho thuê',
};

export default function PostListingRoute() {
  // TODO: nối AuthContext khi có; thay mock id bằng user.id từ session đã xác thực.
  return <PostListingForm sellerId={MOCK_SELLER_ID} />;
}

'use client';

import { Car, Heart, MapPin, Wifi, Wind } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { Badge, type RoomStatus } from '@/components/ui/Badge';
import { cn } from '@/utils/cn';

interface SampleRoom {
  title: string;
  price: string;
  area: number;
  location: string;
  status: RoomStatus;
  imageUrl: string;
}

const SAMPLE_ROOMS: SampleRoom[] = [
  {
    title: 'Phòng trọ cao cấp, full nội thất, gần ĐH Bách Khoa',
    price: '3.200.000',
    area: 25,
    location: 'Quận 10',
    status: 'Available',
    imageUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=480&q=80',
  },
  {
    title: 'Căn hộ dịch vụ ban công đẹp, thang máy, 1PN',
    price: '6.500.000',
    area: 38,
    location: 'Bình Thạnh',
    status: 'Rented',
    imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=480&q=80',
  },
  {
    title: 'Phòng gác lửng thoáng mát, WC riêng, giờ tự do',
    price: '2.400.000',
    area: 22,
    location: 'Quận 12',
    status: 'Deposited',
    imageUrl: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=480&q=80',
  },
];

export function RoomCardShowcase() {
  return (
    <div className="mb-8">
      <p className="mb-1.5 text-[15px] font-bold text-ink">5d · Room Card (Thẻ phòng)</p>
      <p className="mb-4 text-[13px] text-ink-muted">
        Thumbnail · Status chip · Giá màu primary · Diện tích & khu vực · 3 amenity icons · Heart
        save toggle
      </p>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
        {SAMPLE_ROOMS.map((room) => (
          <RoomCard key={room.title} room={room} />
        ))}
      </div>
    </div>
  );
}

function RoomCard({ room }: { room: SampleRoom }) {
  const [isSaved, setIsSaved] = useState(false);

  return (
    <article className="overflow-hidden rounded-lg border border-line bg-surface shadow-md">
      <div className="relative h-40">
        <Image
          alt={room.title}
          className="object-cover"
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          src={room.imageUrl}
        />
        <button
          aria-label={isSaved ? 'Bỏ lưu tin' : 'Lưu tin'}
          className="absolute right-2.5 top-2.5 flex size-[34px] items-center justify-center rounded-full bg-surface/90 shadow-md"
          onClick={() => setIsSaved((saved) => !saved)}
          type="button"
        >
          <Heart
            aria-hidden="true"
            className={cn('size-4', isSaved ? 'fill-accent-warn text-accent-warn' : 'text-sand')}
          />
        </button>
        <Badge className="absolute left-2.5 top-2.5" kind="room" status={room.status} />
      </div>
      <div className="px-3.5 pb-3.5 pt-3">
        <p className="mb-1 line-clamp-2 text-sm font-semibold leading-[1.4] text-ink">
          {room.title}
        </p>
        <p className="mb-1 text-lg font-bold text-primary">
          {room.price} đ<span className="text-xs font-normal text-ink-muted">/tháng</span>
        </p>
        <div className="mb-2.5 flex items-center gap-1">
          <MapPin aria-hidden="true" className="size-3 text-ink-muted" />
          <span className="text-xs text-ink-muted">
            {room.area} m² · {room.location}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {[
            { Icon: Wifi, label: 'Wifi' },
            { Icon: Wind, label: 'Máy lạnh' },
            { Icon: Car, label: 'Để xe' },
          ].map(({ Icon, label }) => (
            <span key={label} className="flex items-center gap-[3px]">
              <Icon aria-hidden="true" className="size-3 text-sand" />
              <span className="text-[11px] text-ink-muted">{label}</span>
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

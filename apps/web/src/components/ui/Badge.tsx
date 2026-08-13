import type { HTMLAttributes } from 'react';

export type RoomStatus = 'Available' | 'Deposited' | 'Rented' | 'Hidden';
export type ListingStatus =
  'Draft' | 'PendingApproval' | 'Active' | 'Rejected' | 'Expired' | 'Rented' | 'Hidden';
export type InvoiceStatus = 'Unpaid' | 'PartiallyPaid' | 'Paid' | 'Overdue';
export type ContractStatus = 'Draft' | 'Active' | 'Expired' | 'Terminated';

export type BadgeProps = HTMLAttributes<HTMLSpanElement> &
  (
    | { kind?: 'room'; status: RoomStatus }
    | { kind: 'listing'; status: ListingStatus }
    | { kind: 'invoice'; status: InvoiceStatus }
    | { kind: 'contract'; status: ContractStatus }
  );

export function Badge(props: BadgeProps) {
  void props;
  return null;
}

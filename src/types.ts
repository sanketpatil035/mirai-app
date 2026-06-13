export type NoticeCategory = "General" | "Maintenance" | "Event" | "Security" | "Meeting";

export interface Notice {
  id: string;
  title: string;
  description: string;
  category: NoticeCategory;
  date: string;
  author: string;
  urgent: boolean;
}

export type ComplaintStatus = "Pending" | "In Progress" | "Resolved";
export type ComplaintCategory = "Plumbing" | "Electrical" | "Housekeeping" | "Security" | "Parking" | "Other";

export interface Complaint {
  id: string;
  title: string;
  description: string;
  category: ComplaintCategory;
  status: ComplaintStatus;
  raisedBy: string;
  raisedByFlat: string;
  dateRaised: string;
  urgency: "Low" | "Medium" | "High";
  adminRemarks?: string;
}

export interface AmenityBooking {
  id: string;
  amenityId: string;
  amenityName: string;
  bookedBy: string;
  bookedByFlat: string;
  date: string;
  timeSlot: string;
  status: "Approved" | "Pending" | "Rejected";
  guestsCount: number;
  bookedAt: string;
}

export interface ResidentUnit {
  id: string;
  flatNo: string;
  block: "A" | "B" | "C" | "D";
  ownerName: string;
  ownerEmail: string;
  status: "Owner" | "Tenant";
  duesStatus: "Paid" | "Unpaid";
  duesAmount: number;
  lastPaymentDate?: string;
}

export interface Facility {
  id: string;
  name: string;
  description: string;
  capacity: string;
  location: string;
  operatingHours: string;
  imageUrl: string;
  features: string[];
}

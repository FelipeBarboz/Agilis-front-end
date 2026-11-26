export interface PositionCity {
  city: string;
  state: string;
}

export type AttendanceType = "CLIENT_LOCATION" | "FIXED_LOCATION" | "BOTH";

export interface StorePosition {
  id: string;
  storeId?: string;
  title: string;
  description: string;
  employeeCount?: number;
  canManageBookings: boolean;
  canAccessChats: boolean;
  canManageStoreSettings: boolean;
  canViewReports: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateStorePositionPayload {
  storeId: string;
  title: string;
  description: string;
  canManageBookings: boolean;
  canAccessChats: boolean;
  canManageStoreSettings: boolean;
  canViewReports: boolean;
}

export interface UpdateStorePositionPayload {
  title: string;
  description: string;
  canManageBookings: boolean;
  canAccessChats: boolean;
  canManageStoreSettings: boolean;
  canViewReports: boolean;
}

export interface UpdateMemberPositionPayload {
  positionId: string;
}

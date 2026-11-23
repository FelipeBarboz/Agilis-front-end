export interface PositionCity {
  city: string;
  state: string;
}

export type AttendanceType = "CLIENT_LOCATION" | "FIXED_LOCATION" | "BOTH" | string;

export interface StorePosition {
  id: string;
  storeId?: string;
  attendanceType: AttendanceType;
  radiusKm: number;
  referenceAddress: string;
  cities: PositionCity[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateStorePositionPayload {
  requesterId?: string;
  storeId: string;
  attendanceType: AttendanceType;
  radiusKm: number;
  referenceAddress: string;
  cities: PositionCity[];
}

export interface UpdateStorePositionPayload {
  requesterId?: string;
  storeId: string;
  attendanceType: AttendanceType;
  radiusKm: number;
  referenceAddress: string;
  cities: PositionCity[];
}

export interface UpdateMemberPositionPayload {
  positionId: string;
}

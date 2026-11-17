export interface FavoriteItemDTO {
  id: string;
  favoriteId?: string;
  serviceId?: string;
  storeId?: string;
  unitId?: string;
  title: string;
  description: string;
  price: number;
  priceType: string;
  durationMinutes: number;
  category: string;
  createdAt?: string;
  thumbnailUrl?: string;
  imageUrl?: string;
  storeName?: string;
  company?: string;
  storeProfileImgUrl?: string;
  avgRating?: number;
  rating?: number;
  reviewCount?: number;
  reviewsCount?: number;
  totalServices?: number;
  nextAvailableSlot?: string;
  availability?: string;
  images?: Array<{ id?: string; url: string }> | string[];
}

export interface FavoriteCreateResponseDTO {
  favoriteId: string;
  userId: string;
  serviceId: string;
  createdAt: string;
}

export interface FavoriteService {
  id: string;
  favoriteId?: string;
  serviceId?: string;
  storeId?: string;
  unitId?: string;
  name: string;
  imageUrl: string;
  rating: number;
  reviewsCount: number;
  servicesCount: number;
  providerName: string;
  providerAvatarUrl: string;
  availabilityLabel: string;
  startingPrice: number;
  isFavorite: boolean;
  category?: string;
  description?: string;
  durationMinutes?: number;
  priceType?: string;
  createdAt?: string;
}

export interface FavoriteService {
  id: string;
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
}
import type { Filters } from "./filter-panel";

export const DEFAULT_FILTERS: Filters = {
    type: "todos",
    state: "",
    city: "",
    minPrice: "",
    maxPrice: "",
    priceRange: [0, 10000],
    rating: 0,
};
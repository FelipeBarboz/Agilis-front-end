import { NextResponse } from "next/server";
import {
  getPaginatedServices,
  type ServiceFilterType,
} from "@/lib/mocks/services";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const filterParam = searchParams.get("filter") as ServiceFilterType | null;
  const pageParam = searchParams.get("page");
  const limitParam = searchParams.get("limit");

  const validFilters: ServiceFilterType[] = [
    "most_visited",
    "top_rated",
    "most_hired",
  ];

  const filter: ServiceFilterType =
    filterParam && validFilters.includes(filterParam)
      ? filterParam
      : "most_visited";

  const page = pageParam ? parseInt(pageParam, 10) : 1;
  const limit = limitParam ? parseInt(limitParam, 10) : 5;

  const result = getPaginatedServices({
    filter,
    page: isNaN(page) ? 1 : page,
    limit: isNaN(limit) ? 5 : limit,
  });

  return NextResponse.json(result);
}

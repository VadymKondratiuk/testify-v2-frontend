import { api } from "@/shared/api/axios";

export type TagSuggestion = {
  id: string;
  name: string;
  usageCount: number;
};

type BackendTag = {
  id: string;
  name: string;
  _count?: {
    questions?: number;
  };
};

type TagsResponse = {
  items: BackendTag[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pageCount: number;
  };
};

export function normalizeTagName(value: string) {
  return value
    .trim()
    .replace(/^#+/, "")
    .replace(/\s+/g, " ")
    .toLowerCase();
}

export async function searchTags(search: string, signal?: AbortSignal) {
  const normalizedSearch = normalizeTagName(search);
  const { data } = await api.get<TagsResponse>("/tags", {
    signal,
    params: {
      search: normalizedSearch || undefined,
      limit: 8,
    },
  });

  return data.items.map((tag) => ({
    id: tag.id,
    name: tag.name,
    usageCount: tag._count?.questions ?? 0,
  }));
}

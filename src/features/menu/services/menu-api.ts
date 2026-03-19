import type { Category, MenuItem } from "@/features/menu/types";
import { apiClient } from "@/services/api-client";

type ApiCategory = {
  id: string;
  name: string;
  slug: string;
  image?: string | null;
  description?: string | null;
};

type ApiMenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  available: boolean;
  featured: boolean;
  tags: string[];
  category?: string;
  categoryId?: string;
};

const toMenuItem = (item: ApiMenuItem): MenuItem => ({
  id: item.id,
  name: item.name,
  description: item.description,
  price: item.price,
  image: item.image,
  available: item.available,
  featured: item.featured,
  tags: item.tags || [],
  category: item.category || item.categoryId || "",
});

export const menuApi = {
  getCategories: async (): Promise<Category[]> => {
    try {
      const response = await apiClient.get<{ data: ApiCategory[] }>("/categories");
      return response.data.data;
    } catch {
      return [];
    }
  },

  getMenuItems: async (category?: string): Promise<MenuItem[]> => {
    try {
      const response = await apiClient.get<{ data: ApiMenuItem[] }>("/menu-items", {
        params: {
          ...(category && category !== "all" ? { category } : {}),
        },
      });

      return response.data.data.map(toMenuItem);
    } catch {
      return [];
    }
  },

  getMenuItem: async (id: string): Promise<MenuItem | undefined> => {
    try {
      const response = await apiClient.get<{ data: ApiMenuItem }>(`/menu-items/${id}`);
      return toMenuItem(response.data.data);
    } catch {
      return undefined;
    }
  },

  getFeaturedItems: async (): Promise<MenuItem[]> => {
    try {
      const response = await apiClient.get<{ data: ApiMenuItem[] }>("/menu-items", {
        params: { featured: true },
      });

      return response.data.data.map(toMenuItem);
    } catch {
      return [];
    }
  },
};

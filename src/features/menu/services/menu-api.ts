import type { Category, MenuItem } from "@/features/menu/types";
import { categories, menuItems } from "@/mocks/menu";

// Structured for future Strapi integration — swap mock returns with apiClient calls
export const menuApi = {
  getCategories: async (): Promise<Category[]> => {
    // Future: return (await apiClient.get('/categories')).data;
    return categories;
  },

  getMenuItems: async (category?: string): Promise<MenuItem[]> => {
    // Future: return (await apiClient.get('/menu-items', { params: { category } })).data;
    if (category && category !== 'all') {
      return menuItems.filter((item) => item.category === category);
    }
    return menuItems;
  },

  getMenuItem: async (id: string): Promise<MenuItem | undefined> => {
    // Future: return (await apiClient.get(`/menu-items/${id}`)).data;
    return menuItems.find((item) => item.id === id);
  },

  getFeaturedItems: async (): Promise<MenuItem[]> => {
    return menuItems.filter((item) => item.featured);
  },
};

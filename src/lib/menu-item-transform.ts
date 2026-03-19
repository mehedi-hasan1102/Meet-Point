import type { MenuItem as PrismaMenuItem, Category } from "@prisma/client";

type MenuItemWithCategory = PrismaMenuItem & { category: Category };

export function toMenuItemResponse(item: MenuItemWithCategory) {
  return {
    id: item.id,
    name: item.name,
    description: item.description,
    price: item.price,
    image: item.image,
    available: item.available,
    featured: item.featured,
    tags: item.tags,
    categoryId: item.categoryId,
    category: item.category.slug,
    categoryName: item.category.name,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const MAX_ADMIN_USERS = 7;

const defaultAdmins = Array.from({ length: MAX_ADMIN_USERS }, (_, idx) => {
  const n = idx + 1;
  return {
    email: process.env[`ADMIN_EMAIL_${n}`],
    name: process.env[`ADMIN_NAME_${n}`] || `Admin ${n}`,
    password: process.env[`ADMIN_PASSWORD_${n}`],
  };
})
  .filter((admin) => admin.email && admin.password)
  .map((admin) => ({
    email: admin.email,
    name: admin.name,
    password: admin.password,
  }));

if (defaultAdmins.length === 0) {
  defaultAdmins.push({
    email: "admin@meetpoint.com",
    name: "Meet Point Admin",
    password: "ChangeThisPassword123!",
  });
}

const defaultCategories = [
  {
    name: "স্টার্টার",
    slug: "appetizers",
    description: "খাবারের শুরুটা আরও মজাদার করুন",
  },
  {
    name: "মেইন কোর্স",
    slug: "entrees",
    description: "পেট ভরে খাওয়ার সেরা আয়োজন",
  },
  {
    name: "ড্রিংকস",
    slug: "drinks",
    description: "শীতল ও সতেজ পানীয়",
  },
];

const defaultMenuItems = [
  {
    name: "ক্রিসপি ক্যালামারি",
    description: "হালকা মশলায় মেরিনেট করা ক্যালামারি রিংস, সাথে মেরিনারা সস ও লেমন আইওলি।",
    price: 13.99,
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=500&h=400&fit=crop",
    categorySlug: "appetizers",
    available: true,
    featured: true,
    tags: ["popular"],
  },
  {
    name: "গ্রিলড রিবআই স্টেক",
    description: "রসালো রিবআই স্টেক, সাথে রোস্টেড সবজি ও গার্লিক ম্যাশড পটেটো।",
    price: 34.99,
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=500&h=400&fit=crop",
    categorySlug: "entrees",
    available: true,
    featured: true,
    tags: ["premium", "popular"],
  },
  {
    name: "প্যান-সিয়ার্ড সালমন",
    description: "লেমন বাটার সসে রান্না করা সালমন, সাথে অ্যাসপারাগাস ও হার্ব রাইস।",
    price: 28.99,
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=500&h=400&fit=crop",
    categorySlug: "entrees",
    available: true,
    featured: true,
    tags: ["healthy"],
  },
  {
    name: "ফ্রেশ লেমনেড",
    description: "তাজা লেবু, পুদিনা ও হালকা মধুর স্বাদে তৈরি ঠান্ডা লেমনেড।",
    price: 5.99,
    image: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=500&h=400&fit=crop",
    categorySlug: "drinks",
    available: true,
    featured: false,
    tags: [],
  },
  {
    name: "আইসড কফি",
    description: "ঠান্ডা ব্রু কফি, আইস ও পছন্দমতো দুধ দিয়ে পরিবেশিত।",
    price: 4.99,
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500&h=400&fit=crop",
    categorySlug: "drinks",
    available: true,
    featured: false,
    tags: [],
  },
];

async function seedAdmins() {
  if (defaultAdmins.length > MAX_ADMIN_USERS) {
    throw new Error(`Admin seed exceeds max limit (${MAX_ADMIN_USERS}).`);
  }

  for (const admin of defaultAdmins) {
    const passwordHash = await bcrypt.hash(admin.password, 12);

    await prisma.adminUser.upsert({
      where: { email: admin.email.toLowerCase() },
      update: {
        name: admin.name,
        passwordHash,
        isActive: true,
        role: "admin",
      },
      create: {
        email: admin.email.toLowerCase(),
        name: admin.name,
        passwordHash,
        isActive: true,
        role: "admin",
      },
    });
  }
}

async function seedCategories() {
  for (const category of defaultCategories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        description: category.description,
      },
      create: category,
    });
  }
}

async function seedMenuItems() {
  const existingCount = await prisma.menuItem.count();
  if (existingCount > 0) {
    return;
  }

  const categories = await prisma.category.findMany();
  const categoryMap = new Map(categories.map((category) => [category.slug, category.id]));

  await prisma.menuItem.createMany({
    data: defaultMenuItems
      .map((item) => {
        const categoryId = categoryMap.get(item.categorySlug);
        if (!categoryId) {
          return null;
        }

        return {
          name: item.name,
          description: item.description,
          price: item.price,
          image: item.image,
          categoryId,
          available: item.available,
          featured: item.featured,
          tags: item.tags,
        };
      })
      .filter(Boolean),
  });
}

async function seedOrders() {
  const existingCount = await prisma.order.count();
  if (existingCount > 0) {
    return;
  }

  const menuItems = await prisma.menuItem.findMany({
    orderBy: { createdAt: "asc" },
  });

  if (menuItems.length < 2) {
    return;
  }

  const first = menuItems[0];
  const second = menuItems[1];

  const subtotal = first.price * 2 + second.price;
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  await prisma.order.create({
    data: {
      orderNumber: "ORD-SEED-001",
      status: "delivered",
      customerName: "ডেমো কাস্টমার",
      customerPhone: "+8801712345678",
      deliveryAddress: "ধানমন্ডি, ঢাকা",
      subtotal,
      tax,
      total,
      items: {
        create: [
          {
            menuItemId: first.id,
            quantity: 2,
            unitPrice: first.price,
          },
          {
            menuItemId: second.id,
            quantity: 1,
            unitPrice: second.price,
          },
        ],
      },
    },
  });
}

async function main() {
  await seedAdmins();
  await seedCategories();
  await seedMenuItems();
  await seedOrders();

  const adminCount = await prisma.adminUser.count();
  if (adminCount > MAX_ADMIN_USERS) {
    throw new Error(`Admin user count (${adminCount}) exceeds max allowed (${MAX_ADMIN_USERS}).`);
  }

  console.log("Seed completed successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

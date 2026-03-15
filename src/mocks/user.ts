import type { User } from "@/features/auth/types";

export const mockUser: User = {
  id: "1",
  name: "মেহেদী হাসান",
  email: "mehedi@meetpoint.com",
  phone: "+880 1712-345678",
  addresses: [
    { id: "1", label: "বাসা", street: "বাড়ি ২২, রোড ৭", city: "ঢাকা", state: "ধানমন্ডি", zip: "১২০৫", isDefault: true },
    { id: "2", label: "অফিস", street: "বাড়ি ১১, কাওরান বাজার", city: "ঢাকা", state: "তেজগাঁও", zip: "১২১৫", isDefault: false },
  ],
};


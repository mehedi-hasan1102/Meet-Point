import { redirect } from "next/navigation";

import { auth } from "@/auth";
import AdminLoginScreen from "@/features/admin/screens/AdminLoginScreen";

export default async function AdminLoginPage() {
  const session = await auth();

  if (session?.user?.role === "admin") {
    redirect("/admin");
  }

  return <AdminLoginScreen />;
}

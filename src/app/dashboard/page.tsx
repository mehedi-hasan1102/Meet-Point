import { redirect } from "next/navigation";

import { auth } from "@/auth";
import DashboardScreen from "@/features/dashboard/screens/DashboardScreen";

export default async function DashboardPage() {
  const session = await auth();

  if (!session || session.user?.role !== "admin") {
    redirect("/admin/login?callbackUrl=/dashboard");
  }

  return <DashboardScreen />;
}

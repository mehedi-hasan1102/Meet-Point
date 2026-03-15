import { Suspense } from "react";
import MenuScreen from "@/features/menu/screens/MenuScreen";

export default function MenuPage() {
  return (
    <Suspense fallback={null}>
      <MenuScreen />
    </Suspense>
  );
}

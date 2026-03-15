import { Suspense } from "react";
import OrderConfirmationScreen from "@/features/orders/screens/OrderConfirmationScreen";

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={null}>
      <OrderConfirmationScreen />
    </Suspense>
  );
}

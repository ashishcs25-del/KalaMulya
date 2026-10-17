"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OrdersRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Orders page is now placed securely behind the Seller Portal credentials
    router.replace("/seller");
  }, [router]);

  return (
    <div className="py-24 text-center text-xs text-stone-500">
      Redirecting to secure Seller Portal...
    </div>
  );
}

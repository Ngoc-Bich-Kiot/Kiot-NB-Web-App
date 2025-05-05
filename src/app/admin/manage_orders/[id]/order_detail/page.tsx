import LoadingAdminLayout from "@/app/admin/loading";
import DetailOrder from "@/container/order/DetailOrder";
import React from "react";

export default async function DetailOrderPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const id = params.id;
  return (
    <div>
      <React.Suspense fallback={<LoadingAdminLayout />}>
        <DetailOrder orderId={id} />
      </React.Suspense>
    </div>
  );
}

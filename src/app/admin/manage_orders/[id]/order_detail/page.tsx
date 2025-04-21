import DetailOrder from "@/container/order/DetailOrder";

export default async function DetailOrderPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const id = params.id;
  return (
    <div>
      <DetailOrder orderId={id} />
    </div>
  );
}

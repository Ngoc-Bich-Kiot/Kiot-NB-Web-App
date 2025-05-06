import EditProduct from "@/container/product/EditProduct";

export default async function EditProductPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  return <><EditProduct id={id} /></>
} 
import DetailProduct from "@/container/product/DetailProduct";

export default async function DetailProductPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const id = params.id;
    return <><DetailProduct id={id} /></>
} 
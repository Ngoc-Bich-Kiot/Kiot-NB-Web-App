import TableBatchDetail from "@/container/ManageBatch/TableBatchDetail";

export default async function BatchDetailPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const id = params.id;
    return <><TableBatchDetail id={id} /></>
} 
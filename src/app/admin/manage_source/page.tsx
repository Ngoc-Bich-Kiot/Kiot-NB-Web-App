import SourceTable from "@/container/sourceOfProduct/sourceTable";

const ManageSourcePage = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return (
    <div>
      <SourceTable />
    </div>
  );
};

export default ManageSourcePage;

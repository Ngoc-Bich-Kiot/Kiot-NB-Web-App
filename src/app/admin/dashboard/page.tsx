import Dashboard from "@/container/dashboard/Dashboard";
import React from "react";

const DashboardPage = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return (
    <main>
      <Dashboard />
    </main>
  );
};

export default DashboardPage;

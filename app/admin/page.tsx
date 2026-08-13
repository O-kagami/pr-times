import React from "react";
import AdminLayout from "../../components/AdminLayout";
import AdminDashboard from "../../components/AdminDashboard";
import { getAdminDashboardData } from "../../data/adminDashboard";

export const metadata = {
  title: "企業管理ダッシュボード | PR TIMES",
};

type AdminPageProps = {
  searchParams: Promise<{ companyId?: string | string[] }>;
};

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const params = await searchParams;
  const rawCompanyId = Array.isArray(params.companyId)
    ? params.companyId[0]
    : params.companyId;
  const companyId = Number(rawCompanyId ?? 1001);
  const dashboardData = getAdminDashboardData(
    Number.isSafeInteger(companyId) ? companyId : 1001,
  );

  return (
    <AdminLayout>
      <AdminDashboard data={dashboardData} />
    </AdminLayout>
  );
}

import React from "react";
import AdminLayout from "../../components/AdminLayout";
import AdminDashboard from "../../components/AdminDashboard";

export const metadata = {
  title: "Admin - ダッシュボード",
};

export default function AdminPage() {
  return (
    <AdminLayout>
      <AdminDashboard />
    </AdminLayout>
  );
}

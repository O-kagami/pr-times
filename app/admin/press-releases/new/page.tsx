"use client";

import React from "react";
import AdminLayout from "@/components/AdminLayout";
import PRForm from "@/components/admin/PRForm";

export default function NewPressReleasePage() {
  return (
    <AdminLayout>
      <PRForm isNew={true} />
    </AdminLayout>
  );
}


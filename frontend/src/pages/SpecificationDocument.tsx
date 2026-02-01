import React from "react";
import { DraggableTable } from "components/Table";

const SpecificationDocument = () => {
  const mockServerData = {
    documentName: "User_Onboarding_Export_v1",
    columns: [
      {
        id: "col_name",
        header: "User Name",
        width: 180,
        metadata: {
          isPii: true,
          dataType: "string",
          comment: "Full legal name",
        },
      },
      {
        id: "col_email",
        header: "Email Address",
        width: 220,
        metadata: {
          isPii: true,
          dataType: "email",
          comment: "Primary contact",
        },
      },
      {
        id: "col_status",
        header: "Account Status",
        width: 130,
        metadata: {
          isPii: false,
          dataType: "enum",
          comment: "Active/Pending/Banned",
        },
      },
      {
        id: "col_last_login",
        header: "Last Login",
        width: 150,
        metadata: { isPii: false, dataType: "datetime", comment: "UTC format" },
      },
    ],
    rows: [
      {
        col_name: "Alice Johnson",
        col_email: "alice@company.com",
        col_status: "Active",
        col_last_login: "2024-05-12",
      },
      {
        col_name: "Bob Smith",
        col_email: "bob@hr.org",
        col_status: "Pending",
        col_last_login: "2024-05-10",
      },
      {
        col_name: "Charlie Davis",
        col_email: "charlie@tech.io",
        col_status: "Active",
        col_last_login: "2024-05-14",
      },
    ],
  };

  return (
    <div style={{ padding: "40px", fontFamily: "sans-serif" }}>
      <DraggableTable
        rows={mockServerData.rows}
        columns={mockServerData.columns}
      />
    </div>
  );
};

export default SpecificationDocument;

import React, { useState } from "react";
import { DraggableTable, DynamicWidget } from "components/Table";

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
        id: 1,
      },
      {
        col_name: "Bob Smith",
        col_email: "bob@hr.org",
        col_status: "Pending",
        col_last_login: "2024-05-10",
        id: 2,
      },
      {
        col_name: "Charlie Davis",
        col_email: "charlie@tech.io",
        col_status: "Active",
        col_last_login: "2024-05-14",
        id: 3,
      },
    ],
  };

  const [rows, setRows] = useState(mockServerData.rows);
  const [columns, setColumns] = useState(mockServerData.columns);

  // Handlers to modify the local state
  const onAddRow = (index: number) => {
    const newRow = { id: crypto.randomUUID() };
    setRows((old) => {
      const updated = [...old];
      updated.splice(index, 0, newRow);
      return updated;
    });
  };

  const onDeleteRow = (_, index: number) => {
    setRows((old) => {
      const updated = [...old];
      updated.splice(index, 1);
      return updated;
    });
  };

  const onAddColumn = (index: number) => {
    const newRow = { id: crypto.randomUUID(), header: "New Header" };
    setColumns((old) => {
      const updated = [...old];
      updated.splice(index, 0, newRow);
      return updated;
    });
  };

  const onDeleteColumn = (_, index: number) => {
    setColumns((old) => {
      const updated = [...old];
      updated.splice(index, 1);
      return updated;
    });
  };

  const onRenameColumn = (id, index, title) => {
    setColumns((old) => {
      const updated = [...old];
      const updatedCol = { ...updated[index] };
      updatedCol.header = title;

      updated.splice(index, 1, updatedCol);

      return updated;
    });
  };

  const onRenameCell = (_, index, colKey, value) => {
    setRows((old) => {
      const updated = [...old];
      const updatedRow = { ...updated[index] };
      updatedRow[colKey] = value;

      updated.splice(index, 1, updatedRow);

      return updated;
    });
  };

  return (
    <div style={{ padding: "40px", fontFamily: "sans-serif" }}>
      <div>
        <DynamicWidget
          rows={[{ col_name: "a" }]}
          columns={[
            {
              id: "col_name",
              header: "User Name",
            },
          ]}
        />
      </div>
      <DraggableTable
        rows={rows}
        columns={columns}
        onAddRow={onAddRow}
        onDeleteRow={onDeleteRow}
        onRenameCell={onRenameCell}
        onAddColumn={onAddColumn}
        onDeleteColumn={onDeleteColumn}
        onRenameColumn={onRenameColumn}
      />
    </div>
  );
};

export default SpecificationDocument;

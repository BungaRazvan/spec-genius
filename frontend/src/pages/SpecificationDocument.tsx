import React, { useState } from "react";
import { DraggableTable, DynamicWidget } from "@/src/components/table";

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
    <div className="min-h-screen text-slate-300 p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* HEADER SECTION */}
        <header className="flex items-center justify-between border-b border-white/10 pb-6">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              {mockServerData.documentName}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              CSV Format Specification
            </p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-medium transition-all">
              Validate File
            </button>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all shadow-lg shadow-blue-900/20">
              Generate Sample
            </button>
          </div>
        </header>

        {/* METADATA GRID  */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-3">
              File Properties
            </h3>
            <DynamicWidget
              rows={[
                {
                  id: "meta-1",
                  namespace: "User_Onboarding_Export",
                  encoding: "UTF-8",
                  delimiter: "Comma (,)",
                  quoteChar: 'Double Quote (")',
                },
              ]}
              columns={[
                { id: "namespace", header: "Namespace" },
                { id: "encoding", header: "Encoding" },

                { id: "delimiter", header: "Delimiter" },
                { id: "quoteChar", header: "Quote Char" },
              ]}
            />
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
              Field Definitions
            </h3>
            <button
              onClick={() => onAddRow(rows.length)}
              className="text-[10px] font-bold text-blue-400 hover:text-blue-300 uppercase tracking-widest"
            >
              + Add New Field
            </button>
          </div>

          <div className="rounded-2xl border border-white/5 shadow-2xl overflow-hidden">
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
        </section>
      </div>
    </div>
  );
};

export default SpecificationDocument;

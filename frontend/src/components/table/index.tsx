import React, { useState, useMemo, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getExpandedRowModel,
} from "@tanstack/react-table";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  horizontalListSortingStrategy,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { InsertColumnZone } from "./InsertColumnZone";
import { InsertRowZone } from "./InsertRowZone";
import clsx from "clsx";
import { EditableCell } from "./EditableCell";
import { SortableRow } from "./SortableRow";
import { SortableHeader } from "./SortableHeader";

// --- 3. Main Draggable Table ---
export const DraggableTable = (props) => {
  const {
    rows,
    columns,
    onAddRow,
    onDeleteRow,
    onDeleteColumn,
    onAddColumn,
    onRenameColumn,
    onRenameCell,
  } = props;

  const [data, setData] = useState(rows);
  const [columnOrder, setColumnOrder] = useState(columns.map((c) => c.id));

  const [expanded, setExpanded] = useState({});
  // Sync internal state with props if they change externally
  useEffect(() => {
    setColumnOrder(columns.map((c) => c.id));
  }, [columns]);

  useEffect(() => {
    setData(rows);
  }, [rows]);

  const table = useReactTable({
    data,

    columns: useMemo(
      () =>
        columns.map((col) => ({
          accessorKey: col.id,
          header: col.header,
          size: col.width || 150,
          meta: col.metadata,
          cell: (cellProps) => <EditableCell {...cellProps} />,
        })),
      [columns],
    ),
    state: { columnOrder, expanded },
    meta: {
      updateData: onRenameCell,
    },
    columnResizeMode: "onChange",
    onExpandedChange: setExpanded,
    getRowCanExpand: () => true,
    onColumnOrderChange: setColumnOrder,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getRowId: (row) => row.id, // Crucial for matching dnd-kit IDs
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!active || !over || active.id === over.id) return;

    if (columnOrder.includes(active.id)) {
      setColumnOrder((old) =>
        arrayMove(old, old.indexOf(active.id), old.indexOf(over.id)),
      );
    } else {
      setData((old) => {
        const oldIndex = old.findIndex((r) => r.id === active.id);
        const newIndex = old.findIndex((r) => r.id === over.id);
        return arrayMove(old, oldIndex, newIndex);
      });
    }
  };

  // Row IDs extracted from the table's current model
  const rowIds = useMemo(
    () => table.getRowModel().rows.map((r) => r.id),
    [table.getRowModel().rows],
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="rounded-lg border shadow-sm bg-white overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-slate-50 border-b">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                <th className="w-10 bg-slate-100 border-b relative !overflow-visible">
                  <InsertColumnZone onAdd={() => onAddColumn(0)} />
                </th>
                {/* <th className="w-10" /> */}

                <SortableContext
                  items={columnOrder}
                  strategy={horizontalListSortingStrategy}
                >
                  {hg.headers.map((header, index) => (
                    <SortableHeader
                      key={header.id}
                      header={header}
                      index={index}
                      onAddColumn={onAddColumn}
                      onDeleteColumn={onDeleteColumn}
                      onRenameColumn={onRenameColumn}
                    />
                  ))}
                </SortableContext>
              </tr>
            ))}
          </thead>
          <tbody>
            {/* The items array here must exactly match the row.id used in SortableRow */}
            <SortableContext
              items={rowIds}
              strategy={verticalListSortingStrategy}
            >
              {table.getRowModel().rows.map((row, index) => (
                <React.Fragment key={row.id}>
                  {/* Line ABOVE the first row */}
                  {index === 0 && (
                    <InsertRowZone
                      onAdd={() => onAddRow(0)}
                      colSpan={columnOrder.length + 1}
                    />
                  )}
                  <SortableRow
                    key={row.id}
                    row={row}
                    index={index}
                    onDeleteRow={onDeleteRow}
                  />

                  {/* Line BELOW every row */}
                  <InsertRowZone
                    onAdd={() => onAddRow(index + 1)}
                    colSpan={columnOrder.length + 1}
                    className={clsx("pb-3", index == rows.length)}
                  />
                </React.Fragment>
              ))}
            </SortableContext>
          </tbody>
        </table>
      </div>
    </DndContext>
  );
};

export const DynamicWidget = (props) => {
  const { columns, rows } = props;
  const [columnOrder, setColumnOrder] = useState(columns.map((c) => c.id));

  const table = useReactTable({
    data: rows,
    columns: useMemo(
      () =>
        columns.map((col) => ({
          accessorKey: col.id,
          header: col.header,
          cell: (cellProps) => <EditableCell {...cellProps} />,
        })),
      [columns],
    ),
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
  });

  // For the widget, we usually only care about the first data object
  const row = table.getRowModel().rows[0];
  const columnIds = useMemo(() => columns.map((c) => c.id), [columns]);

  if (!row) return null;

  return (
    <DndContext sensors={useSensors(useSensor(PointerSensor))}>
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden max-w-md">
        <table className="w-full text-sm border-collapse">
          <tbody className="divide-y divide-slate-100">
            <SortableContext
              items={columnIds}
              strategy={verticalListSortingStrategy}
            >
              {/* THE FIX: Map over CELLS so each property is a new TR */}
              {row.getVisibleCells().map((cell, index) => (
                <SortableRow
                  key={cell.column.id}
                  row={row}
                  index={index}
                  view="horizontal"
                  cell={cell}
                  onDeleteRow={() => {}}
                />
              ))}
            </SortableContext>
          </tbody>
        </table>
      </div>
    </DndContext>
  );
};

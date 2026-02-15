import React, { useState, useMemo, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
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
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { Trash2, ChevronDown, ChevronRight } from "lucide-react";
import { InsertColumnZone } from "./InsertColumnZone";
import { RowDetailView } from "./RowDetail";
import { InsertRowZone } from "./InsertRowZone";
import clsx from "clsx";
import EditableCell from "./EditableCell";

// --- 1. Sortable Header Component (X-Axis) ---
export const SortableHeader = (props) => {
  const { header, onAddColumn, index, onRenameColumn, onDeleteColumn } = props;
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(header.column.columnDef.header);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: header.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    width: header.getSize(),
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 100 : undefined,
  };

  const handleBlur = () => {
    setIsEditing(false);
    onRenameColumn(header.id, index, title);
  };

  return (
    <th
      ref={setNodeRef}
      style={style}
      className="p-0 bg-slate-100 border-b relative group/header !overflow-visible"
    >
      <div className="relative w-full h-full px-2 py-3 flex items-center justify-around gap-2 !overflow-visible">
        {/* Left: Drag Handle */}
        <span
          {...attributes}
          {...listeners}
          className="cursor-grab text-slate-400 hover:text-slate-600 min-w-[20px]"
        >
          ⠿
        </span>

        <div className="flex justify-center overflow-hidden">
          {isEditing ? (
            <input
              autoFocus
              className="text-sm font-bold bg-white border border-blue-500 px-1 outline-none w-full text-center"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={(e) => e.key === "Enter" && handleBlur()}
            />
          ) : (
            <span
              className="font-bold text-sm truncate cursor-text hover:bg-slate-200 px-2 rounded text-center"
              onClick={() => setIsEditing(true)}
            >
              {title}
            </span>
          )}
        </div>

        <button
          onClick={() => onDeleteColumn(header.id, index)}
          className="opacity-0 group-hover/header:opacity-100 text-slate-400 hover:text-red-500 transition-opacity min-w-[20px]"
        >
          ✕
        </button>
      </div>

      <div
        onMouseDown={header.getResizeHandler()}
        className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-blue-500 z-10"
      />
      <InsertColumnZone onAdd={() => onAddColumn(index + 1)} />
    </th>
  );
};

// --- 2. Sortable Row Component (The Y-Axis) ---
export const SortableRow = (props) => {
  const { row, index, onDeleteRow, view } = props;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: row.id, // This MUST match the id in the SortableContext items array
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: "relative",
    zIndex: isDragging ? 999 : 1,
  };

  return (
    <>
      <tr
        ref={setNodeRef}
        // @ts-ignore
        style={style}
        className={`group hover:bg-slate-50 transition-colors ${row.getIsExpanded() ? "bg-blue-50/30" : ""}`}
      >
        <td className="p-2 text-center border-t border-slate-100 w-10">
          <div className="flex items-center justify-center gap-2">
            <button className="text-slate-300 hover:text-red-500">
              <Trash2 onClick={() => onDeleteRow(row, index)} size={14} />
            </button>
            <span
              {...attributes}
              {...listeners}
              className="cursor-grab hover:text-slate-600"
            >
              ⠿
            </span>
            {row.getCanExpand() && (
              <button
                onClick={row.getToggleExpandedHandler()}
                className="p-1 hover:bg-slate-200 rounded transition-colors"
              >
                {row.getIsExpanded() ? (
                  <ChevronDown size={14} />
                ) : (
                  <ChevronRight size={14} />
                )}
              </button>
            )}
          </div>
        </td>

        {row.getVisibleCells().map((cell) => (
          <React.Fragment key={cell.id}>
            {view == "horizontal" && (
              <td className="px-4 py-3 bg-slate-50/50 w-1/3 font-semibold text-slate-500 border-r uppercase text-[10px] tracking-wider">
                {cell.column.columnDef.header}:
              </td>
            )}
            <td className="p-3 text-sm border-t border-slate-100">
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </td>
          </React.Fragment>
        ))}
      </tr>
      {/* THE NEW SECTION (Expanded Details) */}
      {row.getIsExpanded() && (
        <tr className="bg-slate-50/50">
          <td
            colSpan={row.getVisibleCells().length + 1}
            className="p-0 border-t border-slate-200"
          >
            <RowDetailView row={row} />
          </td>
        </tr>
      )}
    </>
  );
};

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
  const [data, setData] = useState(rows);

  useEffect(() => {
    setColumnOrder(columns.map((c) => c.id));
  }, [columns]);
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

  const table = useReactTable({
    data,
    columns: useMemo(
      () =>
        columns.map((col) => ({
          accessorKey: col.id,
          header: col.header,
          cell: (cellProps) => <EditableCell {...cellProps} />,
        })),
      [columns],
    ),
    state: { columnOrder },
    getCoreRowModel: getCoreRowModel(),
    onColumnOrderChange: setColumnOrder,
    columnResizeMode: "onChange",
  });

  const columnIds = useMemo(() => columns.map((c) => c.id), [columns]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="rounded-xl border border-slate-200 shadow-sm bg-white overflow-hidden max-w-md">
        <table className="w-full text-sm">
          <tbody className="divide-y divide-slate-100">
            <SortableContext
              items={columnIds}
              strategy={horizontalListSortingStrategy}
            >
              {table.getRowModel().rows.map((row, index) => (
                <React.Fragment key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <React.Fragment key={cell.id}>
                      <SortableRow
                        key={row.id}
                        row={row}
                        index={index}
                        view="horizontal"
                        onDeleteRow={() => {}}
                      />

                      <InsertRowZone
                        // onAdd={() => onAddRow(0)}
                        colSpan={columnOrder.length + 2}
                        className={clsx("pb-3", index == rows.length)}
                      />
                    </React.Fragment>
                  ))}
                </React.Fragment>
              ))}
            </SortableContext>
          </tbody>
        </table>
      </div>
    </DndContext>
  );
};

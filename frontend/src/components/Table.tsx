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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Settings2,
  Trash2,
  Database,
  MessageCircle,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export const InsertColumnZone = (props) => {
  const { onAdd, label = "+" } = props;

  return (
    // pointer-events-none makes the 6px area "invisible" to the mouse for resizing
    <div className="absolute right-[-3px] top-0 h-full w-[6px] z-[50] group/insertv pointer-events-none">
      <div className="absolute inset-y-0 left-1/2 w-[2px] bg-blue-500 opacity-0 group-hover/insertv:opacity-100 transition-opacity duration-200" />
      <button
        onClick={(e) => {
          e.stopPropagation();
          onAdd();
        }}
        // pointer-events-auto makes just the button clickable
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover/insertv:opacity-100 bg-blue-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shadow-lg hover:scale-110 transition-all z-[110] pointer-events-auto"
      >
        {label}
      </button>
    </div>
  );
};

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

export const InsertRowZone = (props) => {
  const { onAdd, colSpan, label = "New Row" } = props;

  return (
    <tr className="group/insert relative">
      {/* Ensure colSpan is total columns + 1 */}
      <td colSpan={colSpan} className="p-0 border-none h-1 relative">
        <div className="absolute inset-x-0 top-[-4px] h-2 flex items-center justify-center opacity-0 group-hover/insert:opacity-100 transition-opacity z-20">
          {/* This line will now span the entire width of the <td> which spans the whole <tr> */}
          <div className="absolute inset-x-0 h-[2px] bg-blue-500" />

          <button
            onClick={onAdd}
            className="relative bg-blue-500 text-white px-3 py-0.5 rounded-full text-[10px] font-bold uppercase shadow-md hover:scale-105 transition-transform"
          >
            {label}
          </button>
        </div>
      </td>
    </tr>
  );
};

// --- 2. Sortable Row Component (The Y-Axis) ---
export const SortableRow = (props) => {
  const { row, index, onDeleteRow } = props;

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
            <button
              // onClick={() => onDeleteRow(row.id)}
              className="text-slate-300 hover:text-red-500"
            >
              <Trash2 onClick={() => onDeleteRow(row, index)} size={14} />
            </button>
            <span
              {...attributes}
              {...listeners}
              className="cursor-grab hover:text-slate-600"
            >
              ⠿
            </span>
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
          </div>
        </td>

        {row.getVisibleCells().map((cell) => (
          <td key={cell.id} className="p-3 text-sm border-t border-slate-100">
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </td>
        ))}
      </tr>

      {/* THE NEW SECTION (Expanded Details) */}
      {row.getIsExpanded() && (
        <tr className="bg-slate-50/50">
          <td
            colSpan={row.getVisibleCells().length + 1}
            className="p-0 border-t border-slate-200"
          >
            <div className="mx-8 my-4 bg-white border rounded-xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200">
              <Tabs defaultValue="notes" className="w-full">
                <div className="flex items-center justify-between px-4 py-1 border-b bg-slate-50/50">
                  <TabsList className="bg-transparent gap-4">
                    <TabsTrigger
                      value="notes"
                      className="data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 rounded-none px-0 text-xs font-semibold"
                    >
                      <MessageCircle size={14} className="mr-2" /> Discussion
                    </TabsTrigger>
                    <TabsTrigger
                      value="specs"
                      className="data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 rounded-none px-0 text-xs font-semibold"
                    >
                      <Database size={14} className="mr-2" /> Developer Specs
                    </TabsTrigger>
                  </TabsList>
                  <Badge
                    variant="secondary"
                    className="text-[10px] font-mono opacity-60"
                  >
                    Row Object ID: {row.original.id}
                  </Badge>
                </div>

                {/* USE CASE 1: Client/User Notes */}
                <TabsContent value="notes" className="p-4 m-0 space-y-4">
                  <div className="flex gap-3">
                    <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                      C
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="text-[11px] font-bold text-slate-500 uppercase">
                        Client Inquiry
                      </div>
                      <div className="p-3 rounded-lg bg-slate-50 border text-sm text-slate-700 italic">
                        "Can we change the status labels to match our internal
                        CRM?"
                      </div>
                    </div>
                  </div>
                  <div className="pl-11">
                    <textarea
                      className="w-full p-3 text-sm border rounded-lg focus:ring-2 focus:ring-blue-50 outline-none min-h-[80px]"
                      placeholder="Write a response or internal note..."
                    />
                  </div>
                </TabsContent>

                {/* USE CASE 2: Technical/Developer Info */}
                <TabsContent value="specs" className="p-0 m-0">
                  <div className="grid grid-cols-3 divide-x text-[11px] font-mono">
                    <div className="p-4 bg-slate-900 text-slate-400">
                      <div className="text-white mb-2 underline">
                        DB Mapping
                      </div>
                      <div>
                        Table:{" "}
                        <span className="text-green-400">users_registry</span>
                      </div>
                      <div>
                        Engine: <span className="text-green-400">InnoDB</span>
                      </div>
                    </div>
                    <div className="p-4 bg-slate-900 text-slate-400">
                      <div className="text-white mb-2 underline">
                        Validation
                      </div>
                      <div>
                        col_email:{" "}
                        <span className="text-yellow-400">
                          regex(/@company\.com$/)
                        </span>
                      </div>
                    </div>
                    <div className="p-4 bg-slate-900 text-slate-400">
                      <div className="text-white mb-2 underline">Last Sync</div>
                      <div className="text-blue-400">2026-02-09 18:15 UTC</div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
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

  const defaultColumn = {
    cell: (cellProps) => {
      const { getValue, row, column, table } = cellProps;
      const initialValue = getValue();
      // We need to keep and update the state of the cell normally
      const [value, setValue] = useState(initialValue);

      // When the input is blurred, we'll call our table meta's updateData function
      const onBlur = () => {
        table.options.meta?.updateData(row, row.index, column.id, value);
      };

      // If the initialValue is changed external, sync it up with our state
      useEffect(() => {
        setValue(initialValue);
      }, [initialValue]);

      return (
        <div className="group relative flex items-center justify-between h-full px-2 py-1">
          <div></div>
          <input
            className="w-full bg-transparent outline-none focus:bg-blue-50 rounded px-1 text-center"
            value={value as string}
            onChange={(e) => setValue(e.target.value)}
            onBlur={onBlur}
          />

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="h-6 w-6 p-0">
                <Settings2 size={12} />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              side="right"
              align="start"
              sideOffset={10}
              className="w-60 shadow-xl border-slate-200 p-4 bg-white"
            >
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-sm">Cell Properties</h4>
                  <p className="text-[11px] text-muted-foreground">
                    Apply custom data constraints.
                  </p>
                </div>
                <hr />
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="pii" />
                    <label htmlFor="pii" className="text-xs font-medium">
                      Contains PII
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="e2e" />
                    <label htmlFor="e2e" className="text-xs font-medium">
                      End-to-end Encryption
                    </label>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      );
    },
  };

  const table = useReactTable({
    data,
    defaultColumn,
    columns: useMemo(
      () =>
        columns.map((col) => ({
          accessorKey: col.id,
          header: col.header,
          size: col.width || 150,
          meta: col.metadata,
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
  const { config, onCellChange, columns, rows } = props;
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

  const defaultColumn = {
    cell: (cellProps) => {
      const { getValue, row, column, table } = cellProps;
      const initialValue = getValue();
      // We need to keep and update the state of the cell normally
      const [value, setValue] = useState(initialValue);

      // When the input is blurred, we'll call our table meta's updateData function
      const onBlur = () => {
        table.options.meta?.updateData(row, row.index, column.id, value);
      };

      // If the initialValue is changed external, sync it up with our state
      useEffect(() => {
        setValue(initialValue);
      }, [initialValue]);

      return (
        <div className="group relative flex items-center justify-between h-full px-2 py-1">
          <div></div>
          <input
            className="w-full bg-transparent outline-none focus:bg-blue-50 rounded px-1 text-center"
            value={value as string}
            onChange={(e) => setValue(e.target.value)}
            onBlur={onBlur}
          />
        </div>
      );
    },
  };

  const table = useReactTable({
    data,
    defaultColumn,
    columns: useMemo(
      () =>
        columns.map((col) => ({
          accessorKey: col.id,
          header: col.header,
          size: col.width || 150,
          meta: col.metadata,
        })),
      [columns],
    ),
    state: { columnOrder },
    getCoreRowModel: getCoreRowModel(),
    onColumnOrderChange: setColumnOrder,
    columnResizeMode: "onChange",
  });

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
      <div className="rounded-xl border border-slate-200 shadow-sm bg-white overflow-hidden max-w-md">
        <table className="w-full text-sm">
          <tbody className="divide-y divide-slate-100">
            <SortableContext
              items={columnOrder}
              strategy={horizontalListSortingStrategy}
            >
              {table.getRowModel().rows.map((row, index) => (
                <React.Fragment key={row.id}>
                  {/* Line ABOVE the first row */}
                  {index === 0 && (
                    <InsertRowZone
                      // onAdd={() => onAddRow(0)}
                      colSpan={columnOrder.length + 1}
                    />
                  )}
                  {row.getVisibleCells().map((cell) => (
                    <React.Fragment key={cell.id}>
                      <tr className="group">
                        {/* Column 1: The Label (taken from the column header definition) */}
                        <td className="px-4 py-3 bg-slate-50/50 w-1/3 font-semibold text-slate-500 border-r uppercase text-[10px] tracking-wider">
                          {cell.column.columnDef.header}:
                        </td>

                        {/* Column 2: The actual editable data */}
                        <td className="px-4 py-3 w-2/3">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </td>
                      </tr>

                      <InsertRowZone
                        // onAdd={() => onAddRow(0)}
                        colSpan={columnOrder.length + 1}
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

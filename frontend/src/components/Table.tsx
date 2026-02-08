import React, { useState, useMemo, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { MessageSquare, Settings2, Trash2, Send } from "lucide-react";

// --- 1. Sortable Header Component (X-Axis) ---

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
    onRenameColumn(header.id, title);
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
          onClick={() => onDeleteColumn(header.id)}
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
  const { row, onOpenComments } = props;

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
    <tr
      ref={setNodeRef}
      style={style}
      className="bg-white border-b hover:bg-slate-50"
    >
      {/* Row Controls Cell */}
      <td className="p-3 whitespace-nowrap text-slate-400 select-none w-10 text-center border-r bg-slate-50/50">
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-slate-400 hover:text-blue-600"
            onClick={() => onOpenComments(row.original)}
          >
            <MessageSquare size={14} />
          </Button>

          <button
            // onClick={() => onDeleteRow(row.id)}
            className="text-slate-300 hover:text-red-500"
          >
            <Trash2 size={14} />
          </button>
          <span
            {...attributes}
            {...listeners}
            className="cursor-grab hover:text-slate-600"
          >
            ⠿
          </span>
        </div>
      </td>

      {row.getVisibleCells().map((cell) => (
        <td
          key={cell.id}
          // ADDED: text-center to align with the centered header text
          className="p-3 text-sm text-center"
          style={{ width: cell.column.getSize() }}
        >
          {/* If the defaultColumn input is used, ensure that is also centered */}
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
      ))}
    </tr>
  );
};

// --- 3. Main Draggable Table ---
export const DraggableTable = (props) => {
  const { rows, columns } = props;

  const [data, setData] = useState(rows);
  const [columnOrder, setColumnOrder] = useState(columns.map((c) => c.id));
  // Sheet State
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [activeRowForComments, setActiveRowForComments] = useState(null);

  const handleOpenComments = (rowOriginal) => {
    setActiveRowForComments(rowOriginal);
    setIsSheetOpen(true);
  };

  // Sync internal state with props if they change externally
  useEffect(() => {
    setData(rows);
    setColumnOrder(columns.map((c) => c.id));
  }, [columns]);

  const defaultColumn = {
    cell: (cellProps) => {
      const { getValue, row, column, table } = cellProps;
      const initialValue = getValue();
      // We need to keep and update the state of the cell normally
      const [value, setValue] = useState(initialValue);

      // When the input is blurred, we'll call our table meta's updateData function
      const onBlur = () => {
        table.options.meta?.updateData(row.index, column.id, value);
      };

      // If the initialValue is changed external, sync it up with our state
      useEffect(() => {
        setValue(initialValue);
      }, [initialValue]);

      return (
        <div className="group/cell relative flex items-center h-10 px-2">
          <input
            className="w-full bg-transparent outline-none text-center focus:ring-1 focus:ring-blue-200 rounded"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={() =>
              table.options.meta?.updateData(row.index, column.id, value)
            }
          />

          <div className="absolute right-1 opacity-0 group-hover/cell:opacity-100 transition-opacity">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-6 w-6 p-0 hover:bg-slate-200"
                >
                  <Settings2 size={12} />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-4" align="end">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h4 className="font-semibold text-sm leading-none">
                      Cell Properties
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Apply custom data constraints.
                    </p>
                  </div>
                  <div className="grid gap-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="pii" />
                      <label htmlFor="pii" className="text-sm font-medium">
                        Contains PII
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="encrypt" />
                      <label htmlFor="encrypt" className="text-sm font-medium">
                        End-to-end Encryption
                      </label>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      );
    },
  };

  const table = useReactTable({
    data,
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
    columnResizeMode: "onChange",
    onColumnOrderChange: setColumnOrder,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id, // Crucial for matching dnd-kit IDs
    defaultColumn,
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

  // Handlers to modify the local state
  const onAddRow = (index: number) => {
    const newRow = { id: crypto.randomUUID(), name: "New Row" };
    setData((old) => {
      const updated = [...old];
      updated.splice(index, 0, newRow);
      return updated;
    });
  };

  const onAddColumn = (index: number) => {
    const newColId = `col-${crypto.randomUUID().slice(0, 4)}`;
    // Note: In a real app, you'd update the 'columns' prop in the parent
    setColumnOrder((old) => {
      const updated = [...old];
      updated.splice(index, 0, newColId);
      return updated;
    });
  };

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
                    onOpenComments={handleOpenComments}
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

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-[400px] sm:w-[450px] flex flex-col p-0">
          <SheetHeader className="p-6 border-b bg-slate-50/50">
            <SheetTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-500" />
              Row Activity
            </SheetTitle>
            <SheetDescription>
              Viewing comments and audit logs for row:{" "}
              <span className="font-mono text-blue-600"></span>
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Mock Comment Thread */}
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center text-xs font-bold">
                  JD
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold">Jane Doe</span>
                    <span className="text-[10px] text-slate-400">12:45 PM</span>
                  </div>
                  <div className="p-3 rounded-2xl rounded-tl-none bg-slate-100 text-sm text-slate-700">
                    Should we mark the 'Email' column as PII for this row?
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 border-t bg-white">
            <div className="relative">
              <textarea
                placeholder="Write a reply..."
                className="w-full min-h-[100px] p-3 text-sm border rounded-lg focus:ring-2 focus:ring-blue-100 outline-none resize-none pr-12"
              />
              <Button
                size="icon"
                className="absolute bottom-3 right-3 h-8 w-8 bg-blue-600"
              >
                <Send size={14} />
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </DndContext>
  );
};

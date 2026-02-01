import { useState, useMemo, useEffect } from "react";
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

// --- 1. Sortable Header Component (X-Axis) ---
export const SortableHeader = (props) => {
  const { header } = props;
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: header.id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    width: header.getSize(),
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 100 : 1,
  };

  return (
    <th
      ref={setNodeRef}
      style={style}
      className="relative bg-slate-100 border-b p-3 text-left"
    >
      <div className="flex items-center gap-2">
        <span
          {...attributes}
          {...listeners}
          className="cursor-grab text-slate-400"
        >
          ⠿
        </span>
        <div className="flex flex-col">
          <span className="font-bold text-sm">
            {flexRender(header.column.columnDef.header, header.getContext())}
          </span>
          {header.column.columnDef.meta?.isPii && (
            <span className="text-[10px] text-red-600">PII</span>
          )}
        </div>
      </div>
      <div
        onMouseDown={header.getResizeHandler()}
        className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-blue-500"
      />
    </th>
  );
};

// --- 2. Sortable Row Component (The Y-Axis) ---
export const SortableRow = (props) => {
  const { row } = props;

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
      {/* Drag Handle: Listeners must be attached here */}
      <td
        {...attributes}
        {...listeners}
        className="p-3 cursor-grab text-slate-400 select-none w-10 text-center"
      >
        ⠿
      </td>
      {row.getVisibleCells().map((cell) => (
        <td
          key={cell.id}
          className="p-3 text-sm"
          style={{ width: cell.column.getSize() }}
        >
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

  // Sync internal state with props if they change externally
  useEffect(() => {
    setData(rows);
    setColumnOrder(columns.map((c) => c.id));
  }, [columns]);

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
    onColumnOrderChange: setColumnOrder,
    getCoreRowModel: getCoreRowModel(),
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
                <th className="w-10" />
                <SortableContext
                  items={columnOrder}
                  strategy={horizontalListSortingStrategy}
                >
                  {hg.headers.map((header) => (
                    <SortableHeader key={header.id} header={header} />
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
              {table.getRowModel().rows.map((row) => (
                <SortableRow key={row.id} row={row} />
              ))}
            </SortableContext>
          </tbody>
        </table>
      </div>
    </DndContext>
  );
};

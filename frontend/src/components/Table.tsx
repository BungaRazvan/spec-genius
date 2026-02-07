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

// --- 1. Sortable Header Component (X-Axis) ---

export const InsertColumnZone = (props) => {
  const { onAdd, label = "+" } = props;

  return (
    <div className="absolute right-[-2px] top-0 h-full w-[6px] z-[100] group/insertv">
      {/* The Vertical Line */}
      <div className="absolute inset-y-0 left-1/2 w-[2px] bg-blue-500 opacity-0 group-hover/insertv:opacity-100 transition-opacity duration-200" />

      {/* The Plus Button */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // Prevent triggering drag/sort logic
          onAdd();
        }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover/insertv:opacity-100 bg-blue-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shadow-lg hover:scale-110 transition-all z-[110]"
        title="Add Column"
      >
        {label}
      </button>
    </div>
  );
};

export const SortableHeader = (props) => {
  const { header, onAddColumn, index } = props;
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
    zIndex: isDragging ? 100 : null,
  };

  return (
    <th
      ref={setNodeRef}
      style={style}
      className="p-0 bg-slate-100 border-b relative group/header !overflow-visible"
    >
      <div className="relative w-full h-full p-3 flex items-center gap-2 !overflow-visible">
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
        </div>
      </div>
      {/* Resize Handle */}
      <div
        onMouseDown={header.getResizeHandler()}
        className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-blue-500"
      />
      {/* 2. Insert Zone: Positioned to the right, but z-index higher than resize handle */}
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

  const defaultColumn: Partial<ColumnDef<Person>> = {
    cell: ({ getValue, row: { index }, column: { id }, table }) => {
      const initialValue = getValue();
      // We need to keep and update the state of the cell normally
      const [value, setValue] = useState(initialValue);

      // When the input is blurred, we'll call our table meta's updateData function
      const onBlur = () => {
        table.options.meta?.updateData(index, id, value);
      };

      // If the initialValue is changed external, sync it up with our state
      useEffect(() => {
        setValue(initialValue);
      }, [initialValue]);

      return (
        <input
          value={value as string}
          onChange={(e) => setValue(e.target.value)}
          onBlur={onBlur}
        />
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
                  <SortableRow key={row.id} row={row} />

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

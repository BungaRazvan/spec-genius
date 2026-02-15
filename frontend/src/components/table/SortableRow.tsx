import React, { useState, useMemo, useEffect } from "react";
import { flexRender } from "@tanstack/react-table";
import { RowDetailView } from "./RowDetail";
import { Trash2, ChevronDown, ChevronRight } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export const SortableRow = (props) => {
  const { row, index, onDeleteRow, view, cell } = props;

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
        {view === "horizontal" ? (
          // HORIZONTAL VIEW: Render Label + Value for the ONE specific cell
          <>
            <td className="px-4 py-3 bg-slate-50/50 w-1/3 font-semibold text-slate-500 border-r uppercase text-[10px] tracking-wider whitespace-nowrap">
              {cell.column.columnDef.header}:
            </td>
            <td className="p-3 text-sm border-t border-slate-100">
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </td>
          </>
        ) : (
          // STANDARD VIEW: Map all cells across
          row.getVisibleCells().map((cell) => (
            <td key={cell.id} className="p-3 text-sm border-t border-slate-100">
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </td>
          ))
        )}
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

import { useState } from "react";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { InsertColumnZone } from "./InsertColumnZone";

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

import React, { useEffect, useState } from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import { Settings2 } from "lucide-react";

export const EditableCell = (props) => {
  const { getValue, row, column, table } = props;
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);

  const onBlur = () => {
    table.options.meta?.updateData(row, row.index, column.id, value);
  };

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <div className="group relative flex items-center justify-between h-full px-2 py-1">
      <input
        className="w-full bg-transparent outline-none focus:bg-blue-50/50 rounded px-1 text-center"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={onBlur}
      />

      <Popover>
        {/* Pointer events on the trigger must be stopped to avoid dragging the row */}
        <PopoverTrigger asChild onClick={(e) => e.stopPropagation()}>
          <Button
            variant="ghost"
            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Settings2 size={12} />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          side="right"
          align="start"
          sideOffset={10}
          className="w-60 shadow-xl border-slate-200 p-4 bg-white z-[100]"
          /* Prevents the drag-and-drop sensor from firing while you interact with the popover */
          onPointerDown={(e) => e.stopPropagation()}
        >
          <div className="space-y-3">
            <div>
              <h4 className="font-semibold text-sm">Cell Properties</h4>
              <p className="text-[11px] text-muted-foreground">
                Apply custom data constraints.
              </p>
            </div>
            <hr className="border-slate-100" />
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                {/* Unique IDs using row and column prevents clicking one label toggling another cell */}
                <Checkbox id={`pii-${row.id}-${column.id}`} />
                <label
                  htmlFor={`pii-${row.id}-${column.id}`}
                  className="text-xs font-medium"
                >
                  Contains PII
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id={`e2e-${row.id}-${column.id}`} />
                <label
                  htmlFor={`e2e-${row.id}-${column.id}`}
                  className="text-xs font-medium"
                >
                  End-to-end Encryption
                </label>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

import React, { useEffect, useState } from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import { Settings2 } from "lucide-react";

const EditableCell = (props) => {
  const { getValue, row, column, table } = props;
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
};

export default EditableCell;

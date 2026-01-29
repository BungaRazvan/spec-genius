import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  horizontalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// 1. Create the Sortable Header Component
const SortableHeader = ({ header }) => {
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
    opacity: isDragging ? 0.5 : 1,
    cursor: "grab",
  };

  return (
    <th ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {header.isPlaceholder
        ? null
        : flexRender(header.column.columnDef.header, header.getContext())}

      {/* Resizer Handle (separate from drag handle) */}
      <div onMouseDown={header.getResizeHandler()} className="resizer" />
    </th>
  );
};

// 2. The Main Table Component
export function DraggableTable({ serverData }) {
  const [columnOrder, setColumnOrder] = useState(
    serverData.columns.map((c) => c.id),
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor),
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setColumnOrder((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              <SortableContext
                items={columnOrder}
                strategy={horizontalListSortingStrategy}
              >
                {headerGroup.headers.map((header) => (
                  <SortableHeader key={header.id} header={header} />
                ))}
              </SortableContext>
            </tr>
          ))}
        </thead>
        {/* Render Body as usual */}
      </table>
    </DndContext>
  );
}

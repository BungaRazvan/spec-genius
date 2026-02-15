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

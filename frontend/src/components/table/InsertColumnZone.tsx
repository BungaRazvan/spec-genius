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

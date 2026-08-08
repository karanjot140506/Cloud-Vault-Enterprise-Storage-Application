import { LayoutGrid, List } from "lucide-react";

const ViewToggle = ({ view, setView }) => {
  return (
    <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
      <button
        onClick={() => setView("grid")}
        className={`p-1.5 rounded-md transition ${
          view === "grid" ? "bg-white shadow-sm text-blue-600" : "text-gray-400"
        }`}
      >
        <LayoutGrid size={16} />
      </button>
      <button
        onClick={() => setView("table")}
        className={`p-1.5 rounded-md transition ${
          view === "table" ? "bg-white shadow-sm text-blue-600" : "text-gray-400"
        }`}
      >
        <List size={16} />
      </button>
    </div>
  );
};

export default ViewToggle;
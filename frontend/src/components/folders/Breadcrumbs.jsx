import { ChevronRight, Home } from "lucide-react";

const Breadcrumbs = ({ path, onNavigate }) => {
  return (
    <nav className="flex items-center gap-1 text-sm mb-4">
      {path.map((crumb, index) => {
        const isLast = index === path.length - 1;
        return (
          <div key={crumb.id ?? "root"} className="flex items-center gap-1">
            <button
              onClick={() => !isLast && onNavigate(index)}
              disabled={isLast}
              className={`flex items-center gap-1 px-2 py-1 rounded-md transition ${
                isLast
                  ? "text-gray-800 font-medium cursor-default"
                  : "text-gray-500 hover:bg-gray-100 hover:text-blue-600"
              }`}
            >
              {index === 0 && <Home size={14} />}
              {crumb.name}
            </button>
            {!isLast && <ChevronRight size={14} className="text-gray-300" />}
          </div>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;
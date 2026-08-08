const EmptyState = ({ icon: Icon, title, description, action }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
      {Icon && <Icon size={32} className="mx-auto mb-3 text-gray-300" />}
      <p className="text-sm font-medium text-gray-600">{title}</p>
      {description && <p className="text-xs text-gray-400 mt-1">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};

export default EmptyState;
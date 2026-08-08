const Spinner = ({ size = 24, className = "" }) => {
  return (
    <div
      className={`animate-spin rounded-full border-2 border-gray-200 border-t-blue-600 ${className}`}
      style={{ width: size, height: size }}
    />
  );
};

export default Spinner;
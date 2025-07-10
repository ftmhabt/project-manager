interface ActionButtonProps {
  id: string;
  label?: string;
  loading: boolean;
  onClick: () => void;
}

export default function ActionButton({
  id,
  label,
  loading,
  onClick,
}: ActionButtonProps) {
  return loading ? (
    <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
  ) : (
    <button
      id={id}
      onClick={onClick}
      className="text-sm px-3 py-1 rounded-md border transition-colors bg-green-100 text-green-700 border-green-300 hover:bg-green-200"
    >
      {label}
    </button>
  );
}

interface StatusToggleProps {
  id: string;
  label?: string;
  checked: boolean;
  loading?: boolean;
  onChange: () => void;
  trueLabel?: string;
  falseLabel?: string;
}

export default function StatusToggle({
  id,
  label,
  checked,
  loading = false,
  onChange,
  trueLabel = "Checked",
  falseLabel = "Unchecked",
}: StatusToggleProps) {
  return (
    <div className="flex items-center gap-3">
      {label && <span className="text-sm">{label}</span>}

      {loading ? (
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
      ) : (
        <button
          id={id}
          onClick={onChange}
          className={`text-sm px-3 py-1 rounded-md border transition-colors ${
            checked
              ? "bg-green-100 text-green-700 border-green-300 hover:bg-green-200"
              : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
          }`}
        >
          {checked ? trueLabel : falseLabel}
        </button>
      )}
    </div>
  );
}

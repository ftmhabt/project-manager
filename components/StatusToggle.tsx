interface StatusToggleProps {
  id: string;
  label?: string;
  checked: boolean;
  textColor?: string;
  loading?: boolean;
  onChange: () => void;
  trueLabel?: string;
  falseLabel?: string;
}

export default function StatusToggle({
  id,
  checked,
  textColor = "text-red-700",
  loading = false,
  onChange,
  trueLabel = "Checked",
  falseLabel = "Check",
}: StatusToggleProps) {
  return (
    <div className="flex items-center justify-center text-sm px-3 py-1 min-w-[72px]">
      {loading ? (
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-purple-400 border-t-transparent" />
      ) : (
        <button
          id={id}
          onClick={onChange}
          className={`transition-colors  ${textColor} hover:opacity-80`}
        >
          {checked ? trueLabel : falseLabel}
        </button>
      )}
    </div>
  );
}

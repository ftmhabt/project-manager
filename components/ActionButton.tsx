interface ActionButtonProps {
  id: string;
  label?: string;
  textColor?: string;
  loaderColor?: string;
  loading: boolean;
  onClick?: () => void;
}

export default function ActionButton({
  id,
  label,
  textColor = "text-red-700",
  loaderColor = "border-gray-400",
  loading,
  onClick,
}: ActionButtonProps) {
  return (
    <div className="flex items-center justify-center text-sm px-3 py-1 min-w-[72px]">
      {loading ? (
        <div
          className={`h-4 w-4 animate-spin rounded-full border-2 ${loaderColor} border-t-transparent`}
        />
      ) : (
        <button
          id={id}
          onClick={onClick}
          className={`transition-colors ${textColor} hover:opacity-80`}
        >
          {label}
        </button>
      )}
    </div>
  );
}

import clsx from "clsx";
import ActionButton from "components/ActionButton";
import GlassPane from "components/GlassPane";

interface Props {
  className?: string;
  showCompleted: boolean;
  onToggle: () => void;
}

export default function ToggleCompletedButton({
  className = "",
  showCompleted,
  onToggle,
}: Props) {
  return (
    <GlassPane
      className={clsx(
        "rounded-3xl flex justify-center items-center border-violet-500 border-2 w-full",
        className
      )}
    >
      <ActionButton
        id="toggle"
        label={
          showCompleted ? "Do not show completed tasks" : "Show completed tasks"
        }
        onClick={onToggle}
        loading={false}
        textColor="text-violet-500 text-sm font-bold"
      />
    </GlassPane>
  );
}

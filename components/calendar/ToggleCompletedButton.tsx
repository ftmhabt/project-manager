import ActionButton from "../ActionButton";
import GlassPane from "../GlassPane";

interface Props {
  showCompleted: boolean;
  onToggle: () => void;
}

export default function ToggleCompletedButton({
  showCompleted,
  onToggle,
}: Props) {
  return (
    <GlassPane className="rounded-3xl flex justify-center items-center bg-violet-500  border-transparent hover:bg-violet-600 w-full">
      <ActionButton
        id="toggle"
        label={
          showCompleted ? "Do not show completed tasks" : "Show completed tasks"
        }
        onClick={onToggle}
        loading={false}
        textColor="text-white"
      />
    </GlassPane>
  );
}

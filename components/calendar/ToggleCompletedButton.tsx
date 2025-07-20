import ActionButton from "../ActionButton";

interface Props {
  showCompleted: boolean;
  onToggle: () => void;
}

export default function ToggleCompletedButton({
  showCompleted,
  onToggle,
}: Props) {
  return (
    <ActionButton
      id="toggle"
      label={
        showCompleted ? "Do not show completed tasks" : "Show completed tasks"
      }
      onClick={onToggle}
      loading={false}
    />
  );
}

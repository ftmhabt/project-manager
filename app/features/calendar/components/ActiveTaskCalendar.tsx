"use client";

import { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { format } from "date-fns";
import { useOccupiedDates } from "@/hooks/useOccupiedDates";
import { useActiveItems } from "@/hooks/useActiveItems";
import { useVisibleItems } from "@/hooks/useVisibleItems";
import Card from "../../../../components/Card";
import TaskList from "./TaskList";
import styles from "@/styles/ActiveItemCalendar.module.scss";
import Agenda from "./Agenda";
import { TasksWithProject } from "@/app/features/tasks/actions/getUserTasks";
import Button from "../../../../components/Button";
import TaskModal from "../../tasks/components/TaskModal";
import ToggleCompletedButton from "./ToggleCompletedButton";

export default function ActiveItemCalendar({
  tasks,
}: {
  tasks: TasksWithProject;
}) {
  const [selectedDay, setSelectedDay] = useState<Date>(new Date());
  const [showCompleted, setShowCompleted] = useState(true);

  const occupiedDates = useOccupiedDates(tasks, showCompleted);
  const activeItems = useActiveItems(tasks, selectedDay);
  const visibleItems = useVisibleItems(activeItems, showCompleted);

  return (
    <div className="sm:flex sm:flex-row flex flex-col gap-3 sm:gap-6 w-full h-full pr-3 overflow-auto">
      <Card className="p-2 sm:px-8 sm:py-4 flex flex-col gap-2 sm:gap-3 h-full flex-1">
        <DayPicker
          mode="single"
          selected={selectedDay}
          onSelect={setSelectedDay}
          modifiers={{ occupied: occupiedDates }}
          modifiersClassNames={{ occupied: styles.occupiedDay }}
          navLayout="around"
          showOutsideDays
          className="w-full min-h-fit text-black"
          required={true}
        />
        <div className="grid grid-cols-1 gap-2 sm:gap-3 xlg:flex">
          <TaskModal selectedDay={selectedDay} triggerClassName="w-full" />
          <Button
            intent="secondary"
            onClick={() => setSelectedDay(new Date())}
            className="px-3 py-1 rounded-3xl transition border-violet-500 border-2 text-violet-500 text-sm"
          >
            Today
          </Button>
          <ToggleCompletedButton
            className="py-1 col-span-2 flex-1"
            showCompleted={showCompleted}
            onToggle={() => setShowCompleted((prev) => !prev)}
          />
        </div>
        <div className="flex-1 overflow-hidden">
          <Agenda tasks={visibleItems} selectedDate={selectedDay} />
        </div>
      </Card>
      <Card className="w-full h-full flex-1">
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-black">
            {selectedDay
              ? `Tasks active on ${format(selectedDay, "PPP")}`
              : "Select a day to see active tasks"}
          </h2>
          <TaskList tasks={visibleItems} selectedDay={selectedDay} />
        </div>
      </Card>
    </div>
  );
}

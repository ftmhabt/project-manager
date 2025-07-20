"use client";

import { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { format } from "date-fns";
import { Task } from "@/app/generated/prisma";

import { useOccupiedDates } from "@/hooks/useOccupiedDates";
import { useActiveItems } from "@/hooks/useActiveItems";
import { useVisibleItems } from "@/hooks/useVisibleItems";

import Card from "../Card";
import TaskList from "./TaskList";
import ToggleCompletedButton from "./ToggleCompletedButton";
import styles from "@/styles/ActiveItemCalendar.module.scss";

export default function ActiveItemCalendar({ tasks }: { tasks: Task[] }) {
  const [selectedDay, setSelectedDay] = useState<Date>(new Date());
  const [showCompleted, setShowCompleted] = useState(true);

  const occupiedDates = useOccupiedDates(tasks, showCompleted);
  const activeItems = useActiveItems(tasks, selectedDay);
  const visibleItems = useVisibleItems(activeItems, showCompleted);

  return (
    <div className="sm:grid sm:grid-cols-2 flex flex-col gap-3 sm:gap-6 w-full h-full pr-3">
      <Card className="px-4 sm:px-8 py-4 flex flex-col gap-5">
        <DayPicker
          mode="single"
          selected={selectedDay}
          onSelect={setSelectedDay}
          modifiers={{ occupied: occupiedDates }}
          modifiersClassNames={{ occupied: styles.occupiedDay }}
          navLayout="around"
          showOutsideDays
          className="w-full min-h-fit text-purple-900"
        />
        <ToggleCompletedButton
          showCompleted={showCompleted}
          onToggle={() => setShowCompleted((prev) => !prev)}
        />
      </Card>
      <Card className="w-full h-full">
        <div className="flex-1">
          <h2 className="text-lg font-semibold">
            {selectedDay
              ? `Items active on ${format(selectedDay, "PPP")}`
              : "Select a day to see active items"}
          </h2>
          <TaskList tasks={visibleItems} selectedDay={selectedDay} />
        </div>
      </Card>
    </div>
  );
}

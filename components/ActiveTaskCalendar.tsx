"use client";

import { useMemo, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import {
  isAfter,
  isBefore,
  isEqual,
  format,
  eachDayOfInterval,
  startOfDay,
} from "date-fns";
import { Task, TASK_STATUS } from "@/app/generated/prisma";
import Card from "./Card";
import ActionButton from "./ActionButton";
import GlassPane from "./GlassPane";

function isBetween(day: Date, start: Date, end: Date) {
  const normalizedDay = startOfDay(day);
  const normalizedStart = startOfDay(start);
  const normalizedEnd = startOfDay(end);

  if (isAfter(normalizedStart, normalizedEnd)) return false;
  return (
    isEqual(normalizedDay, normalizedStart) ||
    isEqual(normalizedDay, normalizedEnd) ||
    (isAfter(normalizedDay, normalizedStart) &&
      isBefore(normalizedDay, normalizedEnd))
  );
}

export default function ActiveItemCalendar({ tasks }: { tasks: Task[] }) {
  const [selectedDay, setSelectedDay] = useState<Date | undefined>();
  const [showCompeletedTasks, setShowCompeletedTasks] = useState(true);

  const occupiedDates = useMemo(() => {
    const dates = new Set<string>();

    tasks.forEach((item) => {
      if (!item.due) return;
      if (!item.due || item.due < item.createdAt) return;
      if (!showCompeletedTasks && item.status === TASK_STATUS.COMPLETED) return;

      const range = eachDayOfInterval({
        start: item.createdAt,
        end: item.due,
      });

      range.forEach((day) => dates.add(day.toDateString()));
    });

    return Array.from(dates).map((d) => new Date(d));
  }, [tasks, showCompeletedTasks]);

  const activeItems = useMemo(() => {
    if (!selectedDay) return [];

    return tasks.filter(
      (item) => item.due && isBetween(selectedDay, item.createdAt, item.due)
    );
  }, [tasks, selectedDay]);

  const visibleItems = useMemo(() => {
    return activeItems.filter((item) =>
      showCompeletedTasks ? true : item.status !== TASK_STATUS.COMPLETED
    );
  }, [activeItems, showCompeletedTasks]);

  const modifiers = {
    occupied: occupiedDates,
  };

  const modifiersClassNames = {
    occupied: "occupied-day",
  };
  return (
    <div className="sm:grid sm:grid-cols-2 flex flex-col gap-3 sm:gap-6 w-full h-full pr-3">
      <style>{`
        .occupied-day {
          position: relative;
        }

        .occupied-day::after {
          content: '';
          position: absolute;
          bottom: 3px;
          left: 50%;
          transform: translateX(-50%);
          width: 6px;
          height: 6px;
          background-color: hsla(271,78%,63%,1) ;
          border-radius: 9999px;
        }
      `}</style>

      <Card className="px-4 sm:px-8 py-4 flex flex-col gap-5">
        <DayPicker
          mode="single"
          selected={selectedDay}
          onSelect={setSelectedDay}
          modifiers={modifiers}
          modifiersClassNames={modifiersClassNames}
          navLayout="around"
          showOutsideDays
          className="w-full min-h-fit text-purple-900"
        />
        <ActionButton
          id="toggle"
          label={
            showCompeletedTasks
              ? "Do not show compeleted tasks"
              : "Show compeleted tasks"
          }
          onClick={() => setShowCompeletedTasks(!showCompeletedTasks)}
          loading={false}
        />
      </Card>
      <Card className="w-full h-full">
        <div className="flex-1">
          <h2 className="text-lg font-semibold">
            {selectedDay
              ? `Items active on ${format(selectedDay, "PPP")}`
              : "Select a day to see active items"}
          </h2>

          <ul className="mt-4 space-y-2">
            {visibleItems.length > 0 ? (
              visibleItems.map((item) => (
                <li key={item.id}>
                  <GlassPane className="p-3 rounded-2xl text-purple-300">
                    <div
                      className={`font-medium ${
                        item.status === TASK_STATUS.COMPLETED
                          ? "line-through"
                          : ""
                      }`}
                    >
                      {item.name}
                    </div>
                    <div className="text-sm">
                      {format(item.createdAt, "PPP")} →{" "}
                      {format(item.due!, "PPP")}
                    </div>
                  </GlassPane>
                </li>
              ))
            ) : selectedDay ? (
              <p className="text-gray-500">No items active on this day.</p>
            ) : null}
          </ul>
        </div>
      </Card>
    </div>
  );
}

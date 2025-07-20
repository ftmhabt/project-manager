import { intervalToDuration, isBefore } from "date-fns";

export function timeLeftUntil(targetDate: Date): string {
  const now = new Date();

  if (isBefore(targetDate, now)) {
    return "Time is up";
  }

  const duration = intervalToDuration({
    start: now,
    end: targetDate,
  });

  const parts = [];

  if (duration.months)
    parts.push(`${duration.months} month${duration.months > 1 ? "s" : ""}`);
  if (duration.days)
    parts.push(`${duration.days} day${duration.days > 1 ? "s" : ""}`);
  if (duration.hours)
    parts.push(`${duration.hours} hour${duration.hours > 1 ? "s" : ""}`);

  return parts.length > 0
    ? parts.join(", ") + " left"
    : "Less than an hour left";
}

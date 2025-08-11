import Card from "@/components/Card";

type StatCardProps = { label: string; value: number };

export default function StatCard({ label, value }: StatCardProps) {
  const isTasks = label === "Tasks";
  const iconFill = isTasks ? "hsla(317, 89%, 70%, 1)" : "#8b5cf6";
  const iconId = isTasks ? "file" : "folder";

  return (
    <Card className="flex flex-col items-center justify-center p-4 relative">
      <svg
        fill={iconFill}
        className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2/3 sm:w-1/2 hidden sm:block"
        width="300px"
        height="300px"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        id={iconId}
      >
        <path
          d={
            isTasks
              ? "M19.41,7,15,2.59A2,2,0,0,0,13.59,2H6A2,2,0,0,0,4,4V20a2,2,0,0,0,2,2H18a2,2,0,0,0,2-2V8.41A2,2,0,0,0,19.41,7Z"
              : "M20,6H13.41L11,3.59A2,2,0,0,0,9.59,3H4A2,2,0,0,0,2,5V19a2,2,0,0,0,2,2H20a2,2,0,0,0,2-2V8A2,2,0,0,0,20,6Z"
          }
        />
      </svg>

      <div className="text-3xl font-bold text-black sm:text-white">{value}</div>
      <div className="text-2xl text-gray-500 sm:text-white">{label}</div>
    </Card>
  );
}

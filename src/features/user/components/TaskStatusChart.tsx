"use client";

import Card from "components/Card";
import {
  Cell,
  Legend,
  LegendProps,
  Pie,
  PieChart,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "hsla(337, 92%, 61%, 1)",
  "hsla(317, 89%, 70%, 1)",
  "hsla(271, 78%, 63%, 1)",
];

const CustomLegend = (props: LegendProps) => {
  const { payload } = props;

  return (
    <ul className="text-xs mt-2 flex sm:flex-col justify-evenly w-full">
      {payload?.map((entry, index) => (
        <li key={`item-${index}`} className="flex items-center gap-1 sm:gap-2">
          <span
            className="inline-block w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span style={{ color: entry.color }}>{entry.value}</span>
        </li>
      ))}
    </ul>
  );
};

const renderCustomLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  value,
}: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
  const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={12}
    >
      {value}
    </text>
  );
};

export default function TaskStatusChart({
  completed,
  started,
  notStarted,
}: {
  completed: number;
  started: number;
  notStarted: number;
}) {
  const data = [
    { name: "Done", value: completed },
    { name: "In Progress", value: started },
    { name: "Not Started", value: notStarted },
  ];

  return (
    <Card className="w-full p-4 col-span-2 sm:col-span-1">
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={70}
            fill="#8884d8"
            stroke="transparent"
            paddingAngle={5}
            dataKey="value"
            label={renderCustomLabel}
            labelLine={false}
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
          <Legend content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}

"use client";

import {
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
  LegendProps,
} from "recharts";
import Card from "../Card";

const COLORS = [
  "hsla(337, 92%, 61%, 1)",
  "hsla(317, 89%, 70%, 1)",
  "hsla(271, 78%, 63%, 1)",
];

const CustomLegend = (props: LegendProps) => {
  const { payload } = props;

  return (
    <ul className="text-xs mt-2">
      {payload?.map((entry, index) => (
        <li key={`item-${index}`} className="flex items-center gap-2">
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
    { name: "Completed", value: completed },
    { name: "In Progress", value: started },
    { name: "Not Started", value: notStarted },
  ];

  return (
    <Card className="w-full p-4">
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={60}
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

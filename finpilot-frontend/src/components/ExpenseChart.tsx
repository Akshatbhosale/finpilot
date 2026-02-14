"use client";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ExpenseChart({ data }: any) {
  const labels = data.map((d: any) => d.category);
  const values = data.map((d: any) => d.total);

  const chartData = {
    labels,
    datasets: [
      {
        data: values,
      },
    ],
  };

  return <Pie data={chartData} />;
}

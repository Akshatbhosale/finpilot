"use client";

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip
);

export default function RebalanceChart({ data }: any) {
  const labels = data.with_rebalance.map((d: any) => `Year ${d.year}`);

  const chartData = {
    labels,
    datasets: [
      {
        label: "With Rebalance",
        data: data.with_rebalance.map((d: any) => d.value),
      },
      {
        label: "Without Rebalance",
        data: data.without_rebalance.map((d: any) => d.value),
      },
    ],
  };

  return <Line data={chartData} />;
}

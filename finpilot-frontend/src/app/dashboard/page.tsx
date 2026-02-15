"use client";

import { useEffect, useState } from "react";
import RebalanceChart from "@/components/RebalanceChart";

export default function Dashboard() {
  const [token, setToken] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  // -----------------------
  // Load token first
  // -----------------------
  useEffect(() => {
    const t = localStorage.getItem("token");
    if (!t) {
      window.location.href = "/login";
      return;
    }
    setToken(t);
  }, []);

  // -----------------------
  // Fetch dashboard after token exists
  // -----------------------
  useEffect(() => {
    if (!token) return;

    fetch(
      "http://127.0.0.1:8000/strategy/dashboard?monthly_investment=10000&years=10",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((res) => res.json())
      .then((res) => setData(res));
  }, [token]);

  if (!data)
    return (
      <div className="p-10 text-gray-500">
        Loading dashboard...
      </div>
    );

  return (
    <div className="space-y-8">
      {/* TITLE */}
      <h1 className="text-3xl font-bold">Strategy Dashboard</h1>
      <div className="bg-white dark:bg-gray-900 shadow p-6 rounded-xl">
        <h2 className="text-lg font-semibold mb-3">
          Portfolio Insights
        </h2>

        <ul className="list-disc ml-5 space-y-1 text-sm">
          {data.insights.map((i: string, idx: number) => (
            <li key={idx}>{i}</li>
          ))}
        </ul>
      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-900 shadow p-6 rounded-xl">
          <h2 className="text-sm text-gray-500">Expected Return</h2>
          <p className="text-3xl font-bold mt-2">
            {data.your_portfolio.expected_return}%
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 shadow p-6 rounded-xl">
          <h2 className="text-sm text-gray-500">Future Value</h2>
          <p className="text-3xl font-bold mt-2">
            ₹{data.your_portfolio.future_value}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 shadow p-6 rounded-xl">
          <h2 className="text-sm text-gray-500">Risk Score</h2>
          <p className="text-3xl font-bold mt-2">
            {data.your_portfolio.risk_score}
          </p>
        </div>
      </div>

      {/* COMPARISON */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          Strategy Comparison
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {Object.entries(data.comparison).map(([name, strat]: any) => (
            <div
              key={name}
              className="bg-white dark:bg-gray-900 shadow p-6 rounded-xl"
            >
              <h3 className="text-lg font-semibold capitalize mb-2">
                {name}
              </h3>
              <p className="text-sm">Return: {strat.expected_return}%</p>
              <p className="text-sm">Future: ₹{strat.future_value}</p>
              <p className="text-sm">Risk: {strat.risk_score}</p>
            </div>
          ))}
        </div>
      </div>

      {/* REBALANCE */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          Rebalancing Growth
        </h2>

        <div className="bg-white dark:bg-gray-900 shadow p-6 rounded-xl">
          <RebalanceChart data={data.rebalance} />
        </div>
      </div>
    </div>
  );
}

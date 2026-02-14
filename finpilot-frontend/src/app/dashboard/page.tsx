"use client";

import { useEffect, useState } from "react";
import RebalanceChart from "@/components/RebalanceChart";


export default function Dashboard() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href="/login";
    }
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
  }, []);

  if (!data) return <div className="p-10">Loading...</div>;

  return (
    <div className="p-10 space-y-6">
      <h1 className="text-3xl font-bold">Strategy Dashboard</h1>

      <div className="bg-white shadow p-6 rounded-xl">
        <h2 className="text-xl font-semibold">Your Portfolio</h2>
        <p>Expected Return: {data.your_portfolio.expected_return}%</p>
        <p>Future Value: ₹{data.your_portfolio.future_value}</p>
        <p>Risk Score: {data.your_portfolio.risk_score}</p>
      </div>
      <div className="grid grid-cols-3 gap-6">
        {Object.entries(data.comparison).map(([name, strat]: any) => (
        <div key={name} className="bg-white shadow p-6 rounded-xl">
            <h2 className="text-lg font-semibold capitalize">{name}</h2>
            <p>Return: {strat.expected_return}%</p>
            <p>Future Value: ₹{strat.future_value}</p>
            <p>Risk: {strat.risk_score}</p>
        </div>
        ))}
     </div>

      <div className="bg-white shadow p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-4">Rebalancing Growth</h2>
        <RebalanceChart data={data.rebalance} />
        </div>
    </div>
  );
}

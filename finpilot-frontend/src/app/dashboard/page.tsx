"use client";

import { useEffect, useState } from "react";
import RebalanceChart from "@/components/RebalanceChart";

export default function Dashboard() {
  const [token, setToken] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  // 🎯 Goal simulator state
  const [goalAmount, setGoalAmount] = useState("");
  const [goalYears, setGoalYears] = useState("");
  const [goalResult, setGoalResult] = useState<any>(null);

  const [aiAdvice, setAiAdvice] = useState<any>(null);

  // -----------------------
  // Load token
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
  // Fetch dashboard
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
    fetch("http://127.0.0.1:8000/ai/advice", {
    headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => res.json())
    .then((res) => {
      console.log("AI:",res);
      setAiAdvice(res);   
    });
  }, [token]);

  // -----------------------
  // Goal calculator
  // -----------------------
  async function calculateGoal() {
    if (!token) return;

    const res = await fetch("http://127.0.0.1:8000/strategy/goal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        goal_amount: parseFloat(goalAmount),
        years: parseInt(goalYears),
      }),
    });

    const result = await res.json();
    console.log("GOAL API RESPONSE:", result);
    setGoalResult(result);
  }

  if (!data)
    return <div className="p-10 text-gray-500">Loading dashboard...</div>;

  return (
    <div className="space-y-8">
      {/* TITLE */}
      <h1 className="text-3xl font-bold">Strategy Dashboard</h1>

      {/* INSIGHTS */}
      <div className="bg-white dark:bg-gray-900 shadow p-6 rounded-xl">
        <h2 className="text-lg font-semibold mb-3">Portfolio Insights</h2>
        <ul className="list-disc ml-5 space-y-1 text-sm">
          {data.insights.map((i: string, idx: number) => (
            <li key={idx}>{i}</li>
          ))}
        </ul>
      </div>
      {aiAdvice?.rule_based && (
        <div className="bg-white dark:bg-gray-900 shadow p-6 rounded-xl">
          <h2 className="text-lg font-semibold mb-3">
            AI Advisor
          </h2>

          <ul className="list-disc ml-5 space-y-1 text-sm">
            {aiAdvice.rule_based.map((i: string, idx: number) => (
              <li key={idx}>{i}</li>
            ))}
          </ul>

          <p className="mt-3 text-sm text-gray-500">
            {aiAdvice.ai_advice}
          </p>
        </div>
      )}

      {/* 🎯 GOAL SIMULATOR */}
      <div className="bg-white dark:bg-gray-900 shadow p-6 rounded-xl">
        <h2 className="text-lg font-semibold mb-4">Goal Simulator</h2>

        <div className="flex gap-3 mb-4 flex-wrap">
          <input
            placeholder="Goal amount"
            className="border p-2 rounded"
            value={goalAmount}
            onChange={(e) => setGoalAmount(e.target.value)}
          />

          <input
            placeholder="Years"
            className="border p-2 rounded"
            value={goalYears}
            onChange={(e) => setGoalYears(e.target.value)}
          />

          <button
            onClick={calculateGoal}
            className="bg-black text-white px-4 py-2 rounded"
          >
            Calculate
          </button>
        </div>

        {goalResult && (
          <p className="text-sm">
            You need to invest{" "}
            <span className="font-semibold">
              ₹{goalResult.monthly_investment}
            </span>{" "}
            per month (expected return {goalResult.expected_return}%)
          </p>
        )}
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
        <h2 className="text-xl font-semibold mb-4">Strategy Comparison</h2>

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
        <h2 className="text-xl font-semibold mb-4">Rebalancing Growth</h2>

        <div className="bg-white dark:bg-gray-900 shadow p-6 rounded-xl">
          <RebalanceChart data={data.rebalance} />
        </div>
      </div>
    </div>
  );
}

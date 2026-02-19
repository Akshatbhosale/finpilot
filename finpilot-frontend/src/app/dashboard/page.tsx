"use client";

import { useEffect, useState } from "react";
import RebalanceChart from "@/components/RebalanceChart";

export default function Dashboard() {
  const [token, setToken] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);
  const [aiAdvice, setAiAdvice] = useState<any>(null);
  const [optimizer, setOptimizer] = useState<any>(null);

  const [goalAmount, setGoalAmount] = useState("");
  const [goalYears, setGoalYears] = useState("");
  const [goalResult, setGoalResult] = useState<any>(null);

  // Load token
  useEffect(() => {
    const t = localStorage.getItem("token");
    if (!t) {
      window.location.href = "/login";
      return;
    }
    setToken(t);
  }, []);

  // Fetch data
  useEffect(() => {
    if (!token) return;

    // Dashboard data
    fetch(
      "http://127.0.0.1:8000/strategy/dashboard?monthly_investment=10000&years=10",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
      .then((res) => res.json())
      .then((res) => setData(res));

    // AI advice
    fetch("http://127.0.0.1:8000/ai/advice", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((res) => setAiAdvice(res.advice ?? res));

    // Optimizer
    fetch("http://127.0.0.1:8000/strategy/optimize", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((res) => setOptimizer(res));
  }, [token]);

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
    setGoalResult(result);
  }

  if (!data)
    return (
      <div className="p-10 text-gray-500 text-center">
        Loading dashboard...
      </div>
    );

  return (
    <div className="space-y-10">

      {/* TITLE */}
      <h1 className="text-3xl font-bold tracking-tight">
        Strategy Dashboard
      </h1>

      {/* INSIGHTS */}
      <div className="bg-white dark:bg-gray-900 shadow-md rounded-2xl p-6">
        <h2 className="text-lg font-semibold mb-3">
          Portfolio Insights
        </h2>
        <ul className="list-disc ml-5 space-y-1 text-sm">
          {data.insights.map((i: string, idx: number) => (
            <li key={idx}>{i}</li>
          ))}
        </ul>
      </div>
    <div className="grid lg:grid-cols-2 gap-6">
      {/* AI ADVISOR */}
      {aiAdvice && (
        <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 shadow-md rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-3">
            🤖 AI Portfolio Advisor
          </h2>

          {aiAdvice.rule_based && (
            <ul className="list-disc ml-5 space-y-1 text-sm mb-4">
              {aiAdvice.rule_based.map((i: string, idx: number) => (
                <li key={idx}>{i}</li>
              ))}
            </ul>
          )}

          <p className="text-sm whitespace-pre-line text-gray-700 dark:text-gray-300">
            {aiAdvice.ai_advice}
          </p>
        </div>
      )}

      {/* OPTIMIZER */}
      {optimizer && (
        <div className="bg-green-50 dark:bg-green-950 border border-green-200 shadow-md rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4">
            🧠 Portfolio Optimizer Suggestion
          </h2>

          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div>
              <h3 className="font-semibold mb-2">Current Allocation</h3>
              {Object.entries(optimizer.current).map(([k, v]: any) => (
                <p key={k}>{k}: {v}%</p>
              ))}
            </div>

            <div>
              <h3 className="font-semibold mb-2">Optimized Allocation</h3>
              {Object.entries(optimizer.optimized).map(([k, v]: any) => (
                <p key={k}>{k}: {v}%</p>
              ))}
            </div>
          </div>

          <p className="mt-4 text-xs text-gray-500">
            Optimized for better return-to-risk balance.
          </p>
        </div>
      )}
    </div>
      {/* GOAL SIMULATOR */}
      <div className="bg-white dark:bg-gray-900 shadow-md rounded-2xl p-6">
        <h2 className="text-lg font-semibold mb-4">
          🎯 Goal Simulator
        </h2>

        <div className="flex flex-wrap gap-3 mb-4">
          <input
            placeholder="Goal amount"
            className="border rounded-lg px-3 py-2"
            value={goalAmount}
            onChange={(e) => setGoalAmount(e.target.value)}
          />
          <input
            placeholder="Years"
            className="border rounded-lg px-3 py-2"
            value={goalYears}
            onChange={(e) => setGoalYears(e.target.value)}
          />
          <button
            onClick={calculateGoal}
            className="bg-black text-white px-4 py-2 rounded-lg hover:opacity-90"
          >
            Calculate
          </button>
        </div>

        {goalResult && (
          <p className="text-sm">
            Invest <span className="font-semibold">
              ₹{goalResult.monthly_investment}
            </span> per month
            (expected return {goalResult.expected_return}%)
          </p>
        )}
      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-3 gap-6">
        <StatCard
          title="Expected Return"
          value={`${data.your_portfolio.expected_return}%`}
        />
        <StatCard
          title="Future Value"
          value={`₹${data.your_portfolio.future_value}`}
        />
        <StatCard
          title="Risk Score"
          value={data.your_portfolio.risk_score}
        />
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
              className="bg-white dark:bg-gray-900 shadow-md rounded-2xl p-6"
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

      {/* REBALANCE CHART */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          Rebalancing Growth
        </h2>

        <div className="bg-white dark:bg-gray-900 shadow-md rounded-2xl p-6">
          <RebalanceChart data={data.rebalance} />
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value }: any) {
  return (
    <div className="bg-white dark:bg-gray-900 shadow-md rounded-2xl p-6">
      <h2 className="text-sm text-gray-500">{title}</h2>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}

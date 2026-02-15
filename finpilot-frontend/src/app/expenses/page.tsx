"use client";

import { useState, useEffect } from "react";
import ExpenseChart from "@/components/ExpenseChart";

export default function ExpensesPage() {
  const [token, setToken] = useState<string | null>(null);

  const [expenses, setExpenses] = useState<any[]>([]);
  const [summary, setSummary] = useState<any[]>([]);

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

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
  // Fetch data ONLY when token exists
  // -----------------------
  useEffect(() => {
    if (!token) return;

    loadExpenses();
    loadSummary();
  }, [token]);

  // -----------------------
  // Load expenses
  // -----------------------
  function loadExpenses() {
    fetch("http://127.0.0.1:8000/expenses", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (Array.isArray(res)) setExpenses(res);
        else setExpenses([]);
      });
  }

  // -----------------------
  // Load summary
  // -----------------------
  function loadSummary() {
    fetch("http://127.0.0.1:8000/expenses/summary/category", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (Array.isArray(res)) setSummary(res);
        else setSummary([]);
      });
  }

  // -----------------------
  // Add expense
  // -----------------------
  async function addExpense() {
    if (!token) return;

    await fetch("http://127.0.0.1:8000/expenses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        amount: parseFloat(amount),
        category,
        description,
      }),
    });

    setAmount("");
    setCategory("");
    setDescription("");

    loadExpenses();
    loadSummary();
  }

  // -----------------------
  // UI
  // -----------------------
  return (
    <div className="p-10 space-y-6">
      <h1 className="text-2xl font-bold">Expenses</h1>

      {/* Add expense form */}
      <div className="space-x-2">
        <input
          placeholder="Amount"
          className="border p-2"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <input
          placeholder="Category"
          className="border p-2"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <input
          placeholder="Description"
          className="border p-2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button
          onClick={addExpense}
          className="bg-black text-white px-4 py-2"
        >
          Add
        </button>
      </div>

      {/* Chart */}
      <div className="bg-white dark:bg-gray-900 shadow p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-4">
          Category Breakdown
        </h2>
        {summary.length > 0 && <ExpenseChart data={summary} />}
      </div>

      {/* Expense list */}
      <div className="space-y-2">
        {Array.isArray(expenses) &&
          expenses.map((e, i) => (
            <div
              key={i}
              className="border p-3 rounded bg-white dark:bg-gray-900"
            >
              ₹{e.amount} — {e.category} — {e.description}
            </div>
          ))}
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";

export default function PortfolioPage() {
  const [portfolio, setPortfolio] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "/login";
    }
    fetch("http://127.0.0.1:8000/portfolio", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((res) => setPortfolio(res));
  }, []);

  function handleChange(e: any) {
    setPortfolio({
      ...portfolio,
      [e.target.name]: parseFloat(e.target.value),
    });
  }

  async function savePortfolio() {
    const token = localStorage.getItem("token");

    await fetch("http://127.0.0.1:8000/portfolio", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(portfolio),
    });

    alert("Portfolio updated");
  }

  if (!portfolio) return <div className="p-10">Loading...</div>;

  return (
    <div className="p-10 space-y-4">
      <h1 className="text-2xl font-bold">Portfolio Allocation</h1>

      {["large_cap", "mid_cap", "small_cap", "gold", "debt"].map((key) => (
        <div key={key}>
          <label className="capitalize">{key}</label>
          <input
            type="number"
            name={key}
            value={portfolio[key]}
            onChange={handleChange}
            className="border p-2 ml-4"
          />
        </div>
      ))}

      <button
        onClick={savePortfolio}
        className="bg-black text-white px-4 py-2"
      >
        Save
      </button>
    </div>
  );
}

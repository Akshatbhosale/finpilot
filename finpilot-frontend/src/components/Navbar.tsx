export default function Navbar() {
  return (
    <div className="bg-black text-white p-4 flex gap-6">
      <a href="/dashboard">Dashboard</a>
      <a href="/portfolio">Portfolio</a>
      <a href="/expenses">Expenses</a>
    </div>
  );
}

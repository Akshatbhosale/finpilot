import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  return (
    <div className="bg-white dark:bg-gray-900 shadow px-6 py-4 flex justify-between items-center">
      <div className="flex gap-6 font-medium">
        <a href="/dashboard">Dashboard</a>
        <a href="/portfolio">Portfolio</a>
        <a href="/expenses">Expenses</a>
      </div>

      <ThemeToggle />
    </div>
  );
}

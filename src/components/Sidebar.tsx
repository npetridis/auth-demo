import Link from "next/link";
import UserButton from "./UserButton";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-800 text-white p-4">
      <nav className="flex flex-col justify-between h-full">
        <ul>
          <li className="mb-2">
            <Link
              href="/sign-in"
              className="block p-2 hover:bg-gray-700 rounded"
            >
              Sign In
            </Link>
          </li>
          <li className="mb-2">
            <Link
              href="/sign-up"
              className="block p-2 hover:bg-gray-700 rounded"
            >
              Sign Up
            </Link>
          </li>
          <li className="mb-2">
            <Link
              href="/dashboard"
              className="block p-2 hover:bg-gray-700 rounded"
            >
              Dashboard
            </Link>
          </li>
        </ul>
        <UserButton />
      </nav>
    </aside>
  );
}

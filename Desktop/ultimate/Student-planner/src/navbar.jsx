import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Home", mobile: "Home" },
  { to: "/student", label: "Student", mobile: "Student Dashboard" },
  { to: "/teacher", label: "Teacher", mobile: "Teacher Dashboard" },
  { to: "/admin", label: "Admin", mobile: "Administration" },
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const desktopClass = ({ isActive }) =>
    `rounded-lg px-3.5 py-2 text-sm font-medium transition-colors no-underline ${
      isActive
        ? "bg-indigo-500/15 text-indigo-400"
        : "text-slate-300 hover:bg-slate-800 hover:text-white"
    }`;

  const mobileClass = ({ isActive }) =>
    `rounded-xl px-4 py-3 text-base font-medium transition-colors no-underline ${
      isActive
        ? "bg-indigo-500/15 text-indigo-400"
        : "text-slate-300 hover:bg-slate-800 hover:text-white"
    }`;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/95 backdrop-blur-xl">
      <nav
        className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8"
        aria-label="Main navigation"
      >
     
        <div className="flex items-center gap-8">
          <Link
            to="/"
            className="flex items-center gap-2.5 rounded-lg no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
           

            <span className="text-lg font-semibold no-underline tracking-tight text-white">
              TrackEd
            </span>
          </Link>

          <ul className="hidden items-center gap-1 lg:flex">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink to={link.to} end className={desktopClass}>
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative hidden md:block">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z"
              />
            </svg>

            <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded border border-slate-700 bg-slate-800 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">
              ⌘K
            </kbd>
          </div>

          {/* Divider */}
          <div className="hidden h-6 w-px bg-slate-800 sm:block" />

          {/* Login */}
          <Link
            to="/login"
            className="hidden rounded-lg px-3.5 py-2 text-sm font-medium text-slate-300 no-underline transition-colors hover:bg-slate-800 hover:text-white lg:inline-flex"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="hidden items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 px-4 py-2 text-sm font-semibold text-white no-underline shadow-md shadow-indigo-500/20 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/30 lg:inline-flex"
          >
            Sign up
          </Link>

          {/* Mobile Menu */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="inline-flex rounded-lg p-2 text-slate-300 transition-colors hover:bg-slate-800 hover:text-white lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d={
                  menuOpen
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16M4 18h16"
                }
              />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="border-t border-slate-800 bg-slate-950 p-4 lg:hidden">
          <nav className="flex flex-col gap-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end
                className={mobileClass}
                onClick={() => setMenuOpen(false)}
              >
                {link.mobile}
              </NavLink>
            ))}

            <Link
              to="/login"
              className="mt-2 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 px-4 py-3 text-center text-base font-semibold text-white no-underline shadow-lg shadow-indigo-500/20"
              onClick={() => setMenuOpen(false)}
            >
              Login
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

export default Navbar;
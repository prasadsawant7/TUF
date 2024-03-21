import { NavLink, useLocation } from "react-router-dom";

function Navbar() {
  const { pathname } = useLocation();

  return (
    <div className="bg-leetcode-nav">
      <nav className="mx-auto flex max-w-[1400px] items-center justify-start gap-10 px-4">
        <NavLink
          to="/"
          className={`py-4 font-medium leading-[22px] transition-colors delay-100 ${pathname === "/" ? "border-b-4 text-leetcode-fg" : "border-b-4 border-b-transparent text-leetcode-fg/80"}`}
        >
          Home
        </NavLink>
        <NavLink
          to="/submissions"
          className={`py-4 font-medium leading-[22px] transition-colors delay-100 ${pathname === "/submissions" ? "border-b-4 text-leetcode-fg" : "border-b-4 border-b-transparent text-leetcode-fg/80"}`}
        >
          Submissions
        </NavLink>
      </nav>
    </div>
  );
}

export default Navbar;

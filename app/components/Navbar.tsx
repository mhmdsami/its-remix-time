import { Link } from "@remix-run/react";
import type { User as UserType } from "~/types";

interface NavbarProps {
  user?: UserType;
}

const Navbar = ({ user }: NavbarProps) => {
  return (
    <nav className="flex justify-between items-center px-10 h-16 bg-tertiary">
      <Link to="/" className="text-2xl font-bold">
        Remix!
      </Link>
      {user ? (
        <div className="flex gap-2">
          <Link to="/dashboard/add" className="btn">
            Add Participant
          </Link>
          <form action="/signout" method="post">
            <button type="submit" className="btn">
              Sign Out
            </button>
          </form>
        </div>
      ) : (
        <Link to="/signin" className="btn">
          Sign In
        </Link>
      )}
    </nav>
  );
};

export default Navbar;

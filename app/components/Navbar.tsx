import { Link } from "@remix-run/react";

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center px-10 h-16 bg-tertiary">
      <Link to="/" className="text-2xl font-bold">
        Remix!
      </Link>
      <Link to="/signin" className="btn">
        Sign In
      </Link>
    </nav>
  );
};

export default Navbar;

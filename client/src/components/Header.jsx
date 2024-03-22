import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function Header() {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <header className="bg-sky-800 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-sky-50">MERN</span>
            <span className="text-sky-300">Hotel</span>
          </h1>
        </Link>
        <form className="bg-sky-50 p-3 rounded-lg flex items-center">
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-24 sm:w-64"
          />
          <FaSearch className="text-slate-500" />
        </form>
        <ul className="flex gap-4">
          <Link to="/">
            <li className="hidden sm:inline text-sky-50 hover:underline">
              HOME
            </li>
          </Link>
          <Link to="/about">
            <li className="hidden sm:inline text-sky-50 hover:underline">
              ABOUT
            </li>
          </Link>
          <Link to="/profile">
            {currentUser ? (
              <img
                className="rounded-full h-7 w-7 object-cover"
                src={currentUser.avatar}
                alt="profile"
              />
            ) : (
              <li className="text-sky-50 hover:underline">SIGN IN</li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
}

export default Header;

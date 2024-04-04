import { useEffect, useState, useContext } from "react";
import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { CartContext } from "../CartContext";
import { FaHome, FaShoppingCart } from "react-icons/fa";

function Header() {
  const cart = useContext(CartContext);
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  return (
    <header className="bg-sky-800 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-sky-50">MERN</span>
            <span className="text-sky-300">Hotel</span>
          </h1>
        </Link>
        <form
          onSubmit={handleSubmit}
          className="bg-sky-50 p-3 rounded-lg flex items-center"
        >
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-24 sm:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button>
            <FaSearch className="text-sky-800" />
          </button>
        </form>
        <ul className="flex gap-4">
          <Link to="/">
            <li className="hidden sm:inline text-sky-50 hover:underline flex justify-between items-center">
              <div className="flex items-center">
                <FaHome />
                <span className="ml-2">HOME</span>
              </div>
              <span className="ml-auto"></span>
            </li>
          </Link>
          <Link to="/cart">
            <li className="text-sky-50 hover:underline flex justify-between items-center">
              <div className="flex items-center">
                <FaShoppingCart />
                <span className="ml-2 text-sm sm:text-base">
                  CART({cart.items.reduce((acc, cur) => acc + cur.quantity, 0)})
                </span>
              </div>
              <span className="ml-auto"></span>
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

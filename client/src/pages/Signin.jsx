import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice.js";
import OAuth from "../components/OAuth.jsx";

function Signin() {
  const [formData, setFormData] = useState({});
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState(null);
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // setIsLoading(true);
    dispatch(signInStart());
    const res = await fetch("api/auth/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (data.success === false) {
      // setError(data.message);
      // setIsLoading(false);
      dispatch(signInFailure(data.message));
      return;
    }
    // setError(null);
    // setIsLoading(false);
    dispatch(signInSuccess(data));
    navigate("/");
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7 text-sky-800">
        Sign In
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="email"
          id="email"
          onChange={handleChange}
          className="border p-2 rounded-lg"
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          onChange={handleChange}
          className="border p-2 rounded-lg"
        />
        <button
          disabled={loading}
          className="bg-sky-800 text-white p-2 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "sign in"}
        </button>
        <OAuth />
      </form>
      <div className="flex justify-between mt-1">
        <p>Dont have an account?</p>
        <Link to="/signup">
          <span className="text-sky-800">Sign up</span>
        </Link>
      </div>
      {error && <p className="text-red-500 mt-1">{error}</p>}
    </div>
  );
}

export default Signin;

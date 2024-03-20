import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Signup() {
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const res = await fetch("api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (data.success === false) {
      setError(data.message);
      setIsLoading(false);
      return;
    }
    setError(null);
    setIsLoading(false);
    navigate("/signin");
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7 text-sky-800">
        Sign Up
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="username"
          id="username"
          onChange={handleChange}
          className="border p-2 rounded-lg"
        />
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
          disabled={isLoading}
          className="bg-sky-800 text-white p-2 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {isLoading ? "Loading..." : "sign up"}
        </button>
        <div className="flex justify-between mt-1">
          <p>Have an account?</p>
          <Link to="/signin">
            <span className="text-sky-800">Sign in</span>
          </Link>
        </div>
      </form>
      {error && <p className="text-red-500 mt-1">{error}</p>}
    </div>
  );
}

export default Signup;

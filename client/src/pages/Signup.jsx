import { Link } from "react-router-dom";

function Signup() {
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7 text-sky-800">
        Sign Up
      </h1>
      <form className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="username"
          id="username"
          className="border p-2 rounded-lg"
        />
        <input
          type="email"
          placeholder="email"
          id="email"
          className="border p-2 rounded-lg"
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          className="border p-2 rounded-lg"
        />
        <button className="bg-sky-800 text-white p-2 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
          SIGN UP
        </button>
        <div className="flex justify-between mt-1">
          <p>Have an account?</p>
          <Link to="/signin">
            <span className="text-sky-800">Sign in</span>
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Signup;

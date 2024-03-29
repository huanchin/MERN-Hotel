import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
import CreateListing from "./pages/CreateListing";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route index element={<Home />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/cart" element={<Cart />} />
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-listing" element={<CreateListing />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

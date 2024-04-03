import { useDispatch, useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure,
} from "../redux/user/userSlice.js";

function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [deleteListingsError, setDeleteListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const [userBookings, setUserBookings] = useState([]);
  const [showBookingsError, setShowBookingsError] = useState(false);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (err) {
      dispatch(updateUserFailure(err.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess());
    } catch (err) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch(`api/auth/signout`);
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess());
    } catch (err) {
      dispatch(signOutUserFailure(err.message));
    }
  };

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    // start using firebase storage
    const storage = getStorage(app);
    // create a unique filename
    const fileName = new Date().getTime() + file.name;
    // create a storage reference from our storage service: showing which place to save the image
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    // monitor upload progress
    uploadTask.on(
      // 'state_changed' observer, called any time the state changes
      "state_changed",
      // Observe state change events such as progress, pause, and resume
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      // Error observer, called on failure
      (error) => {
        setFileUploadError(true);
      },
      // Completion observer, called on successful completion
      () => {
        // get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError("Error showing listings");
        return;
      }

      setUserListings(data);
      setShowListingsError(false);
    } catch (err) {
      setShowListingsError(err.message);
    }
  };

  const handleListingDelete = async (id) => {
    try {
      const res = await fetch(`/api/listing/delete/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success === false) {
        setDeleteListingsError(data.message);
        return;
      }
      setUserListings((prev) => prev.filter((listing) => listing._id !== id));
      setDeleteListingsError(false);
    } catch (err) {
      setDeleteListingsError(err.message);
    }
  };

  const handleShowBookings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/bookings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError("Error showing bookings");
        return;
      }

      setUserBookings(data);
      setShowBookingsError(false);
    } catch (err) {
      setShowBookingsError(err.message);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7 text-sky-800">
        Profile
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />
        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700">
              Error Image upload (image must be less than 2 mb)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-700">{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className="text-green-700">Image successfully uploaded!</span>
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          placeholder="username"
          id="username"
          className="border p-3 rounded-lg"
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="email"
          id="email"
          className="border p-3 rounded-lg"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-sky-800 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Update"}
        </button>
        <Link
          className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95"
          to={"/create-listing"}
        >
          Create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span
          onClick={handleDeleteUser}
          className="text-red-700 cursor-pointer"
        >
          Delete account
        </span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">
          Sign out
        </span>
      </div>
      <p className="text-red-700 mt-5">{error ? error : ""}</p>
      <p className="text-green-700 mt-5">
        {updateSuccess ? "User updated successfully" : ""}
      </p>
      <button onClick={handleShowListings} className="text-green-700 w-full">
        Show Listings
      </button>
      <p className="text-red-700 mt-5">
        {showListingsError ? showListingsError : ""}
      </p>

      {userListings && userListings.length > 0 && (
        <div className="flex flex-col gap-4">
          <h1 className="text-center mt-7 text-2xl font-semibold">
            Your Listings
          </h1>
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className="border rounded-lg p-3 flex justify-between items-center gap-4"
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt="listing cover"
                  className="h-16 w-16 object-contain"
                />
              </Link>
              <Link
                className="text-slate-700 font-semibold  hover:underline truncate flex-1"
                to={`/listing/${listing._id}`}
              >
                <p>{listing.name}</p>
              </Link>

              <div className="flex flex-col item-center">
                <button
                  onClick={() => handleListingDelete(listing._id)}
                  className="text-red-700 uppercase"
                >
                  Delete
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className="text-green-700 uppercase">Edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
      <button onClick={handleShowBookings} className="text-green-700 w-full">
        Show Bookings
      </button>
      <p className="text-red-700 mt-5">
        {showListingsError ? showListingsError : ""}
      </p>
      {userBookings &&
        userBookings.length > 0 &&
        userBookings.map((booking) => (
          <div key={booking._id}>
            <h1 className="font-semibold text-center my-7 text-sky-800">
              Booking {booking._id}
            </h1>
            {booking.purchaseList.map((item) => {
              console.log(item);
              return (
                <div
                  key={item.id._id}
                  className="border rounded-lg p-3 flex justify-between items-center gap-4"
                >
                  <img
                    src={item.id.imageUrls}
                    alt="booking cover"
                    className="h-16 w-16 object-contain"
                  />
                  <p>{item.id.name}</p>
                  <p>{item.quantity}</p>
                  <p>
                    {item.id.discountPrice
                      ? item.id.discountPrice
                      : item.id.regularPrice}
                  </p>
                </div>
              );
            })}
            <h1 className="font-semibold text-center my-7 text-sky-800">
              Total {booking.price}
            </h1>
          </div>
        ))}

      <p className="text-red-700 mt-5">
        {deleteListingsError ? deleteListingsError : ""}
      </p>
    </div>
  );
}

export default Profile;

import { useEffect, useState, useContext } from "react";
import {
  FaEnvelope,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaPhone,
  FaUser,
  FaSave,
  FaEdit,
} from "react-icons/fa";
import axios from "axios";
import { AuthContext } from "../../AuthContext/AuthContext";

const MyProfileComponent = () => {
  const { token } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          "https://vehicle-rental-wheelify-backend.onrender.com/api/v1/get-profile-details",
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        setProfile(response.data.data);
        setFormData(response.data.data);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };

    if (token) fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profilePicture") {
      setSelectedImage(files[0]);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleEditToggle = () => setEditMode((prev) => !prev);

  const handleSave = async () => {
    try {
      await axios.put(
        "https://vehicle-rental-wheelify-backend.onrender.com/api/v1/update-profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      setEditMode(false);
      window.location.reload();
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  const handleConfirmDelete = async () => {
    if (confirmText.trim().toLowerCase() !== "confirm") {
      alert("You must type 'confirm' to delete your account.");
      return;
    }

    try {
      const response = await axios.delete("https://vehicle-rental-wheelify-backend.onrender.com/delete-account", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      if (response.data.success) {
        alert("Account deleted successfully.");
        localStorage.removeItem("token");
        window.location.href = "/login";
      } else {
        alert(response.data.message || "Account deletion failed.");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Something went wrong while deleting your account.");
    }

    setShowDeleteModal(false);
  };

  if (!profile) return <div className="text-center mt-16">Loading profile...</div>;

  const { name, email, dateOfBirth, contactNumber, address, image, gender } = formData;

  return (
    <div className="max-w-6xl mx-auto my-10 p-4">
      {/* Header */}
      <div className="flex justify-between items-center p-6 rounded-xl shadow-xl bg-white">
        <div className="flex items-center gap-6">
          <div className="relative w-32 h-32 rounded-full overflow-hidden shadow-xl">
            <img
              src={selectedImage ? URL.createObjectURL(selectedImage) : image || "/default-profile.png"}
              alt="Profile"
              className="w-full h-full object-cover"
            />
            {editMode && (
              <label className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-sm font-semibold cursor-pointer">
                Change Photo
                <input
                  type="file"
                  name="profilePicture"
                  accept="image/*"
                  onChange={handleChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-green-900">{name}</h1>
            <div className="mt-2 inline-block bg-white text-green-600 font-medium text-sm px-4 py-1 rounded-full shadow">
              <FaPhone className="inline mr-1" /> {contactNumber || "Not specified"}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center">
          {editMode ? (
            <button
              className="bg-white mt-2 px-6 py-2 rounded-md text-green-600 font-medium shadow hover:bg-green-50 flex items-center gap-2"
              onClick={handleSave}
            >
              <FaSave /> Save
            </button>
          ) : (
            <button
              className="bg-white mt-2 px-6 py-2 rounded-md text-green-600 font-medium shadow hover:bg-green-50 flex items-center gap-2"
              onClick={handleEditToggle}
            >
              <FaEdit /> Edit
            </button>
          )}
        </div>
      </div>

      {/* Information Section */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Personal Info */}
        <div className="bg-white rounded-xl shadow-xl p-6">
          <h2 className="text-2xl font-semibold text-green-900 mb-4">Personal Information</h2>
          <div className="space-y-4">
            <div className="p-4 rounded-md bg-white shadow">
              <label className="text-sm text-green-700 block mb-1">Name</label>
              {editMode ? (
                <input
                  type="text"
                  name="name"
                  value={name}
                  onChange={handleChange}
                  className="w-full border p-2 rounded-md text-green-900"
                />
              ) : (
                <div className="flex items-center gap-2 font-medium text-green-900">
                  <FaUser /> {name}
                </div>
              )}
            </div>

            <div className="p-4 rounded-md bg-white shadow">
              <label className="text-sm text-green-700 block mb-1">Date of Birth</label>
              {editMode ? (
                <input
                  type="date"
                  name="dateOfBirth"
                  value={dateOfBirth || ""}
                  onChange={handleChange}
                  className="w-full border p-2 rounded-md text-green-900"
                />
              ) : (
                <div className="flex items-center gap-2 font-medium text-green-900">
                  <FaCalendarAlt /> {dateOfBirth || "Not specified"}
                </div>
              )}
            </div>

            <div className="p-4 rounded-md bg-white shadow">
              <label className="text-sm text-green-700 block mb-1">Gender</label>
              {editMode ? (
                <select
                  name="gender"
                  value={gender || ""}
                  onChange={handleChange}
                  className="w-full border p-2 rounded-md text-green-900"
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              ) : (
                <div className="font-medium text-green-900">{gender || "Not specified"}</div>
              )}
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white rounded-xl shadow-xl p-6">
          <h2 className="text-2xl font-semibold text-green-900 mb-4">Contact Information</h2>
          <div className="space-y-4">
            <div className="p-4 rounded-md bg-white shadow">
              <label className="text-sm text-green-700 block mb-1">Phone Number</label>
              {editMode ? (
                <input
                  type="text"
                  name="contactNumber"
                  value={contactNumber || ""}
                  onChange={handleChange}
                  className="w-full border p-2 rounded-md text-green-900"
                />
              ) : (
                <div className="flex items-center gap-2 font-medium text-green-900">
                  <FaPhone /> {contactNumber || "Not specified"}
                </div>
              )}
            </div>

            <div className="p-4 rounded-md bg-white shadow">
              <label className="text-sm text-green-700 block mb-1">Email</label>
              <div className="flex items-center gap-2 font-medium text-green-900">
                <FaEnvelope /> {email}
              </div>
            </div>

            <div className="p-4 rounded-md bg-white shadow">
              <label className="text-sm text-green-700 block mb-1">Address</label>
              {editMode ? (
                <input
                  type="text"
                  name="address"
                  value={address || ""}
                  onChange={handleChange}
                  className="w-full border p-2 rounded-md text-green-900"
                />
              ) : (
                <div className="flex items-center gap-2 font-medium text-green-900">
                  <FaMapMarkerAlt /> {address || "Not specified"}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Button */}
      <div className="mt-12 flex justify-center">
        <button
          onClick={() => setShowDeleteModal(true)}
          className="bg-red-600 text-white px-6 py-2 rounded-md font-medium shadow hover:bg-red-700 transition-colors"
        >
          Delete My Account
        </button>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 shadow-xl w-full max-w-md">
            <h2 className="text-xl font-semibold text-red-600 mb-4">Confirm Account Deletion</h2>
            <p className="text-gray-700 mb-4">
              Once you delete your account, there is no going back. If you are sure, type
              <strong> confirm</strong> below:
            </p>
            <textarea
              rows={2}
              className="w-full p-2 border rounded-md mb-4"
              placeholder="Type 'confirm' here"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
            />
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProfileComponent;
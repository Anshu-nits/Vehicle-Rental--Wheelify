import { useEffect, useState, useContext } from "react";
import {
  FaEnvelope,
  FaLock,
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

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/v1/get-profile-details",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        setProfile(response.data.data);
        setFormData(response.data.data);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };

    if (token) {
      fetchProfile();
    }
  }, [token]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleEditToggle = () => {
    setEditMode((prev) => !prev);
  };

  const handleSave = async () => {
    try {
      await axios.put(
        "http://localhost:4000/api/v1/update-profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      setEditMode(false);
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  if (!profile) {
    return <div className="text-center mt-16">Loading profile...</div>;
  }

  const { name, email, gender, dateOfBirth, contactNumber, address } = formData;

  return (
    <div className="max-w-6xl mx-auto my-10 p-4">
      {/* Header */}
      <div className="flex justify-between items-center p-6 rounded-xl shadow-xl bg-white">
        <div className="flex items-center gap-6">
          <div className="w-32 h-32 rounded-full bg-white shadow-xl flex items-center justify-center text-5xl text-green-500">
            <FaUser />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-green-900">{name}</h1>
            <p className="text-sm text-gray-600 mt-1">{email}</p>
            <div className="mt-2 inline-block bg-white text-green-600 font-medium text-sm px-4 py-1 rounded-full shadow">
              {gender || "Not specified"}
            </div>
          </div>
        </div>
        <button
          className="bg-white px-5 py-2 rounded-md text-green-600 font-medium shadow hover:bg-green-50 flex items-center gap-2"
          onClick={editMode ? handleSave : handleEditToggle}
        >
          {editMode ? (
            <>
              <FaSave />
              Save
            </>
          ) : (
            <>
              <FaEdit />
              Edit Profile
            </>
          )}
        </button>
      </div>

      {/* Information */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Personal Info */}
        <div className="bg-white rounded-xl shadow-xl p-6">
          <h2 className="text-2xl font-semibold text-green-900 mb-4">
            Personal Information
          </h2>
          <div className="space-y-4">
            {/* Name */}
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

            {/* Email (Read-only) */}
            <div className="p-4 rounded-md bg-white shadow">
              <label className="text-sm text-green-700 block mb-1">Email</label>
              <div className="flex items-center gap-2 font-medium text-green-900">
                <FaEnvelope /> {email}
              </div>
            </div>

            {/* Date of Birth */}
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
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white rounded-xl shadow-xl p-6">
          <h2 className="text-2xl font-semibold text-green-900 mb-4">
            Contact Information
          </h2>
          <div className="space-y-4">
            {/* Phone */}
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

            {/* Address */}
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

            {/* Account Status */}
            <div className="p-4 rounded-md bg-white shadow">
              <label className="text-sm text-green-700 block mb-1">Account Status</label>
              <div className="flex items-center gap-2 font-medium text-green-900">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Active Account
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfileComponent;


// import { useEffect, useState, useContext } from "react";
// import {
//   FaEnvelope,
//   FaLock,
//   FaCalendarAlt,
//   FaMapMarkerAlt,
//   FaPhone,
//   FaUser,
// } from "react-icons/fa";
// import axios from "axios";
// import { AuthContext } from "../../AuthContext/AuthContext";

// const MyProfileComponent = () => {
//   const { token } = useContext(AuthContext);
//   const [profile, setProfile] = useState(null);

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const response = await axios.get(
//           "http://localhost:4000/api/v1/get-profile-details",
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//             withCredentials: true,
//           }
//         );
//         setProfile(response.data.data);
//       } catch (error) {
//         console.error("Failed to fetch profile:", error);
//       }
//     };

//     if (token) {
//       fetchProfile();
//     }
//   }, [token]);

//   if (!profile) {
//     return <div className="text-center mt-16">Loading profile...</div>;
//   }

//   const { name, email, gender, dateOfBirth, contactNumber, address } = profile;

//   return (
//     <div className="max-w-6xl mx-auto my-10 p-4">
//       {/* Header Card */}
//       <div className="flex justify-between items-center p-6 rounded-xl shadow-xl bg-white">
//         <div className="flex items-center gap-6">
//           <div className="w-32 h-32 rounded-full bg-white shadow-xl flex items-center justify-center text-5xl text-green-500">
//             <FaUser />
//           </div>
//           <div>
//             <h1 className="text-3xl font-bold text-green-900">{name}</h1>
//             <p className="text-sm text-gray-600 mt-1">{email}</p>
//             <div className="mt-2 inline-block bg-white text-green-600 font-medium text-sm px-4 py-1 rounded-full shadow">
//               {gender || "Not specified"}
//             </div>
//           </div>
//         </div>
//         <button className="bg-white px-5 py-2 rounded-md text-green-600 font-medium shadow hover:bg-green-50 flex items-center gap-2">
//           <FaUser className="text-green-600" />
//           Edit Profile
//         </button>
//       </div>

//       {/* Information Grid */}
//       <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
//         {/* Personal Info */}
//         <div className="bg-white rounded-xl shadow-xl p-6">
//           <h2 className="text-2xl font-semibold text-green-900 mb-4">
//             Personal Information
//           </h2>
//           <div className="space-y-4">
//             <div className="p-4 rounded-md bg-white shadow">
//               <label className="text-sm text-green-700 block mb-1">Name</label>
//               <div className="flex items-center gap-2 font-medium text-green-900">
//                 <FaUser /> {name}
//               </div>
//             </div>
//             <div className="p-4 rounded-md bg-white shadow">
//               <label className="text-sm text-green-700 block mb-1">Email Address</label>
//               <div className="flex items-center gap-2 font-medium text-green-900">
//                 <FaEnvelope /> {email}
//               </div>
//             </div>
//             <div className="p-4 rounded-md bg-white shadow">
//               <label className="text-sm text-green-700 block mb-1">Password</label>
//               <div className="flex items-center gap-2 font-medium text-green-900">
//                 <FaLock /> ********
//                 <button className="ml-auto text-blue-500 text-sm hover:underline">
//                   Change
//                 </button>
//               </div>
//             </div>
//             <div className="p-4 rounded-md bg-white shadow">
//               <label className="text-sm text-green-700 block mb-1">Date of Birth</label>
//               <div className="flex items-center gap-2 font-medium text-green-900">
//                 <FaCalendarAlt /> {dateOfBirth || "Not specified"}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Contact Info */}
//         <div className="bg-white rounded-xl shadow-xl p-6">
//           <h2 className="text-2xl font-semibold text-green-900 mb-4">
//             Contact Information
//           </h2>
//           <div className="space-y-4">
//             <div className="p-4 rounded-md bg-white shadow">
//               <label className="text-sm text-green-700 block mb-1">Phone Number</label>
//               <div className="flex items-center gap-2 font-medium text-green-900">
//                 <FaPhone /> {contactNumber || "Not specified"}
//               </div>
//             </div>
//             <div className="p-4 rounded-md bg-white shadow">
//               <label className="text-sm text-green-700 block mb-1">Address</label>
//               <div className="flex items-center gap-2 font-medium text-green-900">
//                 <FaMapMarkerAlt /> {address || "Not specified"}
//               </div>
//             </div>
//             <div className="p-4 rounded-md bg-white shadow">
//               <label className="text-sm text-green-700 block mb-1">Account Status</label>
//               <div className="flex items-center gap-2 font-medium text-green-900">
//                 <span className="w-2 h-2 bg-green-500 rounded-full"></span>
//                 Active Account
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MyProfileComponent;

import { useState } from 'react';
import axios from 'axios';

const RegisterBikeForm = () => {
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    const formData = new FormData();
    formData.append('company', form.company.value);
    formData.append('model', form.model.value);
    formData.append('age', form.age.value);
    formData.append('thumbnail', form.thumbnail.files[0]);
    formData.append('ownershipProof', form.ownershipProof.files[0]);

    try {
      const response = await axios.post(
        'http://localhost:4000/api/v1/register-bike', 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true, 
        }
      );

      alert('Bike registered successfully!');
      console.log('Registered bike:', response.data);
      form.reset();
      setShowForm(false);
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert(`Failed to register bike: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="mb-8 text-center">
      <button
        onClick={() => setShowForm(!showForm)}
        className="bg-green-400 hover:bg-green-500 text-white font-semibold py-2 px-6 rounded-full"
      >
        {showForm ? 'Cancel' : 'Register New Bike'}
      </button>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mt-6 bg-green-50 p-6 rounded-xl shadow-[10px_0_15px_rgba(0,0,0,0.1),_-10px_0_15px_rgba(0,0,0,0.1),_0_10px_20px_rgba(0,0,0,0.1)] max-w-lg mx-auto text-left"
        >
          <h2 className="text-2xl font-bold text-green-900 mb-4">Register New Bike</h2>

          <div className="mb-4">
            <label className="block mb-1 font-medium">Company</label>
            <input
              type="text"
              name="company"
              placeholder="e.g., Trek, Giant, Specialized"
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-medium">Model</label>
            <input
              type="text"
              name="model"
              placeholder="e.g., Mountain Bike 3000"
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-medium">Age (years)</label>
            <input
              type="number"
              name="age"
              placeholder="e.g., 2"
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-medium">Thumbnail</label>
            <input
              type="file"
              name="thumbnail"
              accept="image/*"
              className="w-full p-2 border border-gray-300 rounded bg-white"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-medium">Ownership Proof</label>
            <input
              type="file"
              name="ownershipProof"
              accept=".pdf,image/*"
              className="w-full p-2 border border-gray-300 rounded bg-white"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              Please upload a document proving your ownership (receipt, invoice, etc.)
            </p>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="border border-gray-400 text-gray-700 rounded px-4 py-2 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-400 hover:bg-green-500 text-white font-semibold py-2 px-6 rounded"
            >
              Register Bike
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default RegisterBikeForm;

// import { useState } from 'react';

// const RegisterBikeForm = ({ addBike }) => {
//   const [showForm, setShowForm] = useState(false);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const form = e.target;

//     const newBike = {
//       id: Date.now(),
//       company: form.company.value,
//       model: form.model.value,
//       age: form.age.value,
//       thumbnail: form.thumbnail.files[0]?.name || 'No file',
//       ownershipProof: form.ownershipProof.files[0]?.name || 'No file',
//     };

//     addBike(newBike);
//     form.reset();
//     setShowForm(false);
//   };

//   return (
//     <div className="mb-8 text-center">
//       <button
//         onClick={() => setShowForm(!showForm)}
//         className="bg-green-400 hover:bg-green-500 text-white font-semibold py-2 px-6 rounded-full"
//       >
//         {showForm ? 'Cancel' : 'Register New Bike'}
//       </button>

//       {showForm && (
//         <form
//           onSubmit={handleSubmit}
//           className="mt-6 bg-green-50 p-6 rounded-xl shadow-[10px_0_15px_rgba(0,0,0,0.1),_-10px_0_15px_rgba(0,0,0,0.1),_0_10px_20px_rgba(0,0,0,0.1)] max-w-lg mx-auto text-left"
//         >
//           <h2 className="text-2xl font-bold text-green-900 mb-4">Register New Bike</h2>

//           <div className="mb-4">
//             <label className="block mb-1 font-medium">Company</label>
//             <input
//               type="text"
//               name="company"
//               placeholder="e.g., Trek, Giant, Specialized"
//               className="w-full p-2 border border-gray-300 rounded"
//               required
//             />
//           </div>

//           <div className="mb-4">
//             <label className="block mb-1 font-medium">Model</label>
//             <input
//               type="text"
//               name="model"
//               placeholder="e.g., Mountain Bike 3000"
//               className="w-full p-2 border border-gray-300 rounded"
//               required
//             />
//           </div>

//           <div className="mb-4">
//             <label className="block mb-1 font-medium">Age (years)</label>
//             <input
//               type="number"
//               name="age"
//               placeholder="e.g., 2"
//               className="w-full p-2 border border-gray-300 rounded"
//               required
//             />
//           </div>

//           <div className="mb-4">
//             <label className="block mb-1 font-medium">Thumbnail</label>
//             <input
//               type="file"
//               name="thumbnail"
//               accept="image/*"
//               className="w-full p-2 border border-gray-300 rounded bg-white"
//             />
//           </div>

//           <div className="mb-4">
//             <label className="block mb-1 font-medium">Ownership Proof</label>
//             <input
//               type="file"
//               name="ownershipProof"
//               accept=".pdf,image/*"
//               className="w-full p-2 border border-gray-300 rounded bg-white"
//             />
//             <p className="text-sm text-gray-500 mt-1">
//               Please upload a document proving your ownership (receipt, invoice, etc.)
//             </p>
//           </div>

//           <div className="flex justify-end gap-4 mt-6">
//             <button
//               type="button"
//               onClick={() => setShowForm(false)}
//               className="border border-gray-400 text-gray-700 rounded px-4 py-2 hover:bg-gray-100"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="bg-green-400 hover:bg-green-500 text-white font-semibold py-2 px-6 rounded"
//             >
//               Register Bike
//             </button>
//           </div>
//         </form>
//       )}
//     </div>
//   );
// };

// export default RegisterBikeForm;

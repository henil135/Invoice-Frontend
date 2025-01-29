// import React, { useState } from 'react';
// import Select from "react-select";
// import { Country, State, City } from "country-state-city";

// const ChangePassword = () => {
//   const [currentPassword, setCurrentPassword] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     setSuccess('');
//     setError('');

//     if (!currentPassword || !newPassword || !confirmPassword) {
//       setError('Please fill in all fields.');
//       return;
//     }

//     if (newPassword !== confirmPassword) {
//       setError('New password and confirm password must match.');
//       return;
//     }

//     try {
//       const token = localStorage.getItem('token'); // Retrieve token from localStorage

//       const response = await fetch('http://localhost:8001/api/user/changePassword', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded',
//           Authorization: `Bearer ${token}`,
//         },
//         body: new URLSearchParams({
//           oldPassword: currentPassword,
//           newPassword: newPassword,
//           confirmPassword: confirmPassword,
//         }).toString(),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         setError(errorData.message || 'Failed to change password.');
//         return;
//       }

//       const result = await response.json();
//       setSuccess(result.message || 'Password changed successfully.');
//       setCurrentPassword('');
//       setNewPassword('');
//       setConfirmPassword('');
//     } catch (error) {
//       console.error('Error changing password:', error);
//       setError('An error occurred. Please try again.');
//     }
//   };

//   return (
//     <div className="max-w-xl mt-10 p-5 bg-white shadow-md rounded-lg">
//       <h2 className="text-2xl font-bold  text-gray-700 mb-3">Change Password</h2>
//       <p className="text-sm text-gray-600 mb-4">
//       To change your password, please fill in the fields below. Your password must contain at least 8 characters, it must also include at least one upper case letter, one lower case letter, one number and one special  character.
//       </p>
//       {error && (
//         <div className="mb-4 text-sm text-red-600 bg-red-100 p-3 rounded-lg">
//           {error}
//         </div>
//       )}

//       {success && (
//         <div className="mb-4 text-sm text-green-600 bg-green-100 p-3 rounded-lg">
//           {success}
//         </div>
//       )}

//       <form onSubmit={handleSubmit}>
//         <div className="mb-4">
//           <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
//             Current Password
//           </label>
//           <input
//             type="password"
//             id="currentPassword"
//             value={currentPassword}
//             onChange={(e) => setCurrentPassword(e.target.value)}
//             required
//             className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
//             placeholder="Enter current password"
//           />
//         </div>

//         <div className="mb-4">
//           <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
//             New Password
//           </label>
//           <input
//             type="password"
//             id="newPassword"
//             value={newPassword}
//             onChange={(e) => setNewPassword(e.target.value)}
//             required
//             className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
//             placeholder="Enter new password"
//           />
//         </div>

//         <div className="mb-6">
//           <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
//             Confirm Password
//           </label>
//           <input
//             type="password"
//             id="confirmPassword"
//             value={confirmPassword}
//             onChange={(e) => setConfirmPassword(e.target.value)}
//             required
//             className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
//             placeholder="Confirm new password"
//           />
//         </div>

//         <div className="text-left">
//           <button
//             type="submit"
//             className="w-full px-4 py-2 text-white bg-[#438A7A] rounded-lg"
//           >
//             Change Password
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default ChangePassword;
import React, { useState } from 'react';
import Swal from 'sweetalert2'; // Import SweetAlert2

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset SweetAlert2 popups
    Swal.close();

    if (!currentPassword || !newPassword || !confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Oops!',
        text: 'Please fill in all fields.',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Oops!',
        text: 'New password and confirm password must match.',
      });
      return;
    }

    try {
      const token = localStorage.getItem('token'); // Retrieve token from localStorage

      const response = await fetch('http://localhost:8001/api/user/changePassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Bearer ${token}`,
        },
        body: new URLSearchParams({
          oldPassword: currentPassword,
          newPassword: newPassword,
          confirmPassword: confirmPassword,
        }).toString(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: errorData.message || 'Failed to change password.',
        });
        return;
      }

      const result = await response.json();
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: result.message || 'Password changed successfully.',
      });

      // Reset fields after successful password change
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error changing password:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred. Please try again.',
      });
    }
  };

  return (
    <div className="max-w-xl mt-10 p-5 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold  text-gray-700 mb-3">Change Password</h2>
      <p className="text-sm text-gray-600 mb-4">
        To change your password, please fill in the fields below. Your password must contain at least 8 characters, it must also include at least one upper case letter, one lower case letter, one number, and one special character.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
            Current Password
          </label>
          <input
            type="password"
            id="currentPassword"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter current password"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
            New Password
          </label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter new password"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Confirm new password"
          />
        </div>

        <div className="text-left">
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-[#438A7A] rounded-lg"
          >
            Change Password
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;


// import React, { useState, useEffect, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../../utils/api";
// import { AuthContext } from "../../context/AuthContextProvider";

// const SystemAdministrator = () => {
//   const { loginStatus } = useContext(AuthContext);
//   const navigate = useNavigate();

//   // State for dashboard stats
//   const [dashboard, setDashboard] = useState({
//     totalUsers: 0,
//     totalStores: 0,
//     totalRatings: 0,
//   });

//   // State for user form
//   const [userForm, setUserForm] = useState({
//     name: "",
//     email: "",
//     address: "",
//     password: "",
//     role: "user",
//   });
//   const [userErrors, setUserErrors] = useState({});

//   // State for store form
//   const [storeForm, setStoreForm] = useState({
//     name: "",
//     email: "",
//     address: "",
//     store_owner_id: "",
//   });
//   const [storeErrors, setStoreErrors] = useState({});

//   // State for lists and filters
//   const [users, setUsers] = useState([]);
//   const [stores, setStores] = useState([]);
//   const [userFilters, setUserFilters] = useState({ name: "", email: "", address: "", role: "" });
//   const [storeFilters, setStoreFilters] = useState({ name: "", address: "" });
//   const [userSort, setUserSort] = useState({ sortBy: "name", sortOrder: "ASC" });
//   const [storeSort, setStoreSort] = useState({ sortBy: "name", sortOrder: "ASC" });

//   // Fetch dashboard data
//   useEffect(() => {
//     if (loginStatus.role !== "system_administrator") {
//       navigate("/login");
//       return;
//     }
//     const fetchDashboard = async () => {
//       try {
//         const res = await api.get("/api/admin/dashboard");
//         setDashboard(res.data);
//       } catch (error) {
//         console.error(error);
//         alert("Failed to fetch dashboard data");
//       }
//     };
//     fetchDashboard();
//   }, [loginStatus.role, navigate]);

//   // Fetch users with filters and sorting
//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const params = new URLSearchParams({ ...userFilters, ...userSort });
//         const res = await api.get(`/api/user?${params}`);
//         setUsers(res.data);
//         console.log(res.data);
        
//       } catch (error) {
//         console.error(error);
//         alert("Failed to fetch users");
//       }
//     };
//     fetchUsers();
//   }, [userFilters, userSort]);

//   // Fetch stores with filters and sorting
//   useEffect(() => {
//     const fetchStores = async () => {
//       try {
//         const params = new URLSearchParams({ ...storeFilters, ...storeSort });
//         const res = await api.get(`/api/stores?${params}`);
//         setStores(res.data);
//       } catch (error) {
//         console.error(error);
//         alert("Failed to fetch stores");
//       }
//     };
//     fetchStores();
//   }, [storeFilters, storeSort]);

//   // Handle user form submission
//   const validateUserForm = () => {
//     const errors = {};
//     if (userForm.name.length < 20 || userForm.name.length > 60) {
//       errors.name = "Name must be 20-60 characters";
//     }
//     if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(userForm.email)) {
//       errors.email = "Invalid email";
//     }
//     if (userForm.address && userForm.address.length > 400) {
//       errors.address = "Address must be under 400 characters";
//     }
//     if (
//       userForm.password.length < 8 ||
//       userForm.password.length > 16 ||
//       !/[A-Z]/.test(userForm.password) ||
//       !/[!@#$%^&*]/.test(userForm.password)
//     ) {
//       errors.password =
//         "Password must be 8-16 characters, include uppercase and special character";
//     }
//     if (!["user", "store_owner", "system_administrator"].includes(userForm.role)) {
//       errors.role = "Invalid role";
//     }
//     return errors;
//   };

//   const handleUserSubmit = async (e) => {
//     e.preventDefault();
//     const errors = validateUserForm();
//     if (Object.keys(errors).length > 0) {
//       setUserErrors(errors);
//       return;
//     }
//     try {
//       await api.post(
//         loginStatus.role === "system_administrator"
//           ? "/api/user/signup/system_administrator"
//           : "/api/user/signup",
//         userForm
//       );
//       alert("User added successfully");
//       setUserForm({ name: "", email: "", address: "", password: "", role: "user" });
//       setUserErrors({});
//       // Refresh user list
//       const params = new URLSearchParams({ ...userFilters, ...userSort });
//       const res = await api.get(`/api/user?${params}`);
//       setUsers(res.data);
//     } catch (error) {
//       console.error(error);
//       alert(error.response?.data?.message || "Failed to add user");
//     }
//   };

//   // Handle store form submission
//   const validateStoreForm = () => {
//     const errors = {};
//     if (storeForm.name.length < 20 || storeForm.name.length > 60) {
//       errors.name = "Name must be 20-60 characters";
//     }
//     if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(storeForm.email)) {
//       errors.email = "Invalid email";
//     }
//     if (storeForm.address && storeForm.address.length > 400) {
//       errors.address = "Address must be under 400 characters";
//     }
//     return errors;
//   };

//   const handleStoreSubmit = async (e) => {
//     e.preventDefault();
//     const errors = validateStoreForm();
//     if (Object.keys(errors).length > 0) {
//       setStoreErrors(errors);
//       return;
//     }
//     try {
//       await api.post("/api/stores/addstore", storeForm);
//       alert("Store added successfully");
//       setStoreForm({ name: "", email: "", address: "", owner_id: "" });
//       setStoreErrors({});
//       // Refresh store list
//       const params = new URLSearchParams({ ...storeFilters, ...storeSort });
//       const res = await api.get(`/api/stores?${params}`);
//       setStores(res.data);
//     } catch (error) {
//       console.error(error);
//       alert(error.response?.data?.message || "Failed to add store");
//     }
//   };

//   // Handle filter changes
//   const handleUserFilterChange = (e) => {
//     setUserFilters({ ...userFilters, [e.target.name]: e.target.value });
//   };

//   const handleStoreFilterChange = (e) => {
//     setStoreFilters({ ...storeFilters, [e.target.name]: e.target.value });
//   };

//   // Handle sort changes
//   const handleUserSortChange = (e) => {
//     const [sortBy, sortOrder] = e.target.value.split(":");
//     setUserSort({ sortBy, sortOrder });
//   };

//   const handleStoreSortChange = (e) => {
//     const [sortBy, sortOrder] = e.target.value.split(":");
//     setStoreSort({ sortBy, sortOrder });
//   };

//   if (!loginStatus || loginStatus.role !== "system_administrator") {
//     return <div>Please log in as a system administrator</div>;
//   }

//   return (
//     <div className="container mx-auto p-6 max-w-7xl">
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-3xl font-bold text-gray-800">System Administrator Dashboard</h1>
//       </div>

//       {/* Dashboard Stats */}
//       <section className="mb-10 bg-white p-6 rounded-lg shadow-md border border-gray-200">
//         <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Dashboard Overview</h2>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
//             <p className="text-sm text-blue-600 font-medium">Total Users</p>
//             <p className="text-3xl font-bold text-blue-800">{dashboard.totalUsers}</p>
//           </div>
//           <div className="bg-green-50 p-4 rounded-lg border border-green-100">
//             <p className="text-sm text-green-600 font-medium">Total Stores</p>
//             <p className="text-3xl font-bold text-green-800">{dashboard.totalStores}</p>
//           </div>
//           <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
//             <p className="text-sm text-purple-600 font-medium">Total Ratings</p>
//             <p className="text-3xl font-bold text-purple-800">{dashboard.totalRatings}</p>
//           </div>
//         </div>
//       </section>

//       {/* Add User Form */}
//       <section className="mb-10 bg-white p-6 rounded-lg shadow-md border border-gray-200">
//         <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Add New User</h2>
//         <form onSubmit={handleUserSubmit} className="space-y-4 max-w-lg">
//           <div>
//             <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
//             <input
//               type="text"
//               id="name"
//               name="name"
//               placeholder="Name (20-60 characters)"
//               value={userForm.name}
//               onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               required
//             />
//             {userErrors.name && <p className="mt-1 text-sm text-red-600">{userErrors.name}</p>}
//           </div>
          
//           <div>
//             <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
//             <input
//               type="email"
//               id="email"
//               name="email"
//               placeholder="Email address"
//               value={userForm.email}
//               onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               required
//             />
//             {userErrors.email && <p className="mt-1 text-sm text-red-600">{userErrors.email}</p>}
//           </div>
          
//           <div>
//             <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
//             <input
//               type="text"
//               id="address"
//               name="address"
//               placeholder="Address (max 400 characters)"
//               value={userForm.address}
//               onChange={(e) => setUserForm({ ...userForm, address: e.target.value })}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             {userErrors.address && <p className="mt-1 text-sm text-red-600">{userErrors.address}</p>}
//           </div>
          
//           <div>
//             <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
//             <input
//               type="password"
//               id="password"
//               name="password"
//               placeholder="Password (8-16 chars, uppercase, special)"
//               value={userForm.password}
//               onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               required
//             />
//             {userErrors.password && <p className="mt-1 text-sm text-red-600">{userErrors.password}</p>}
//           </div>
          
//           <div>
//             <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Role</label>
//             <select
//               id="role"
//               name="role"
//               value={userForm.role}
//               onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="user">Normal User</option>
//               <option value="store_owner">Store Owner</option>
//               <option value="system_administrator">system_administrator</option>
//             </select>
//             {userErrors.role && <p className="mt-1 text-sm text-red-600">{userErrors.role}</p>}
//           </div>
          
//           <button 
//             type="submit" 
//             className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors font-medium"
//           >
//             Add User
//           </button>
//         </form>
//       </section>

//       {/* Add Store Form */}
//       <section className="mb-10 bg-white p-6 rounded-lg shadow-md border border-gray-200">
//         <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Add New Store</h2>
//         <form onSubmit={handleStoreSubmit} className="space-y-4 max-w-lg">
//           <div>
//             <label htmlFor="storeName" className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
//             <input
//               type="text"
//               id="storeName"
//               name="name"
//               placeholder="Store Name (20-60 characters)"
//               value={storeForm.name}
//               onChange={(e) => setStoreForm({ ...storeForm, name: e.target.value })}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               required
//             />
//             {storeErrors.name && <p className="mt-1 text-sm text-red-600">{storeErrors.name}</p>}
//           </div>
          
//           <div>
//             <label htmlFor="storeEmail" className="block text-sm font-medium text-gray-700 mb-1">Store Email</label>
//             <input
//               type="email"
//               id="storeEmail"
//               name="email"
//               placeholder="Store Email"
//               value={storeForm.email}
//               onChange={(e) => setStoreForm({ ...storeForm, email: e.target.value })}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               required
//             />
//             {storeErrors.email && <p className="mt-1 text-sm text-red-600">{storeErrors.email}</p>}
//           </div>
          
//           <div>
//             <label htmlFor="storeAddress" className="block text-sm font-medium text-gray-700 mb-1">Store Address</label>
//             <input
//               type="text"
//               id="storeAddress"
//               name="address"
//               placeholder="Store Address (max 400 characters)"
//               value={storeForm.address}
//               onChange={(e) => setStoreForm({ ...storeForm, address: e.target.value })}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             {storeErrors.address && <p className="mt-1 text-sm text-red-600">{storeErrors.address}</p>}
//           </div>
          
//           <div>
//             <label htmlFor="ownerId" className="block text-sm font-medium text-gray-700 mb-1">Owner ID</label>
//             <input
//               type="number"
//               id="ownerId"
//               name="owner_id"
//               placeholder="Owner ID (optional)"
//               value={storeForm.owner_id}
//               onChange={(e) => setStoreForm({ ...storeForm, owner_id: e.target.value })}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
          
//           <button 
//             type="submit" 
//             className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition-colors font-medium"
//           >
//             Add Store
//           </button>
//         </form>
//       </section>

//       {/* User List with Filters */}
//       <section className="mb-10 bg-white p-6 rounded-lg shadow-md border border-gray-200">
//         <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Users</h2>
        
//         <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
//           <div>
//             <label htmlFor="nameFilter" className="block text-xs font-medium text-gray-500 mb-1">Filter by Name</label>
//             <input
//               type="text"
//               id="nameFilter"
//               name="name"
//               placeholder="Filter by Name"
//               value={userFilters.name}
//               onChange={handleUserFilterChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//             />
//           </div>
          
//           <div>
//             <label htmlFor="emailFilter" className="block text-xs font-medium text-gray-500 mb-1">Filter by Email</label>
//             <input
//               type="text"
//               id="emailFilter"
//               name="email"
//               placeholder="Filter by Email"
//               value={userFilters.email}
//               onChange={handleUserFilterChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//             />
//           </div>
          
//           <div>
//             <label htmlFor="addressFilter" className="block text-xs font-medium text-gray-500 mb-1">Filter by Address</label>
//             <input
//               type="text"
//               id="addressFilter"
//               name="address"
//               placeholder="Filter by Address"
//               value={userFilters.address}
//               onChange={handleUserFilterChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//             />
//           </div>
          
//           <div>
//             <label htmlFor="roleFilter" className="block text-xs font-medium text-gray-500 mb-1">Filter by Role</label>
//             <select 
//               id="roleFilter"
//               name="role" 
//               value={userFilters.role} 
//               onChange={handleUserFilterChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//             >
//               <option value="">All Roles</option>
//               <option value="user">Normal User</option>
//               <option value="store_owner">Store Owner</option>
//               <option value="system_administrator">system_administrator</option>
//             </select>
//           </div>
          
//           <div>
//             <label htmlFor="userSort" className="block text-xs font-medium text-gray-500 mb-1">Sort By</label>
//             <select 
//               id="userSort"
//               onChange={handleUserSortChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//             >
//               <option value="name:ASC">Name (A-Z)</option>
//               <option value="name:DESC">Name (Z-A)</option>
//               <option value="email:ASC">Email (A-Z)</option>
//               <option value="email:DESC">Email (Z-A)</option>
//               <option value="address:ASC">Address (A-Z)</option>
//               <option value="address:DESC">Address (Z-A)</option>
//               <option value="role:ASC">Role (A-Z)</option>
//               <option value="role:DESC">Role (Z-A)</option>
//             </select>
//           </div>
//         </div>
        
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {users.length === 0 ? (
//                 <tr>
//                   <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">No users found</td>
//                 </tr>
//               ) : (
//                 users.map((u) => (
//                   <tr key={u.id} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{u.name}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.email}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.address || "N/A"}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${u.role === 'system_administrator' ? 'bg-purple-100 text-purple-800' : u.role === 'store_owner' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
//                         {u.role}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {u.role === "store_owner" ? (
//                         u.average_rating && !isNaN(parseFloat(u.average_rating)) ? (
//                           <span className="inline-flex items-center">
//                             <span className="text-yellow-500 mr-1">★</span>
//                             {parseFloat(u.average_rating).toFixed(2)}
//                           </span>
//                         ) : "N/A"
//                       ) : "N/A"}
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </section>

//       {/* Store List with Filters */}
//       <section className="mb-10 bg-white p-6 rounded-lg shadow-md border border-gray-200">
//         <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Stores</h2>
        
//         <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
//           <div>
//             <label htmlFor="storeNameFilter" className="block text-xs font-medium text-gray-500 mb-1">Filter by Name</label>
//             <input
//               type="text"
//               id="storeNameFilter"
//               name="name"
//               placeholder="Filter by Name"
//               value={storeFilters.name}
//               onChange={handleStoreFilterChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//             />
//           </div>
          
//           <div>
//             <label htmlFor="storeAddressFilter" className="block text-xs font-medium text-gray-500 mb-1">Filter by Address</label>
//             <input
//               type="text"
//               id="storeAddressFilter"
//               name="address"
//               placeholder="Filter by Address"
//               value={storeFilters.address}
//               onChange={handleStoreFilterChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//             />
//           </div>
          
//           <div>
//             <label htmlFor="storeSort" className="block text-xs font-medium text-gray-500 mb-1">Sort By</label>
//             <select 
//               id="storeSort"
//               onChange={handleStoreSortChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//             >
//               <option value="name:ASC">Name (A-Z)</option>
//               <option value="name:DESC">Name (Z-A)</option>
//               <option value="email:ASC">Email (A-Z)</option>
//               <option value="email:DESC">Email (Z-A)</option>
//               <option value="address:ASC">Address (A-Z)</option>
//               <option value="address:DESC">Address (Z-A)</option>
//               <option value="overall_rating:ASC">Rating (Low-High)</option>
//               <option value="overall_rating:DESC">Rating (High-Low)</option>
//             </select>
//           </div>
//         </div>
        
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {stores.length === 0 ? (
//                 <tr>
//                   <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">No stores found</td>
//                 </tr>
//               ) : (
//                 stores.map((s) => (
//                   <tr key={s.id} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{s.name}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{s.email}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{s.address || "N/A"}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {s.overall_rating && !isNaN(parseFloat(s.overall_rating)) ? (
//                         <span className="inline-flex items-center">
//                           <span className="text-yellow-500 mr-1">★</span>
//                           {parseFloat(s.overall_rating).toFixed(2)}
//                         </span>
//                       ) : "N/A"}
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default SystemAdministrator;

import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import { AuthContext } from "../../context/AuthContextProvider";

const SystemAdministrator = () => {
  const { loginStatus } = useContext(AuthContext);
  const navigate = useNavigate();

  // State for dashboard stats
  const [dashboard, setDashboard] = useState({
    totalUsers: 0,
    totalStores: 0,
    totalRatings: 0,
  });

  // State for user form
  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
    role: "user",
  });
  const [userErrors, setUserErrors] = useState({});

  // State for store form
  const [storeForm, setStoreForm] = useState({
    name: "",
    email: "",
    address: "",
    store_owner_id: "",
  });
  const [storeErrors, setStoreErrors] = useState({});

  // State for lists and filters
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [userFilters, setUserFilters] = useState({ name: "", email: "", address: "", role: "" });
  const [storeFilters, setStoreFilters] = useState({ name: "", address: "" });
  const [userSort, setUserSort] = useState({ sortBy: "name", sortOrder: "ASC" });
  const [storeSort, setStoreSort] = useState({ sortBy: "name", sortOrder: "ASC" });

  // Fetch dashboard data
  useEffect(() => {
    if (loginStatus.role !== "system_administrator") {
      navigate("/login");
      return;
    }
    const fetchDashboard = async () => {
      try {
        const res = await api.get("/api/admin/dashboard");
        setDashboard(res.data);
      } catch (error) {
        console.error(error);
        alert("Failed to fetch dashboard data");
      }
    };
    fetchDashboard();
  }, [loginStatus.role, navigate]);

  // Fetch users with filters and sorting
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const params = new URLSearchParams({ ...userFilters, ...userSort });
        const res = await api.get(`/api/user?${params}`);
        setUsers(res.data);
        console.log(res.data);
        
      } catch (error) {
        console.error(error);
        alert("Failed to fetch users");
      }
    };
    fetchUsers();
  }, [userFilters, userSort]);

  // Fetch stores with filters and sorting
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const params = new URLSearchParams({ ...storeFilters, ...storeSort });
        const res = await api.get(`/api/stores?${params}`);
        setStores(res.data);
      } catch (error) {
        console.error(error);
        alert("Failed to fetch stores");
      }
    };
    fetchStores();
  }, [storeFilters, storeSort]);

  // Handle user form submission
  const validateUserForm = () => {
    const errors = {};
    if (userForm.name.length < 20 || userForm.name.length > 60) {
      errors.name = "Name must be 20-60 characters";
    }
    if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(userForm.email)) {
      errors.email = "Invalid email";
    }
    if (userForm.address && userForm.address.length > 400) {
      errors.address = "Address must be under 400 characters";
    }
    if (
      userForm.password.length < 8 ||
      userForm.password.length > 16 ||
      !/[A-Z]/.test(userForm.password) ||
      !/[!@#$%^&*]/.test(userForm.password)
    ) {
      errors.password =
        "Password must be 8-16 characters, include uppercase and special character";
    }
    if (!["user", "store_owner", "system_administrator"].includes(userForm.role)) {
      errors.role = "Invalid role";
    }
    return errors;
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    const errors = validateUserForm();
    if (Object.keys(errors).length > 0) {
      setUserErrors(errors);
      return;
    }
    try {
      await api.post(
        loginStatus.role === "system_administrator"
          ? "/api/user/signup/system_administrator"
          : "/api/user/signup",
        userForm
      );
      alert("User added successfully");
      setUserForm({ name: "", email: "", address: "", password: "", role: "user" });
      setUserErrors({});
      // Refresh user list
      const params = new URLSearchParams({ ...userFilters, ...userSort });
      const res = await api.get(`/api/user?${params}`);
      setUsers(res.data);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to add user");
    }
  };

  // Handle store form submission
  const validateStoreForm = () => {
    const errors = {};
    if (storeForm.name.length < 20 || storeForm.name.length > 60) {
      errors.name = "Name must be 20-60 characters";
    }
    if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(storeForm.email)) {
      errors.email = "Invalid email";
    }
    if (storeForm.address && storeForm.address.length > 400) {
      errors.address = "Address must be under 400 characters";
    }
    return errors;
  };

  const handleStoreSubmit = async (e) => {
    e.preventDefault();
    const errors = validateStoreForm();
    if (Object.keys(errors).length > 0) {
      setStoreErrors(errors);
      return;
    }
    try {
      await api.post("/api/stores/addstore", storeForm);
      alert("Store added successfully");
      setStoreForm({ name: "", email: "", address: "", owner_id: "" });
      setStoreErrors({});
      // Refresh store list
      const params = new URLSearchParams({ ...storeFilters, ...storeSort });
      const res = await api.get(`/api/stores?${params}`);
      setStores(res.data);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to add store");
    }
  };

  // Handle filter changes
  const handleUserFilterChange = (e) => {
    setUserFilters({ ...userFilters, [e.target.name]: e.target.value });
  };

  const handleStoreFilterChange = (e) => {
    setStoreFilters({ ...storeFilters, [e.target.name]: e.target.value });
  };

  // Handle sort changes
  const handleUserSortChange = (e) => {
    const [sortBy, sortOrder] = e.target.value.split(":");
    setUserSort({ sortBy, sortOrder });
  };

  const handleStoreSortChange = (e) => {
    const [sortBy, sortOrder] = e.target.value.split(":");
    setStoreSort({ sortBy, sortOrder });
  };

  if (!loginStatus || loginStatus.role !== "system_administrator") {
    return <div>Please log in as a system administrator</div>;
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">System Administrator Dashboard</h1>
      </div>

      {/* Dashboard Stats */}
      <section className="mb-10 bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Dashboard Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <p className="text-sm text-blue-600 font-medium">Total Users</p>
            <p className="text-3xl font-bold text-blue-800">{dashboard.totalUsers}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
            <p className="text-sm text-green-600 font-medium">Total Stores</p>
            <p className="text-3xl font-bold text-green-800">{dashboard.totalStores}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
            <p className="text-sm text-purple-600 font-medium">Total Ratings</p>
            <p className="text-3xl font-bold text-purple-800">{dashboard.totalRatings}</p>
          </div>
        </div>
      </section>

      {/* Add User Form */}
      <section className="mb-10 bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Add New User</h2>
        <form onSubmit={handleUserSubmit} className="space-y-4 max-w-lg">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Name (20-60 characters)"
              value={userForm.name}
              onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {userErrors.name && <p className="mt-1 text-sm text-red-600">{userErrors.name}</p>}
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email address"
              value={userForm.email}
              onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {userErrors.email && <p className="mt-1 text-sm text-red-600">{userErrors.email}</p>}
          </div>
          
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input
              type="text"
              id="address"
              name="address"
              placeholder="Address (max 400 characters)"
              value={userForm.address}
              onChange={(e) => setUserForm({ ...userForm, address: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {userErrors.address && <p className="mt-1 text-sm text-red-600">{userErrors.address}</p>}
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password (8-16 chars, uppercase, special)"
              value={userForm.password}
              onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {userErrors.password && <p className="mt-1 text-sm text-red-600">{userErrors.password}</p>}
          </div>
          
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              id="role"
              name="role"
              value={userForm.role}
              onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="user">Normal User</option>
              <option value="store_owner">Store Owner</option>
              <option value="system_administrator">system_administrator</option>
            </select>
            {userErrors.role && <p className="mt-1 text-sm text-red-600">{userErrors.role}</p>}
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors font-medium"
          >
            Add User
          </button>
        </form>
      </section>

      {/* Add Store Form */}
      <section className="mb-10 bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Add New Store</h2>
        <form onSubmit={handleStoreSubmit} className="space-y-4 max-w-lg">
          <div>
            <label htmlFor="storeName" className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
            <input
              type="text"
              id="storeName"
              name="name"
              placeholder="Store Name (20-60 characters)"
              value={storeForm.name}
              onChange={(e) => setStoreForm({ ...storeForm, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {storeErrors.name && <p className="mt-1 text-sm text-red-600">{storeErrors.name}</p>}
          </div>
          
          <div>
            <label htmlFor="storeEmail" className="block text-sm font-medium text-gray-700 mb-1">Store Email</label>
            <input
              type="email"
              id="storeEmail"
              name="email"
              placeholder="Store Email"
              value={storeForm.email}
              onChange={(e) => setStoreForm({ ...storeForm, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {storeErrors.email && <p className="mt-1 text-sm text-red-600">{storeErrors.email}</p>}
          </div>
          
          <div>
            <label htmlFor="storeAddress" className="block text-sm font-medium text-gray-700 mb-1">Store Address</label>
            <input
              type="text"
              id="storeAddress"
              name="address"
              placeholder="Store Address (max 400 characters)"
              value={storeForm.address}
              onChange={(e) => setStoreForm({ ...storeForm, address: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {storeErrors.address && <p className="mt-1 text-sm text-red-600">{storeErrors.address}</p>}
          </div>
          
          <div>
            <label htmlFor="ownerId" className="block text-sm font-medium text-gray-700 mb-1">Owner ID</label>
            <input
              type="number"
              id="ownerId"
              name="owner_id"
              placeholder="Owner ID (optional)"
              value={storeForm.owner_id}
              onChange={(e) => setStoreForm({ ...storeForm, owner_id: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition-colors font-medium"
          >
            Add Store
          </button>
        </form>
      </section>

      {/* User List with Filters */}
      <section className="mb-10 bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Users</h2>
        
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label htmlFor="nameFilter" className="block text-xs font-medium text-gray-500 mb-1">Filter by Name</label>
            <input
              type="text"
              id="nameFilter"
              name="name"
              placeholder="Filter by Name"
              value={userFilters.name}
              onChange={handleUserFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          
          <div>
            <label htmlFor="emailFilter" className="block text-xs font-medium text-gray-500 mb-1">Filter by Email</label>
            <input
              type="text"
              id="emailFilter"
              name="email"
              placeholder="Filter by Email"
              value={userFilters.email}
              onChange={handleUserFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          
          <div>
            <label htmlFor="addressFilter" className="block text-xs font-medium text-gray-500 mb-1">Filter by Address</label>
            <input
              type="text"
              id="addressFilter"
              name="address"
              placeholder="Filter by Address"
              value={userFilters.address}
              onChange={handleUserFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          
          <div>
            <label htmlFor="roleFilter" className="block text-xs font-medium text-gray-500 mb-1">Filter by Role</label>
            <select 
              id="roleFilter"
              name="role" 
              value={userFilters.role} 
              onChange={handleUserFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="">All Roles</option>
              <option value="user">Normal User</option>
              <option value="store_owner">Store Owner</option>
              <option value="system_administrator">system_administrator</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="userSort" className="block text-xs font-medium text-gray-500 mb-1">Sort By</label>
            <select 
              id="userSort"
              onChange={handleUserSortChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="name:ASC">Name (A-Z)</option>
              <option value="name:DESC">Name (Z-A)</option>
              <option value="email:ASC">Email (A-Z)</option>
              <option value="email:DESC">Email (Z-A)</option>
              <option value="address:ASC">Address (A-Z)</option>
              <option value="address:DESC">Address (Z-A)</option>
              <option value="role:ASC">Role (A-Z)</option>
              <option value="role:DESC">Role (Z-A)</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">No users found</td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{u.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{u.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.address || "N/A"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${u.role === 'system_administrator' ? 'bg-purple-100 text-purple-800' : u.role === 'store_owner' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                        {u.role}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Store List with Filters */}
      <section className="mb-10 bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Stores</h2>
        
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="storeNameFilter" className="block text-xs font-medium text-gray-500 mb-1">Filter by Name</label>
            <input
              type="text"
              id="storeNameFilter"
              name="name"
              placeholder="Filter by Name"
              value={storeFilters.name}
              onChange={handleStoreFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          
          <div>
            <label htmlFor="storeAddressFilter" className="block text-xs font-medium text-gray-500 mb-1">Filter by Address</label>
            <input
              type="text"
              id="storeAddressFilter"
              name="address"
              placeholder="Filter by Address"
              value={storeFilters.address}
              onChange={handleStoreFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          
          <div>
            <label htmlFor="storeSort" className="block text-xs font-medium text-gray-500 mb-1">Sort By</label>
            <select 
              id="storeSort"
              onChange={handleStoreSortChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="name:ASC">Name (A-Z)</option>
              <option value="name:DESC">Name (Z-A)</option>
              <option value="email:ASC">Email (A-Z)</option>
              <option value="email:DESC">Email (Z-A)</option>
              <option value="address:ASC">Address (A-Z)</option>
              <option value="address:DESC">Address (Z-A)</option>
              <option value="overall_rating:ASC">Rating (Low-High)</option>
              <option value="overall_rating:DESC">Rating (High-Low)</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stores.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">No stores found</td>
                </tr>
              ) : (
                stores.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{s.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{s.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{s.address || "N/A"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {s.overall_rating && !isNaN(parseFloat(s.overall_rating)) ? (
                        <span className="inline-flex items-center">
                          <span className="text-yellow-500 mr-1">★</span>
                          {parseFloat(s.overall_rating).toFixed(2)}
                        </span>
                      ) : "N/A"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default SystemAdministrator;
import React, { useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';

const AddEmployeeForm = ({ onBack }) => {
    const [formValues, setFormValues] = useState({
        first_name: '',
        last_name: '',
        email: '',
        role: '',
        birth_date: '',
        phone_number: '',
        profile_picture: null,
        address: '',
        hire_date: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value
        });
    };

    const handleFileChange = (e) => {
        setFormValues({
            ...formValues,
            profile_picture: e.target.files[0]
        });
    };


    const handleSubmit = (e) => {
        e.preventDefault();
    };

    return (
        <div className="bg-white p-6  shadow-md">
            <button 
                type="button" 
                onClick={onBack} 
                className="text-blue-500 text-lg cursor-pointer flex items-center mb-5"
            >
                <FaArrowLeft className="mr-2" /> Back
            </button>
            <h2 className="text-center font-extrabold text-xl text-blue-800 mb-1">Add New Employee</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="first_name" className="block mb-1 text-gray-600">First Name *</label>
                    <input
                        type="text"
                        id="first_name"
                        name="first_name"
                        value={formValues.first_name}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md text-lg"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="last_name" className="block mb-1 text-gray-600">Last Name *</label>
                    <input
                        type="text"
                        id="last_name"
                        name="last_name"
                        value={formValues.last_name}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md text-lg"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="email" className="block mb-1 text-gray-600">Email *</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formValues.email}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md text-lg"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="role" className="block mb-1 text-gray-600">Role *</label>
                    <select
                        id="role"
                        name="role"
                        value={formValues.role}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md text-lg"
                    >
                        <option value="">Select Role</option>
                        <option value="1">Deal Executor</option>
                        <option value="0">Deal Opener</option>
                    </select>
                </div>
                <div className="mb-4">
                    <label htmlFor="birth_date" className="block mb-1 text-gray-600">Birth Date *</label>
                    <input
                        type="date"
                        id="birth_date"
                        name="birth_date"
                        value={formValues.birth_date}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md text-lg"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="phone_number" className="block mb-1 text-gray-600">Phone Number *</label>
                    <input
                        type="text"
                        id="phone_number"
                        name="phone_number"
                        value={formValues.phone_number}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md text-lg"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="profile_picture" className="block mb-1 text-gray-600">Profile Picture *</label>
                    <input
                        type="file"
                        id="profile_picture"
                        name="profile_picture"
                        onChange={handleFileChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md text-lg"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="address" className="block mb-1 text-gray-600">Address (Optional)</label>
                    <textarea
                        id="address"
                        name="address"
                        value={formValues.address}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md text-lg"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="hire_date" className="block mb-1 text-gray-600">Hire Date *</label>
                    <input
                        type="date"
                        id="hire_date"
                        name="hire_date"
                        value={formValues.hire_date}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md text-lg"
                    />
                </div>
                <div className="text-center mt-5">
                    <button
                        type="submit"
                        className="bg-blue-500 text-white py-2 px-4 rounded-md text-lg shadow-md"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddEmployeeForm;

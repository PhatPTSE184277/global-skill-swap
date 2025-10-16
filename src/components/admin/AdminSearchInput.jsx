import React from 'react';
import { FaSearch } from "react-icons/fa";

function AdminSearchInput({ value, onChange, placeholder = "Tìm kiếm thành viên..." }) {
    return (
        <div className="relative w-full">
            <input
                type="text"
                placeholder={placeholder}
                className="pl-10 pr-4 py-2 border border-indigo-200 rounded-xl w-full text-gray-900 font-medium shadow-sm transition-all duration-200 bg-white placeholder-gray-400 
             hover:border-indigo-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                value={value}
                onChange={onChange}
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
    );
}

export default AdminSearchInput;
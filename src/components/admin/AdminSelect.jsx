import React, { useState, useRef, useEffect } from 'react';
import { IoCheckmark, IoChevronDown } from 'react-icons/io5';

function AdminSelect({ value, onChange, options, placeholder = "Chọn...", showIcon = true }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const selectRef = useRef(null);

    useEffect(() => {
        const option = options.find(opt => opt.value === value);
        setSelectedOption(option || null);
    }, [value, options]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (selectRef.current && !selectRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (option) => {
        setSelectedOption(option);
        onChange(option.value);
        setIsOpen(false);
    };

    return (
        <div className="relative z-10" ref={selectRef}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`h-12 cursor-pointer flex items-center justify-between transition-all duration-300 bg-white border border-indigo-200 rounded-xl px-4 shadow-sm ${isOpen ? 'ring-2 ring-indigo-400 border-indigo-400' : ''}`}
            >
                <span className={selectedOption ? 'text-gray-900' : 'text-gray-400'}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                {showIcon && (
                    <div className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                        <IoChevronDown size={20} color="#6366f1" />
                    </div>
                )}
            </div>

            {isOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-indigo-100 rounded-xl overflow-visible z-[999999] animate-slide-up shadow-2xl">
                    {options.map((option, index) => (
                        <div
                            key={option.value}
                            onClick={() => handleSelect(option)}
                            className={`px-4 py-3 cursor-pointer transition-all duration-200 flex items-center justify-between hover:bg-indigo-50 ${selectedOption?.value === option.value
                                ? 'bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-700'
                                : 'text-gray-700'
                                }`}
                            style={{ animationDelay: `${index * 0.05}s` }}
                        >
                            <span className="text-sm font-medium">{option.label}</span>
                            {selectedOption?.value === option.value && (
                                <IoCheckmark size={16} className="text-indigo-500" />
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default AdminSelect;
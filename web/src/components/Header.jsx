import axios from "axios";
import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { HiMenuAlt3, HiX } from "react-icons/hi";

export default function Header() {
    const navigator = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const logoutUser = async () => {
        try {
            const response = await axios.post("/api/v1/user/logout");
            navigator("/register");
        }catch(e) {
            console.log("Error Loging out the user");
        }
    }

    const handleNavClick = () => {
        setIsMenuOpen(false);
    }

    return (
        <nav className="fixed top-0 w-full bg-gradient-to-r from-gray-700 to-gray-600 shadow-lg border-b border-gray-500 z-50">
            <div className="max-w-7xl mx-auto flex flex-row justify-between items-center px-4 md:px-8 py-4">
                {/* Logo/Brand */}
                <Link to="/" className="group flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center group-hover:bg-blue-600 transition duration-200">
                        <span className="text-white font-bold text-lg">M</span>
                    </div>
                    <span className="text-white text-lg md:text-xl font-bold group-hover:text-blue-300 transition duration-200 cursor-pointer hidden sm:inline">MyBlogSite</span>
                </Link>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-white text-2xl cursor-pointer"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <HiX /> : <HiMenuAlt3 />}
                </button>

                {/* Desktop Navigation Links */}
                <div className="hidden md:flex flex-row gap-1 items-center text-white">
                    <Link 
                        to="/create" 
                        className="px-4 py-2 rounded-md transition duration-200 hover:bg-gray-500 hover:text-blue-300 cursor-pointer font-medium"
                    >
                        ✎ Create Blog
                    </Link>
                    <Link 
                        to="/myposts" 
                        className="px-4 py-2 rounded-md transition duration-200 hover:bg-gray-500 hover:text-blue-300 cursor-pointer font-medium"
                    >
                        📝 My Posts
                    </Link>
                    <button 
                        onClick={logoutUser} 
                        className="ml-2 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-md transition duration-200 font-medium cursor-pointer"
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-gray-700 border-t border-gray-600">
                    <div className="flex flex-col gap-2 px-4 py-4">
                        <Link 
                            to="/create" 
                            onClick={handleNavClick}
                            className="px-4 py-2 rounded-md transition duration-200 hover:bg-gray-600 hover:text-blue-300 cursor-pointer font-medium text-white"
                        >
                            ✎ Create Blog
                        </Link>
                        <Link 
                            to="/myposts" 
                            onClick={handleNavClick}
                            className="px-4 py-2 rounded-md transition duration-200 hover:bg-gray-600 hover:text-blue-300 cursor-pointer font-medium text-white"
                        >
                            📝 My Posts
                        </Link>
                        <button 
                            onClick={() => {
                                logoutUser();
                                handleNavClick();
                            }} 
                            className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-md transition duration-200 font-medium cursor-pointer text-white"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </nav>
    )
}
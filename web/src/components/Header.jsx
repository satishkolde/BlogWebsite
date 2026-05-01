import axios from "axios";
import { Link, useNavigate } from "react-router";

export default function Header() {
    const navigator = useNavigate();

    const logoutUser = async () => {
        try {
            const response = await axios.post("/api/v1/user/logout");
            navigator("/register");
        }catch(e) {
            console.log("Error Loging out the user");
        }
    }

    return (
        <nav className="fixed top-0 flex flex-row justify-between items-center w-full px-8 py-4 bg-gray-500">
            <div>
                <Link className="cursor-pointer text-white text-md font-bold" to="/" >MyBlogSite</Link>
            </div>
            <div className="flex flex-row gap-2 text-white">
                <Link className="p-2 hover:underline hover:font-semibold cursor-pointer" to="/create">Create Blog</Link>
                <Link className="p-2 hover:underline hover:font-semibold cursor-pointer" to="/myposts">My Posts</Link>
                <button className="p-2 hover:bg-blue-500 hover:font-semibold rounded-md cursor-pointer" onClick={logoutUser}>Logout</button>
            </div>
        </nav>
    )
}
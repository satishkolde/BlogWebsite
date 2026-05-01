import { useState } from "react";
import { Link, useNavigate } from "react-router";
import axios from "axios";

export default function Register() {
    const [formData, setFormData] = useState({username:"",password:""});
    const [errorText, setErrorText] = useState("");
    const navigator = useNavigate();

    const handleFormDataChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,[name]:value
        }));
    }

    const registerUser = async () =>{
        try {
            const response = await axios.post("/api/v1/user/register", formData);
            navigator("/");
        }catch(e) {
            setErrorText(e?.response?.data?.message);
        }
    }

    return (
        <div className="bg-gray-500 p-4 rounded-lg">
            <div className="flex flex-col items-center gap-2 border-b-2 pb-3">
                <h1 className="font-bold text-xl text-white">Create a New Account</h1>
                <input type="text" className="rounded-md p-2 w-full outline-none bg-white" name="username" placeholder="username" value={formData.username} onChange={handleFormDataChange} /> 
                <input type="text" className="rounded-md p-2 w-full outline-none bg-white" name="password" placeholder="password" value={formData.password} onChange={handleFormDataChange} />
                {errorText && <p className="text-red-500">{errorText}</p>}
                <button className="bg-blue-500 text-white p-2 rounded-md font-semibold cursor-pointer" onClick={registerUser}>Register</button> 
            </div>
            <div className="flex items-center gap-2 mt-2">
                <p className="text-sm text-white">Already have an account?</p>
                <Link to="/login" className="underline text-blue-900"> Login </Link>
            </div>
        </div>
    )
}
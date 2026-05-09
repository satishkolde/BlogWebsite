import axios from "axios";
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";

export default function BlogCreate() {
  const { id } = useParams();
  const navigator = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    body: "",
  });

  const [is_published,setIsPublished] = useState(false);

  useEffect(() => {
    async function loadBlog() {
      try{
        const response = await axios.get(`/api/v1/blog/specific/${id}`);
        setFormData((prev) => ({...prev,title: response.data.data.title,body:response.data.data.body}));
        setIsPublished(response.data.data.is_published);
      }catch(e) {
        console.log("Error while loading specific blog");
      }
    }
    if(id) {
      loadBlog();
    }
  },[]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if(name === "title" && value.length > 100) {
      return;
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const createBlog = async () => {
    try {
      const response = await axios.post("/api/v1/blog/", {...formData,is_published});
      const id = response.data.data.blog.id;
      navigator(`/blog/${id}`);
    } catch (e) {
      navigator("/");
    }
  };

  const updateBlog = async () => {
    try {
      const response = await axios.patch(`/api/v1/blog/${id}`, {...formData,is_published});
      navigator(`/blog/${id}`);
    } catch (e) {
      console.log(e);
      navigator("/");
    }
  }

  return (
    <div className="mt-[96px] px-[286px]">
      <div className="flex flex-row justify-start">
        <Link to="/" className="text-blue-600 underline">
          Go to home
        </Link>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex flex-row gap-1 mt-2">
          <h1 className="font-bold text-2xl">Create new blog</h1>
        </div>
        <div className="flex flex-col justify-start">
          <label>Blog Title(max 100 character): </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            className="outline-none p-1 bg-blue-200 rounded-md"
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Blog Body: </label>
          <textarea
            className="w-full h-[286px] outline-none p-1 bg-blue-200 rounded-md resize-none"
            name="body"
            value={formData.body}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-row items-center gap-2">
          <input
            type="checkbox"
            name="is_published"
            id="published"
            checked={is_published}
            className="bg-blue-600 accent-blue-600 w-[16px] h-[16px] cursor-pointer"
            onChange={() => setIsPublished((prev) => !prev)}
          />
          <label htmlFor="published" className="cursor-pointer">Publish</label>
        </div>
        <div>
          <p className="text-red-500 font-semibold"></p>
        </div>
        {!id ? <button className="p-2 bg-blue-600 rounded-md text-white font-semibold cursor-pointer" onClick={createBlog}>Create</button>:
        <button className="p-2 bg-blue-600 rounded-md text-white font-semibold cursor-pointer" onClick={updateBlog}>Update</button>}
      </div>
    </div>
  );
}

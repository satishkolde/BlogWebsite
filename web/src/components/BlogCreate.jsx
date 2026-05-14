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
    <div className="min-h-screen mt-[96px] bg-gray-50 pb-20">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8">
        {/* Breadcrumb */}
        <Link to="/" className="text-blue-600 hover:text-blue-800 transition duration-200 flex items-center gap-1">
          ← Back to Home
        </Link>

        {/* Form Container */}
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mt-6">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-3xl">✍️</span>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
              {id ? "Edit Blog Post" : "Create New Blog"}
            </h1>
          </div>

          <form className="space-y-6">
            {/* Title Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Blog Title
                <span className="text-gray-500 font-normal text-xs ml-1">(max 100 characters)</span>
              </label>
              <input
                type="text"
                name="title"
                placeholder="Enter an engaging title for your blog"
                value={formData.title}
                className="w-full outline-none p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200 bg-white"
                onChange={handleChange}
              />
              <p className="text-xs text-gray-500 mt-1">{formData.title.length}/100</p>
            </div>

            {/* Body Textarea */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Blog Content
              </label>
              <textarea
                className="w-full h-80 outline-none p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200 resize-none bg-white font-normal"
                name="body"
                placeholder="Write your blog content here..."
                value={formData.body}
                onChange={handleChange}
              />
            </div>

            {/* Publish Checkbox */}
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <input
                type="checkbox"
                name="is_published"
                id="published"
                checked={is_published}
                className="w-5 h-5 cursor-pointer accent-blue-600 rounded"
                onChange={() => setIsPublished((prev) => !prev)}
              />
              <label htmlFor="published" className="cursor-pointer font-medium text-gray-700 flex-1">
                Publish this blog post
              </label>
              <span className="text-sm text-gray-500">
                {is_published ? "🟢 Published" : "⚪ Draft"}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              {!id ? (
                <button 
                  type="button"
                  className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-200 cursor-pointer" 
                  onClick={createBlog}
                >
                  ✓ Create Blog
                </button>
              ) : (
                <button 
                  type="button"
                  className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-200 cursor-pointer" 
                  onClick={updateBlog}
                >
                  ✓ Update Blog
                </button>
              )}
              <Link 
                to="/" 
                className="flex-1 px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg transition duration-200 text-center"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

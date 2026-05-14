import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import axios from "axios";
import { Link } from "react-router";
import { MdCancel } from "react-icons/md";
import { GoPencil } from "react-icons/go";
import { FaRegTrashAlt } from "react-icons/fa";

export default function BlogList({ pageTitle, endpoint, operations }) {
  const [blogs, setBlogs] = useState([]);
  const navigator = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [searchTitle, setSearchTitle] = useState("");
  const [triggerChange, setTriggerChange] = useState(false);
  const { username } = useParams();

  useEffect(() => {
    async function loadBlogs() {
      try {
        let url;
        if (username) {
          url = `/api/v1/blog/${username}?page=` + currentPage;
        } else {
          url = endpoint + currentPage;
        }
        if (searchTitle.trim() !== "") {
          url += `&title=${searchTitle}`;
        }
        const response = await axios.get(url);
        setBlogs(response.data.data.blogs);
        setPageCount(response.data.data.count);
      } catch (e) {
        navigator("/register");
      }
    }
    loadBlogs();
  }, [pageTitle, endpoint, currentPage, triggerChange]);

  useEffect(() => {
    setCurrentPage(1);
  }, [endpoint]);

  const cancelSearch = () => {
    setSearchTitle("");
    setCurrentPage(1);
    setTriggerChange(prev => !prev);
  }

  const deleteBlog = async (id) => {
    try{
      const response = await axios.delete(`/api/v1/blog/${id}`);
      if(blogs.length == 1){
        setCurrentPage((prev) => {
          if(prev == 1){
            return prev;
          }
          return prev - 1;
        });
      }
      setTriggerChange(prev => !prev);
    } catch(e) {
      console.log("Failed Delete the blog", e);
    }
  }

  const searchTrigger = () => {
    setCurrentPage(1);
    setTriggerChange(prev => !prev);
  }

  const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            searchTrigger();
        }
    }
  
  return (
    <div className="min-h-screen mt-[96px] bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">
              {pageTitle === "" ? username + "'s" : pageTitle} Posts
            </h1>
            <p className="text-gray-500 mt-2">Discover and explore amazing blog posts</p>
          </div>

          {/* Search Bar */}
          <div className="flex flex-row rounded-lg overflow-hidden shadow-md w-full md:w-auto">
            <input
              type="text"
              placeholder="Search posts..."
              value={searchTitle}
              className="flex-1 md:flex-none outline-none px-4 py-3 bg-white text-gray-700 placeholder-gray-400"
              onChange={(e) => setSearchTitle(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            {searchTitle !== "" && (
              <button 
                onClick={cancelSearch} 
                className="cursor-pointer px-3 py-3 bg-white text-gray-500 hover:text-red-500 transition duration-200"
              >
                <MdCancel size={20} />
              </button>
            )}
            <button 
              className="cursor-pointer px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium transition duration-200" 
              onClick={searchTrigger}
            >
              Search
            </button>
          </div>
        </div>

        {/* Blog Posts Container */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="space-y-4 min-h-[300px]">
            {blogs.length === 0 && (
              <div className="flex justify-center items-center h-64">
                <div className="text-center">
                  <p className="text-2xl text-gray-400">📝</p>
                  <p className="text-xl text-gray-500 mt-2">No Posts Yet</p>
                  <p className="text-gray-400 mt-1">Start creating your first blog post</p>
                </div>
              </div>
            )}
            {blogs.map((blog) => {
              return (
                <div 
                  key={blog.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition duration-200 hover:border-blue-300 group"
                >
                  <div className="flex flex-row justify-between items-start gap-4">
                    <div className="flex-1">
                      <Link
                        to={`/blog/${blog.id}`}
                        className="text-lg font-semibold text-blue-600 hover:text-blue-800 hover:underline transition duration-200 block"
                      >
                        {blog.title}
                      </Link>
                      <p className="line-clamp-2 text-gray-600 text-sm mt-2">
                        {blog.body}
                      </p>
                    </div>
                    {endpoint === "/api/v1/blog/me?page=" && (
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition duration-200">
                        <Link 
                          to={`/blog/${blog.id}/update`} 
                          className="bg-blue-100 hover:bg-blue-500 text-blue-600 hover:text-white flex justify-center items-center p-2 cursor-pointer rounded-md transition duration-200"
                          title="Edit"
                        >
                          <GoPencil size={18} />
                        </Link>
                        <button 
                          className="bg-red-100 hover:bg-red-500 text-red-600 hover:text-white flex justify-center items-center p-2 cursor-pointer rounded-md transition duration-200" 
                          onClick={() => deleteBlog(blog.id)}
                          title="Delete"
                        >
                          <FaRegTrashAlt size={18} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pagination */}
        {pageCount > 1 && (
          <div className="flex flex-row justify-center items-center mt-8">
            <div className="flex flex-row gap-2 flex-wrap justify-center">
              {Array.from({ length: pageCount }, (_, i) => {
                return (
                  <button
                    key={i}
                    className={`${
                      currentPage === i + 1 
                        ? "text-white bg-blue-600 shadow-md" 
                        : "text-blue-600 bg-white border border-blue-300 hover:bg-blue-50"
                    } px-4 py-2 cursor-pointer rounded-lg transition duration-200 font-medium`}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

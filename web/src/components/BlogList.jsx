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

  const delelteBlog = async (id) => {
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
  
  return (
    <div className="mt-[96px] flex justify-center items-center px-[286px]">
      <div className="w-full">
        <div className="flex flex-row justify-between">
          <h1 className="text-3xl font-bold">
            {pageTitle === "" ? username + "'s" : pageTitle} Posts
          </h1>
          <div className="flex flex-row rounded-sm overflow-hidden bg-gray-300">
            <div className="flex flex-row rounded-md p-2">
              <input
                type="text"
                value={searchTitle}
                className="outline-none"
                onChange={(e) => setSearchTitle(e.target.value)}
              />
              {searchTitle !== "" && <button onClick={cancelSearch} className="cursor-pointer"><MdCancel /></button>}
            </div>
            <button className="cursor-pointer p-2 bg-blue-500" onClick={searchTrigger}>Search</button>
          </div>
        </div>
        <div className="h-[386px] flex flex-col gap-2 justify-start mt-2">
          {blogs.length === 0 && (
            <div className="flex justify-center items-center h-full">
              <p className="text-xl text-gray-500">No Posts</p>
            </div>
          )}
          {blogs.map((blog) => {
            return (
              <div key={blog.id}>
                <div className="flex flex-row justify-between">
                  <Link
                    to={`/blog/${blog.id}`}
                    className="underline text-blue-600"
                  >
                    {blog.title}
                  </Link>
                  {endpoint === "/api/v1/blog/me?page=" && (
                    <div className="flex gap-2">
                      <Link to={`/blog/${blog.id}/update`} className="bg-gray-300 flex justify-center items-center p-1 cursor-pointer rounded-md"><GoPencil /></Link>
                      <button className="bg-gray-300 flex justify-center items-center p-1 cursor-pointer rounded-md" onClick={() => delelteBlog(blog.id)}><FaRegTrashAlt /></button>
                    </div>
                  )}
                </div>
                <p className="line-clamp-2 text-wrap">{blog.body}</p>
              </div>
            );
          })}
        </div>
        <div className="flex flex-row justify-center items-center mt-4">
          <div className="flex flex-row gap-2">
            {Array.from({ length: pageCount }, (_, i) => {
              return (
                <span
                  key={i}
                  className={`${currentPage === i + 1 ? "text-white bg-blue-600" : "text-blue-600"} p-2 cursor-pointer rounded-md hover:bg-blue-600 hover:text-white`}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import {useNavigate, useParams} from 'react-router';
import axios from 'axios';
import { Link } from "react-router";

export default function BlogList({pageTitle, endpoint, operations}) {
    const [blogs, setBlogs] = useState([]);
    const navigator = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [pageCount, setPageCount] = useState(1);
    const {username} = useParams();

    useEffect(() => {
        async function loadBlogs() {
            try {
                let response;
                if(username) {
                    response = await axios.get(`/api/v1/blog/${username}?page=`+currentPage);
                }else {
                    response = await axios.get(endpoint+currentPage);
                }
                setBlogs(response.data.data.blogs); 
                setPageCount(response.data.data.count);
            } catch (e) {
                navigator("/register");
            }
        }
        loadBlogs();
    },[pageTitle,endpoint,currentPage]);

    useEffect(() => {
        setCurrentPage(1);
    },[endpoint])

    return (
      <div className="mt-[96px] flex justify-center items-center px-[286px]">
        <div className="w-full">
          <div>
            <h1 className="text-3xl font-bold">{pageTitle === "" ? username+"'s" : pageTitle} Posts</h1>
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
                  <Link
                    to={`/article/${blog.id}`}
                    className="underline text-blue-600"
                  >
                    {blog.title}
                  </Link>
                  <p className="line-clamp-2 text-wrap">{blog.body}</p>
                </div>
              );
            })}
          </div>
          <div className="flex flex-row justify-center items-center mt-4">
            <div className="flex flex-row gap-2">
              {Array.from({ length: pageCount }, (_, i) => {
                return (
                  <span key={i} className={`${(currentPage) === (i+1) ?"text-white bg-blue-600":"text-blue-600"} p-2 cursor-pointer rounded-md hover:bg-blue-600 hover:text-white`} onClick={() => setCurrentPage(i+1)}>{i + 1}</span>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
}
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router";

export default function Blog() {
    const {id} = useParams();
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [comments, setComments] = useState([]);
    const [addComment, setAddComment] = useState("");
    const [commentsUpdated, setCommentsUpdated] = useState(false);
    const navigator = useNavigate();
    
    useEffect(() => {
        async function loadBlog()  {
            try {
                const response = await axios.get(`/api/v1/blog/specific/${id}`);
                setTitle(response.data.data.title);
                setBody(response.data.data.body);
            } catch (e) {
                navigator("/register");
            }
        }
        loadBlog();
    },[]);

    useEffect(() => {
        async function loadComments() {
            try {
                const response = await axios.get(`/api/v1/comment/get/${id}`);
                setComments(response.data.data.comments);
            } catch(e) {
                console.log(e);
            }
        }
        loadComments();
    }, [commentsUpdated]);

    const uploadComment = async () => {
        try {
            const response = await axios.post("/api/v1/comment/add",{id,message:addComment});
            setAddComment("");
            setCommentsUpdated(prev => !prev);
        } catch(e) {
            console.log(e);
        }
    }

    return (
      <div className="mt-[96px] px-[180px]">
        <div className="flex flex-row justify-start">
          <Link to="/" className="text-blue-600 underline">
            Go Back
          </Link>
        </div>
        <div className="flex flex-row gap-2">
          <div>
            <div className="flex flex-row gap-1">
              <h1 className="text-xl font-bold text-wrap">{title}</h1>
            </div>
            <div className="h-[386px] overflow-y-auto">{body}</div>
          </div>
          <div className="w-[386px] bg-gray-200 p-2 rounded-xl">
            <div className="flex flex-row w-full rounded-md overflow-hidden">
              <input
                type="text"
                value={addComment}
                className="bg-white outline-none p-2"
                onChange={(e) => setAddComment(e.target.value)}
              />
              <button className="p-2 text-white bg-blue-600 " onClick={uploadComment}>Comment</button>
            </div>
            <div className="flex flex-col gap-2 mt-2 overflow-y-auto">
              {comments.length === 0 && (
                <div className="flex justify-center items-center h-full w-full mt-5">
                  <p className="text-xl text-gray-500">No Comments</p>
                </div>
              )}
              {comments.map((comment) => {
              return (
                <div key={comment.author}>
                  <Link className="underline font-semibold" to={`/${comment.author}`}>{comment.author}</Link>
                  <p className="line-clamp-2 text-wrap pl-2">{comment.message}</p>
                </div>
              );
            })}
            </div>
          </div>
        </div>
      </div>
    );

}
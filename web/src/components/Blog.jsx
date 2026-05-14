import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router";
import { FaComment } from "react-icons/fa";

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
        if (addComment.trim() === "") return;
        try {
            const response = await axios.post("/api/v1/comment/add",{id,message:addComment});
            setAddComment("");
            setCommentsUpdated(prev => !prev);
        } catch(e) {
            console.log(e);
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            uploadComment();
        }
    }

    return (
      <div className="min-h-screen mt-[96px] bg-gray-50 pb-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
          {/* Breadcrumb */}
          <Link to="/" className="text-blue-600 hover:text-blue-800 transition duration-200 flex items-center gap-1 mb-6">
            ← Back to Posts
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Blog Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
                <div className="mb-6">
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-800 leading-tight mb-3">
                    {title}
                  </h1>
                  <div className="border-b border-gray-200 pb-4">
                    <p className="text-sm text-gray-500">Published Blog</p>
                  </div>
                </div>
                <div className="prose prose-sm md:prose max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {body}
                </div>
              </div>
            </div>

            {/* Comments Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-[120px]">
                <div className="flex items-center gap-2 mb-4">
                  <FaComment className="text-blue-600" size={20} />
                  <h2 className="text-xl font-bold text-gray-800">
                    Comments
                  </h2>
                  <span className="ml-auto bg-blue-100 text-blue-700 rounded-full px-3 py-1 text-sm font-semibold">
                    {comments.length}
                  </span>
                </div>

                {/* Add Comment */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Add a Comment
                  </label>
                  <div className="flex flex-col gap-2">
                    <textarea
                      type="text"
                      value={addComment}
                      placeholder="Share your thoughts..."
                      className="w-full outline-none p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200 bg-white resize-none"
                      onChange={(e) => setAddComment(e.target.value)}
                      onKeyPress={handleKeyPress}
                      rows="3"
                    />
                    <button 
                      onClick={uploadComment} 
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-200 cursor-pointer w-full"
                    >
                      Post Comment
                    </button>
                  </div>
                </div>

                {/* Comments List */}
                <div className="space-y-4 max-h-[500px] overflow-y-auto">
                  {comments.length === 0 && (
                    <div className="flex flex-col justify-center items-center py-8 text-center">
                      <p className="text-3xl mb-2">💬</p>
                      <p className="text-gray-500 font-medium">No Comments Yet</p>
                      <p className="text-sm text-gray-400 mt-1">Be the first to comment</p>
                    </div>
                  )}
                  {comments.map((comment, index) => {
                    return (
                      <div key={index} className="bg-gray-50 rounded-lg p-3 border border-gray-200 hover:border-blue-300 transition duration-200">
                        <Link 
                          className="font-semibold text-blue-600 hover:text-blue-800 transition duration-200 text-sm" 
                          to={`/${comment.author}`}
                        >
                          @{comment.author}
                        </Link>
                        <p className="text-gray-700 text-sm mt-2 leading-relaxed">
                          {comment.message}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

}
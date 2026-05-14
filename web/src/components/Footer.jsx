export default function Footer() {
    return (
        <footer className="w-full bg-gradient-to-r from-gray-600 to-gray-700 text-white mt-20 border-t border-gray-500">
            <div className="max-w-7xl mx-auto px-8 py-12">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    {/* About Section */}
                    <div>
                        <h3 className="text-lg font-bold mb-4 text-blue-300">MyBlogSite</h3>
                        <p className="text-gray-300 text-sm leading-relaxed">
                            A modern blogging platform where ideas come to life. Share your thoughts, stories, and insights with the world.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-bold mb-4 text-blue-300">Quick Links</h3>
                        <ul className="space-y-2 text-sm">
                            <li><a href="/" className="text-gray-300 hover:text-blue-300 transition duration-200">Home</a></li>
                            <li><a href="/create" className="text-gray-300 hover:text-blue-300 transition duration-200">Create Blog</a></li>
                            <li><a href="/myposts" className="text-gray-300 hover:text-blue-300 transition duration-200">My Posts</a></li>
                        </ul>
                    </div>

                    {/* Contact Section */}
                    <div>
                        <h3 className="text-lg font-bold mb-4 text-blue-300">Get In Touch</h3>
                        <p className="text-gray-300 text-sm mb-3">Have questions? We'd love to hear from you.</p>
                        <p className="text-gray-400 text-sm">
                            <span className="text-blue-300">Email:</span> satishkolde335@gmail.com
                        </p>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-500 my-6"></div>

                {/* Bottom Section */}
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-400 text-sm mb-4 md:mb-0">
                        © 2026 MyBlogSite. All rights reserved.
                    </p>
                    <p className="text-gray-400 text-sm">
                        Created with <span className="text-red-400">❤</span> by <span className="font-semibold text-blue-300">i_am_void</span>
                    </p>
                </div>
            </div>
        </footer>
    )
}
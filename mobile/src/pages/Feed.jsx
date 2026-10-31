import React, { useState } from 'react';

const mockPosts = [
  {
    id: 1,
    author: "Dr. Ananya Sharma",
    role: "Smart City Infrastructure Director • Bangalore",
    time: "2h ago",
    content: "Excited to inaugurate 40 new solar microgrids in peripheral wards today. Citizen engagement drove 60% of site decisions!",
    likes: 142,
    comments: 29
  },
  {
    id: 2,
    author: "Rohan Varma",
    role: "Urban Governance Fellow • New Delhi",
    time: "5h ago",
    content: "Open Data Portal 2.0 has been launched. Anyone interested in analyzing water drainage systems data?",
    likes: 88,
    comments: 15
  }
];

export default function FeedPage() {
  const [posts, setPosts] = useState(mockPosts);
  const [newPostText, setNewPostText] = useState("");

  const handlePost = () => {
    if (!newPostText.trim()) return;
    const newEntry = {
      id: Date.now(),
      author: "You",
      role: "Active Citizen / Contributor",
      time: "Just now",
      content: newPostText,
      likes: 0,
      comments: 0
    };
    setPosts([newEntry, ...posts]);
    setNewPostText("");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Left Sidebar: Profile card */}
      <div className="md:col-span-1">
        <div className="bg-white rounded-lg border border-slate-200 p-4 text-center">
          <div className="w-16 h-16 bg-[#0a66c2] text-white rounded-full mx-auto flex items-center justify-center font-bold text-xl">
            CP
          </div>
          <h3 className="font-semibold text-slate-800 mt-2">Civic Member</h3>
          <p className="text-xs text-slate-500">Policy & Civic Tech Contributor</p>
          <hr className="my-3 border-slate-100" />
          <div className="text-left text-xs space-y-1 text-slate-600">
            <div className="flex justify-between"><span>Connections:</span><span className="text-[#0a66c2] font-semibold">248</span></div>
            <div className="flex justify-between"><span>Initiatives Joined:</span><span className="text-[#0a66c2] font-semibold">12</span></div>
          </div>
        </div>
      </div>

      {/* Center: Feed Stream */}
      <div className="md:col-span-2 space-y-4">
        {/* Create Post Widget */}
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <textarea
            placeholder="Share an update, policy insight, or civic initiative..."
            value={newPostText}
            onChange={(e) => setNewPostText(e.target.value)}
            className="w-full border border-slate-200 rounded-md p-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
            rows="3"
          />
          <div className="flex justify-between items-center mt-2">
            <div className="flex gap-2 text-xs text-slate-500">
              <button className="px-2 py-1 bg-slate-100 rounded hover:bg-slate-200">📷 Media</button>
              <button className="px-2 py-1 bg-slate-100 rounded hover:bg-slate-200">📊 Poll</button>
            </div>
            <button
              onClick={handlePost}
              className="bg-[#0a66c2] hover:bg-[#004182] text-white text-xs font-semibold px-4 py-2 rounded-full"
            >
              Post
            </button>
          </div>
        </div>

        {/* Posts */}
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-lg border border-slate-200 p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center font-semibold text-slate-700">
                {post.author[0]}
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900">{post.author}</h4>
                <p className="text-xs text-slate-500">{post.role} • {post.time}</p>
              </div>
            </div>
            <p className="text-sm text-slate-800 my-3 leading-relaxed">{post.content}</p>
            <div className="flex gap-6 border-t border-slate-100 pt-2 text-xs font-semibold text-slate-600">
              <button className="hover:text-blue-600">👍 Like ({post.likes})</button>
              <button className="hover:text-blue-600">💬 Comment ({post.comments})</button>
              <button className="hover:text-blue-600">↗ Repost</button>
            </div>
          </div>
        ))}
      </div>

      {/* Right Sidebar: Recommended Discussions */}
      <div className="md:col-span-1 hidden md:block">
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <h4 className="text-sm font-semibold text-slate-800 mb-3">Trending Civic Topics</h4>
          <ul className="text-xs space-y-2 text-slate-600">
            <li className="hover:underline cursor-pointer">#UrbanMobility2030</li>
            <li className="hover:underline cursor-pointer">#CleanGangaMission</li>
            <li className="hover:underline cursor-pointer">#DigitalPublicInfrastructure</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
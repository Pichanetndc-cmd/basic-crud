"use client";

import { useEffect, useState } from "react";

type Post = { id: number; title: string; content?: string };

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  async function loadPosts() {
    const res = await fetch("/api/posts");
    const data = await res.json();
    setPosts(data);
  }

  async function createPost() {
    await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });
    setTitle("");
    setContent("");
    loadPosts();
  }

  async function updatePost() {
    if (!editingId) return;
    await fetch(`/api/posts/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });
    setEditingId(null);
    setTitle("");
    setContent("");
    loadPosts();
  }

  async function deletePost(id: number) {
    await fetch(`/api/posts/${id}`, { method: "DELETE" });
    loadPosts();
  }

  function editPost(id: number) {
    const post = posts.find((p) => p.id === id);
    if (post) {
      setTitle(post.title);
      setContent(post.content || "");
      setEditingId(id); // ✅ บอกว่าเรากำลังแก้โพสต์นี้อยู่
    }
  }

  useEffect(() => {
    loadPosts();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editingId) {
      await updatePost();
    } else {
      await createPost();
    }
  }

  return (
    <main className="relative p-6 mx-auto bg-[url(/img/Title.png)] bg-cover w-full h-screen flex flex-col items-center justify-center">
      {/* หัวข้อ */}
      <div className="absolute top-8 left-8">
        <h5 className="text-[36px] font-extrabold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.9)] tracking-wide">
          Posts CRUD
        </h5>
        <div className="h-[4px] w-52 bg-linear-to-r from-[#35375a] to-[#edf2f6] rounded-full mt-3 shadow-[0_0_15px_rgba(255,255,255,0.5)]"></div>
      </div>

      <div className="flex justify-start items-start gap-[150px] ml-12 mt-20">
        {/* ✅ ฟอร์มอยู่ฝั่งซ้าย */}
        <form
          onSubmit={handleSubmit}
          className="max-w-[520px] w-full p-8 rounded-3xl 
          border-4 border-white/80 
          bg-white/30 backdrop-blur-lg 
          shadow-[0_0_30px_rgba(255,255,255,0.5)] 
          transition duration-300 hover:shadow-[0_0_50px_rgba(255,255,255,0.7)] -mt-6"
        >
          <h2 className="text-white text-2xl font-bold mb-6 text-center drop-shadow-[0_0_12px_rgba(255,255,255,0.7)]">
            {editingId ? "Edit Post" : "Add New Post"}
          </h2>

          <input
            className="border border-white/80 p-3 w-full mb-4 rounded-lg 
          bg-white/40 text-[#35375a] placeholder-[#35375a]/70 
          text-base
          focus:outline-none focus:ring-4 focus:ring-white/70"
            placeholder="Title"
            value={title}
            required
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            className="border border-white/80 p-3 w-full mb-4 rounded-lg 
          bg-white/40 text-[#35375a] placeholder-[#35375a]/70 
          text-base min-h-[160px]
          focus:outline-none focus:ring-4 focus:ring-white/70"
            placeholder="Content"
            value={content}
            required
            onChange={(e) => setContent(e.target.value)}
          />

          <button
            type="submit"
            className="relative inline-flex items-center justify-center 
          px-4 py-2 mb-2 overflow-hidden 
          text-base font-bold text-gray-900 rounded-lg group 
          bg-linear-to-br from-[#35375a] to-[#edf2f6] 
          border-2 border-white shadow-lg shadow-white/30
          hover:text-white dark:text-white 
          focus:ring-4 focus:outline-none focus:ring-[#35375a]/60 
          self-start ml-1"
          >
            <span
              className="relative px-4 py-2 bg-white text-[#35375a] rounded 
            group-hover:bg-transparent group-hover:text-white transition-all duration-200"
            >
              {editingId ? "Update Post" : "Add Post"}
            </span>
          </button>

          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setTitle("");
                setContent("");
              }}
              className="ml-4 px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 transition"
            >
              Cancel
            </button>
          )}
        </form>

        {/* ✅ กล่องโพสต์อยู่ฝั่งขวา */}
        <div
          className="bg-white/80 w-[600px] p-10 rounded-3xl border-white border-4 
        shadow-[0_0_40px_rgba(255,255,255,0.4)] 
        ml-[220px] mt-[-40px] max-h-[600px] overflow-y-auto
        transition-all duration-300 hover:shadow-[0_0_60px_rgba(255,255,255,0.6)]"
        >
          <ul className="bg-white/50 w-full p-6 rounded-3xl border-white border-2 shadow-lg shadow-white/20">
            {posts.map((p) => (
              <li
                key={p.id}
                className="border-b py-4 flex justify-between items-start pl-4 mb-4"
              >
                <div className="flex-1 pr-4">
                  <b className="text-[#35375a] text-lg">{p.title}</b>
                  <p className="text-base text-gray-700 mt-2">{p.content}</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => editPost(p.id)}
                    className="text-white border border-white rounded-full w-9 h-9 flex items-center justify-center 
        font-semibold hover:bg-white hover:text-[#35375a] transition duration-200 cursor-pointer"
                  >
                    E
                  </button>

                  <button
                    onClick={() => deletePost(p.id)}
                    className="text-white border border-white rounded-full w-9 h-9 flex items-center justify-center 
        font-semibold hover:bg-white hover:text-[#35375a] transition duration-200 cursor-pointer"
                  >
                    X
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}

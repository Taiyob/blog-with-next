"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditPostPage() {
  const router = useRouter();
  const { id } = useParams();
  const [post, setPost] = useState({ title: "", content: "" });

  useEffect(() => {
    const fetchPost = async () => {
      const res = await fetch(`/api/posts/${id}`);
      const data = await res.json();
      setPost({ title: data.title, content: data.content });
    };
    fetchPost();
  }, [id]);

  const handleUpdate = async () => {
    await fetch(`/api/posts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(post),
    });
    router.push("/posts");
  };

  return (
    <div className="max-w-xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Edit Blog Post</h1>
      <input
        value={post.title}
        onChange={(e) => setPost({ ...post, title: e.target.value })}
        className="w-full mb-4 p-2 border"
        placeholder="Title"
      />
      <textarea
        value={post.content}
        onChange={(e) => setPost({ ...post, content: e.target.value })}
        className="w-full mb-4 p-2 border"
        placeholder="Content"
      />
      <button
        onClick={handleUpdate}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Update
      </button>
    </div>
  );
}

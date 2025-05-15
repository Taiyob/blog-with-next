"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface Comment {
  id: number;
  content: string;
  createdAt: string;
  user: { name: string };
}

export default function CommentSection({ postId }: { postId: number }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    axios.get(`/api/posts/${postId}/comments`).then((res) => {
      setComments(res.data);
    });
  }, [postId]);

  const handleSubmit = async () => {
    if (!newComment.trim()) return;

    const res = await axios.post(`/api/posts/${postId}/comments`, {
      content: newComment,
    });

    setComments([res.data, ...comments]);
    setNewComment("");
  };

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-3">Comments</h3>

      <div className="flex flex-col gap-2 mb-4">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="w-full border px-3 py-2 rounded resize-none"
          rows={3}
          placeholder="Write a comment..."
        />
        <button
          onClick={handleSubmit}
          className="self-end px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Post
        </button>
      </div>

      <div className="space-y-4">
        {comments.length === 0 && (
          <p className="text-sm text-gray-600 italic">No comments yet.</p>
        )}
        {comments.map((c) => (
          <div key={c.id} className="bg-gray-50 p-3 rounded border">
            <p className="text-sm text-gray-700">{c.content}</p>
            <p className="text-xs text-gray-500 mt-1">
              – {c.user.name} on {new Date(c.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

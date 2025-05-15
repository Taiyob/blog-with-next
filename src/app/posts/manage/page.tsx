"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/react";

type Post = {
  id: number;
  title: string;
  content: string;
};

export default function ManagePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch("/api/posts");
      const data = await res.json();
      setPosts(data);
    };
    fetchPosts();
  }, []);

  const handleDelete = async (id: number) => {
    const confirmed = confirm("তুমি কি নিশ্চিত যে এই পোস্টটি মুছে ফেলতে চাও?");
    if (!confirmed) return;

    await fetch(`/api/posts/${id}`, {
      method: "DELETE",
    });

    // update state after deletion
    setPosts(posts.filter((post) => post.id !== id));
  };

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6 text-red-600">
        পোস্ট ম্যানেজমেন্ট
      </h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-900 border border-gray-700 text-white">
          <thead>
            <tr>
              <th className="p-4 border-b">SL.</th>
              <th className="p-4 border-b">TITLE</th>
              <th className="p-4 border-b">DESCRIPTION</th>
              <th className="p-4 border-b">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post, index) => (
              <tr key={post.id} className="hover:bg-gray-800">
                <td className="p-4 border-b">{index + 1}</td>
                <td className="p-4 border-b">{post.title}</td>
                <td className="p-4 border-b line-clamp-2">{post.content}</td>
                <td className="p-4 border-b">
                  <Button
                    color="primary"
                    size="sm"
                    onClick={() => router.push(`/posts/${post.id}/edit`)}
                  >
                    EDIT
                  </Button>
                  <Button
                    color="danger"
                    size="sm"
                    onClick={() => handleDelete(post.id)}
                  >
                    DELETE
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@nextui-org/react";
import { motion } from "framer-motion";
import Image from "next/image";

type Post = {
  id: number;
  title: string;
  content: string;
};

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMorePosts = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    const res = await fetch(`/api/posts?page=${page}`);
    const newPosts: Post[] = await res.json();

    setPosts((prev) => [...prev, ...newPosts]);

    if (newPosts.length < 6) {
      setHasMore(false);
    }

    setLoading(false);
  }, [page, loading, hasMore]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 100 >=
          document.documentElement.offsetHeight &&
        !loading &&
        hasMore
      ) {
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore]);

  useEffect(() => {
    loadMorePosts();
  }, [loadMorePosts]);

  return (
    <main className="min-h-screen bg-black text-white px-6 py-12">
      <section className="max-w-6xl mx-auto mt-10">
        <h2 className="text-3xl font-semibold mb-8 text-center text-red-500">
          সর্বশেষ ব্লগ পোস্ট
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {posts.map((post) => (
            <motion.div
              key={post.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gray-900 border border-gray-700 shadow-lg rounded-xl overflow-hidden"
            >
              <div className="p-4">
                <h3 className="text-xl font-bold mb-2 text-white">
                  {post.title}
                </h3>
                <p className="text-gray-400 mb-4">{post.content}</p>
                <Button size="sm" variant="bordered" color="danger">
                  বিস্তারিত পড়ুন
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {loading && (
          <p className="text-center text-gray-500 mt-4">লোড হচ্ছে...</p>
        )}
        {!hasMore && (
          <p className="text-center text-gray-500 mt-4">
            সব পোস্ট লোড হয়ে গেছে।
          </p>
        )}
      </section>
      {/* Featured Blogs Section */}
      <section className="max-w-6xl mx-auto mt-20">
        <h2 className="text-3xl font-semibold mb-8 text-center text-red-500">
          বৈশিষ্ট্যযুক্ত পোস্টসমূহ
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map((post) => (
            <motion.div
              key={post}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gray-900 border border-gray-700 shadow-lg rounded-xl overflow-hidden"
            >
              <div className="relative w-full h-48">
                <Image
                  src={`https://source.unsplash.com/random/800x600?sig=${post}&blog`}
                  alt="Blog thumbnail"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-bold mb-2 text-white">
                  ব্লগ শিরোনাম {post}
                </h3>
                <p className="text-gray-400 mb-4">
                  পাঠকদের আগ্রহ আকর্ষণ করার জন্য একটি সংক্ষিপ্ত সারাংশ বা
                  ভূমিকা।
                </p>
                <Button size="sm" variant="bordered" color="danger">
                  আরও পড়ুন
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}

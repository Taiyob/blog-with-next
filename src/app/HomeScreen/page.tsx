/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import Link from "next/link";

const LIMIT = 6;

const HomeScreen = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [sentimentFilter, setSentimentFilter] = useState("");

  const fetchPosts = useCallback(
    async (pageNum: number, reset = false) => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/posts`, {
          params: {
            page: pageNum,
            search: searchTerm,
            sentiment: sentimentFilter || undefined,
          },
        });

        const data = res.data;
        if (reset) {
          setPosts(data);
        } else {
          setPosts((prev) => [...prev, ...data]);
        }

        setPage(pageNum);
        setHasMore(data.length === LIMIT);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [searchTerm, sentimentFilter]
  );

  useEffect(() => {
    fetchPosts(1, true);
  }, [searchTerm, sentimentFilter, fetchPosts]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && hasMore) {
          fetchPosts(page + 1);
        }
      },
      { threshold: 1 }
    );

    const current = observerRef.current;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, [loading, hasMore, page, fetchPosts]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="bg-yellow-100 border border-yellow-300 p-5 rounded mb-6 text-sm text-gray-800">
        <p className="font-semibold">Dear Community,</p>
        <p className="mt-2">We are back online with a few important updates.</p>
        <p className="mt-2">
          To address recent concerns, we have decided not to display the names
          of any organizations or individuals directly...
        </p>
        <p className="mt-2">
          Let’s work together to build a transparent and trustworthy platform
          for everyone.
        </p>
        <p className="mt-2">Thank you for being part of the Deshi Mula.</p>
      </div>
      {/* Search + Filter */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search by title..."
          className="w-full px-4 py-2 border rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="px-3 py-2 border rounded-md"
          value={sentimentFilter}
          onChange={(e) => setSentimentFilter(e.target.value)}
        >
          <option value="">All</option>
          <option value="Positive">Positive</option>
          <option value="Negative">Negative</option>
        </select>
      </div>

      {/* Notice bar */}
      {(searchTerm || sentimentFilter) && (
        <div className="mb-6 text-sm text-gray-700 italic">
          Showing results for{" "}
          {searchTerm && <span className="font-medium">`${searchTerm}`</span>}
          {searchTerm && sentimentFilter && " and "}
          {sentimentFilter && (
            <span className="font-medium">{sentimentFilter}</span>
          )}
        </div>
      )}

      {/* Posts */}
      {posts.map((post) => (
        <div
          key={post.id}
          className="mb-6 border border-gray-300 rounded-lg p-4 shadow-sm bg-white"
        >
          <h2 className="text-xl font-semibold">{post.title}</h2>
          <p className="text-sm text-gray-600 mb-1">
            by {post.author?.name || "Unknown"} &nbsp;|&nbsp;
            {new Date(post.createdAt).toLocaleDateString()}
          </p>
          <p className="text-gray-800 mt-2">{post.content?.slice(0, 200)}...</p>

          {/* View More button */}
          <div className="mt-3 flex justify-between items-center">
            <Link
              href={`/posts/${post.id}`}
              className="text-blue-600 hover:underline text-sm font-medium"
            >
              View full post →
            </Link>
            <button
              onClick={async () => {
                try {
                  const res = await axios.post(
                    `/api/posts/${post.id}/like`,
                    { liked: !post.likedByMe },
                    { withCredentials: true }
                  );
                  const updated = res.data;

                  setPosts((prev) =>
                    prev.map((p) =>
                      p.id === post.id
                        ? {
                            ...p,
                            likes: updated.likes,
                            likedByMe: !p.likedByMe,
                          }
                        : p
                    )
                  );
                } catch (err) {
                  console.error("Failed to like:", err);
                }
              }}
              className={`text-sm flex items-center gap-1 ${
                post.likedByMe
                  ? "text-red-500"
                  : "text-gray-600 hover:text-red-500"
              }`}
            >
              {post.likedByMe ? "❤️" : "🤍"} {post.likes}
            </button>
          </div>
        </div>
      ))}

      {/* Loader or End */}
      <div ref={observerRef} className="h-10 flex justify-center items-center">
        {loading && <span>Loading more...</span>}
        {!hasMore && !loading && <span>No more posts.</span>}
      </div>
    </div>
  );
};

export default HomeScreen;

// import React, { useEffect, useState, useRef, useCallback } from "react";

// const HomeScreen = () => {
//   const [posts, setPosts] = useState<any[]>([]);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const observer = useRef<IntersectionObserver | null>(null);

//   const fetchPosts = async () => {
//     const res = await fetch(`/api/posts?page=${page}`);
//     const data = await res.json();
//     if (data.length === 0) setHasMore(false);
//     else setPosts((prev) => [...prev, ...data]);
//   };

//   useEffect(() => {
//     fetchPosts();
//   }, [page]);

//   const lastPostRef = useCallback(
//     (node: HTMLDivElement | null) => {
//       if (!hasMore) return;
//       if (observer.current) observer.current.disconnect();

//       observer.current = new IntersectionObserver((entries) => {
//         if (entries[0].isIntersecting) setPage((prev) => prev + 1);
//       });

//       if (node) observer.current.observe(node);
//     },
//     [hasMore]
//   );

//   return (
//     <div className="max-w-4xl mx-auto px-4 py-8">
//       {/* Notice */}
//       <div className="bg-yellow-100 border border-yellow-300 p-5 rounded mb-6 text-sm text-gray-800">
//         <p className="font-semibold">Dear Community,</p>
//         <p className="mt-2">We are back online with a few important updates.</p>
//         <p className="mt-2">
//           To address recent concerns, we have decided not to display the names
//           of any organizations or individuals directly...
//         </p>
//         <p className="mt-2">
//           Let’s work together to build a transparent and trustworthy platform
//           for everyone.
//         </p>
//         <p className="mt-2">Thank you for being part of the Deshi Mula.</p>
//       </div>

//       {/* Search */}
//       <div className="mb-6">
//         <input
//           type="text"
//           placeholder="Search by Company Name"
//           className="w-full p-2 border rounded"
//         />
//       </div>

//       {/* Post List */}
//       {posts.map((post, index) => (
//         <div
//           key={post.id}
//           ref={index === posts.length - 1 ? lastPostRef : null}
//           className="bg-white shadow border rounded p-4 mb-6"
//         >
//           <h2 className="font-semibold text-lg mb-1">{post.title}</h2>
//           <p className="text-sm text-gray-600 mb-2">
//             by <span className="font-bold">{post.authorRole}</span>
//           </p>

//           {/* Tags */}
//           <div className="flex flex-wrap items-center gap-2 mb-2">
//             {post.tags?.map((tag: string, i: number) => (
//               <span
//                 key={i}
//                 className={`text-xs px-2 py-1 rounded-full ${
//                   tag.toLowerCase().includes("negative")
//                     ? "bg-red-200 text-red-800"
//                     : "bg-green-200 text-green-800"
//                 }`}
//               >
//                 {tag}
//               </span>
//             ))}
//           </div>

//           <p className="text-sm text-gray-700">{post.body}</p>

//           {/* Footer Actions */}
//           <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
//             <button className="text-blue-500 hover:underline">Read More</button>
//             <div className="flex gap-4">
//               <span>👍 {post.likes || 0}</span>
//               <span>👎 {post.dislikes || 0}</span>
//               <span>💬 {post.comments || 0}</span>
//             </div>
//           </div>
//         </div>
//       ))}

//       {!hasMore && (
//         <p className="text-center text-gray-500 mt-6">No more posts.</p>
//       )}
//     </div>
//   );
// };

// export default HomeScreen;

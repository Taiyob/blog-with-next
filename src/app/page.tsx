/* eslint-disable react/no-unescaped-entities */
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
        <p className="font-semibold">Assalamu Alaikum wa Rahmatullah,</p>
        <p className="mt-2">
          Welcome to Halal Jhal — an Islamic blog dedicated to discussing
          matters related to Islam, particularly in the light of the Qur'an,
          Sunnah, and the understanding of the pious predecessors.
        </p>
        <p className="mt-2">
          📌 Important Notice: All posts published on this site are intended
          solely for educational and dawah purposes, not to target or harm any
          individual or group. The views expressed are rooted in Islamic
          principles and scholarship.
        </p>
        <p className="mt-2">
          Please do not take any post personally. The aim is to promote
          understanding, awareness, and reflection—not to criticize specific
          people. We believe in correcting ideas, not attacking individuals.
        </p>
        <p className="mt-2">
          Let us seek truth with sincerity and remain united on the path of
          haqq. Jazakum Allahu Khairan for visiting and engaging with us. — Team
          Halal Jhal
        </p>
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

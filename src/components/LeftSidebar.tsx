"use client";

import React from "react";
import Link from "next/link";

const LeftSidebar = () => {
  return (
    <div className="w-1/4 bg-gray-800 text-white p-4 min-h-screen">
      <h2 className="text-xl font-semibold mb-6">Dashboard</h2>
      <ul className="space-y-4">
        <li>
          <Link
            href="/dashboard"
            className="block text-gray-300 hover:text-white"
          >
            Dashboard
          </Link>
        </li>
        <li>
          <Link href="/posts" className="block text-gray-300 hover:text-white">
            Create Post
          </Link>
        </li>
        <li>
          <Link
            href="/my-posts"
            className="block text-gray-300 hover:text-white"
          >
            My Posts
          </Link>
        </li>
        <li>
          <Link
            href="/settings"
            className="block text-gray-300 hover:text-white"
          >
            Settings
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default LeftSidebar;

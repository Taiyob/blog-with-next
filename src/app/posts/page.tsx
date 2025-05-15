"use client";

import React, { useState } from "react";
import {
  Input,
  Button,
  Card,
  CardBody,
  CardFooter,
  Textarea,
} from "@nextui-org/react";
import { motion } from "framer-motion";
import { Image as ImageIcon, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import LeftSidebar from "@/components/LeftSidebar";

const BlogPost = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: null as File | null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
    setSuccess(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({ ...formData, image: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!formData.title || !formData.content) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("content", formData.content);
      if (formData.image) {
        data.append("image", formData.image);
      }

      const res = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
        }),
      });

      const responseData = await res.json();

      if (!res.ok) {
        setError(responseData.error || "Something went wrong.");
        toast.error(responseData.error || "Something went wrong.");
      } else {
        setSuccess("Post created successfully!");
        toast.success("Post created successfully!");
        setFormData({ title: "", content: "", image: null });
        setTimeout(() => {
          router.push("/");
        }, 1500);
      }
    } catch (err) {
      console.log(err);
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex">
      <LeftSidebar />

      <div className="w-3/4 p-8 bg-gradient-to-r from-teal-500 via-indigo-500 to-purple-500 min-h-screen">
        <motion.div
          className="sm:mx-auto sm:w-full sm:max-w-md"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="mt-6 text-center text-3xl font-extrabold text-emerald-400">
            Create your blog post
          </h2>
        </motion.div>
        <motion.div
          className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="w-full shadow-xl bg-gray-200 py-8 px-6 sm:rounded-lg sm:px-12">
            {" "}
            <form onSubmit={handleSubmit} className="space-y-6">
              <CardBody className="flex flex-col gap-4">
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-black"
                  >
                    Title
                  </label>
                  <div className="mt-1">
                    <Input
                      id="title"
                      name="title"
                      type="text"
                      required
                      value={formData.title}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-400"
                      placeholder="Enter the title"
                      aria-required
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="content"
                    className="block text-sm font-medium text-black"
                  >
                    Content
                  </label>
                  <div className="mt-1">
                    <Textarea
                      id="content"
                      name="content"
                      required
                      value={formData.content}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-400"
                      placeholder="Write your post content"
                      rows={5}
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="image"
                    className="block text-sm font-medium text-black"
                  >
                    Post Image
                  </label>
                  <div className="mt-1">
                    <input
                      id="image"
                      name="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-400"
                    />
                  </div>
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                {success && <p className="text-green-600 text-sm">{success}</p>}
              </CardBody>

              <CardFooter>
                <Button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader
                      className="mr-2 h-5 w-5 animate-spin"
                      aria-hidden="true"
                    />
                  ) : (
                    <>
                      <ImageIcon className="mr-2 h-5 w-5" aria-hidden="true" />
                      Create Post
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default BlogPost;

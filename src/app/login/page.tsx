/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState } from "react";
import { Input, Button, Card, CardBody, CardFooter } from "@nextui-org/react";
import { motion } from "framer-motion";
import { Mail, Lock, LogIn, Loader } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import LoadingDots from "@/components/Loader";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await signIn("credentials", {
      redirect: false,
      email: formData.email,
      password: formData.password,
    });

    if (res?.error) {
      setError(res.error);
      toast.error(res.error || "Something went wrong.");
    } else {
      toast.success("Login successful!");
      setTimeout(() => {
        router.push("/");
      }, 1500);
    }

    setLoading(false);
  };

  return (
    <div
      className="flex flex-col justify-center py-12 sm:px-6 lg:px-8 min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://img.freepik.com/free-photo/moon-light-shine-through-window-into-islamic-mosque-interior_1217-2597.jpg?semt=ais_hybrid&w=740')",
        backgroundColor: "#fefaf1",
      }}
    >
      <motion.div
        className="sm:mx-auto sm:w-full sm:max-w-md"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h2
          animate={{
            opacity: [1, 0.7, 1],
            filter: [
              "blur(0px)",
              "blur(1.5px)",
              "blur(0px)",
              "blur(1px)",
              "blur(0px)",
            ],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="mt-6 text-center text-3xl font-extrabold text-blue-900 bg-white/60 backdrop-blur-md inline-block px-4 py-2 rounded-xl shadow-lg shadow-blue-200/50"
        >
          Sign in to your account
        </motion.h2>
      </motion.div>

      <motion.div
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="w-full max-w-md shadow-xl bg-transparent py-8 px-4 sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <CardBody className="flex flex-col gap-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm text-white font-bold"
                >
                  Email
                </label>
                <div className="mt-1 relative rounded-md shadow-sm bg-gray-300">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-black" aria-hidden="true" />
                  </div>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 pl-10  border border-gray-600 rounded-md shadow-sm placeholder-white focus:outline-none focus:ring-emerald-500  sm:text-sm focus:ring-0 focus:border-transparent focus:border-none !border-none !outline-none"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-bolder text-white"
                >
                  Password
                </label>
                <div className="mt-1 relative rounded-md shadow-sm bg-gray-300">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-black" aria-hidden="true" />
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 pl-10  border border-gray-600 rounded-md shadow-sm placeholder-white focus:outline-none focus:ring-emerald-500  sm:text-sm focus:ring-0 focus:border-transparent focus:border-none !border-none !outline-none"
                  />
                </div>
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}
            </CardBody>

            <CardFooter>
              <Button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition duration-150 ease-in-out disabled:opacity-50 cursor-pointer"
                color="primary"
                isLoading={loading}
              >
                {loading ? <LoadingDots /> : "Login"}
              </Button>
            </CardFooter>
          </form>
          <p>
            Are you new here?{" "}
            <span>
              <a href="/register">
                Please <span className="font-bold text-white">Sign Up</span>
              </a>
            </span>
          </p>
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginPage;

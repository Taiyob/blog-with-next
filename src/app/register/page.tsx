"use client";

import React, { useState } from "react";
import { Input, Button, Card, CardBody, CardFooter } from "@nextui-org/react";
import { motion } from "framer-motion";
import { UserPlus, Mail, Lock, User, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import LoadingDots from "@/components/Loader";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Password confirmation check
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("Res:", res);

      const data = await res.json();
      console.log("Data:", data);

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        toast.error(data.error || "Something went wrong.");
      } else {
        setSuccess("Registration successful!");
        toast.success("Registration successful!");
        setFormData({ email: "", password: "", name: "", confirmPassword: "" });
        setTimeout(() => {
          router.push("/login");
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
    <div
      className="flex flex-col justify-center py-12 sm:px-6 lg:px-8 min-h-screen bg-gradient-to-r bg-cover bg-center bg-no-repeat"
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
          Sign up to your account
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
                  htmlFor="name"
                  className="block text-sm font-bold text-white"
                >
                  Full name
                </label>
                <div className="mt-1 relative rounded-md shadow-sm bg-gray-300">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-black" aria-hidden="true" />
                  </div>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 pl-10  border border-gray-600 rounded-md shadow-sm placeholder-white focus:outline-none focus:ring-emerald-500  sm:text-sm focus:ring-0 focus:border-transparent focus:border-none !border-none !outline-none"
                    placeholder="John Doe"
                    aria-required
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-bold text-white"
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
                    type="text"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 pl-10  border border-gray-600 rounded-md shadow-sm placeholder-white focus:outline-none focus:ring-emerald-500  sm:text-sm focus:ring-0 focus:border-transparent focus:border-none !border-none !outline-none"
                    placeholder="example@gmail.com"
                    aria-required
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-bold text-white"
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
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 pl-10  border border-gray-600 rounded-md shadow-sm placeholder-white focus:outline-none focus:ring-emerald-500  sm:text-sm focus:ring-0 focus:border-transparent focus:border-none !border-none !outline-none"
                    placeholder="••••••••"
                    aria-required
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-bold text-white"
                >
                  Confirm Password
                </label>
                <div className="mt-1 relative rounded-md shadow-sm bg-gray-300">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-black" aria-hidden="true" />
                  </div>
                  <Input
                    id="confirmPassword"
                    type="password"
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 pl-10  border border-gray-600 rounded-md shadow-sm placeholder-white focus:outline-none focus:ring-emerald-500  sm:text-sm focus:ring-0 focus:border-transparent focus:border-none !border-none !outline-none"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              {success && <p className="text-green-600 text-sm">{success}</p>}
            </CardBody>

            <CardFooter>
              <Button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition duration-150 ease-in-out disabled:opacity-50"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader
                      className="mr-2 h-5 w-5 animate-spin"
                      aria-hidden="true"
                    />
                    <LoadingDots />
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-5 w-5" aria-hidden="true" />
                    Sign up
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
          <p>
            Already have an account?{" "}
            <span>
              <a href="/login">
                Please <span className="font-bold text-white">Sign In</span>
              </a>
            </span>
          </p>
        </Card>
      </motion.div>
    </div>
  );
};

export default RegisterPage;

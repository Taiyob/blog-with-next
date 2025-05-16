/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useAuth } from "@/hooks/useAuth";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
} from "@nextui-org/react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import LogoutForm from "./LogoutForm";

export default function HalalJhalNavbar() {
  const { user, isLoggedIn, loading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <Navbar
      maxWidth="full"
      className="bg-white shadow-md py-3 px-5 md:px-10 sticky top-0 z-50"
    >
      <div className="flex items-center justify-between w-full">
        {/* Logo + Brand */}
        <NavbarBrand>
          <motion.div
            initial={{ scale: 0.9, rotate: -5 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="flex items-center space-x-2"
          >
            <span className="text-2xl md:text-3xl font-extrabold text-orange-500">
              🍢
            </span>
            <span className="text-xl md:text-2xl font-bold text-gray-800">
              Halal Jhal
            </span>
          </motion.div>
        </NavbarBrand>

        {/* Desktop Menu */}
        <NavbarContent className="hidden md:flex gap-6">
          <NavbarItem>
            <Link href="/" color="foreground">
              Home
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link href="/HomeScreen" color="foreground">
              Store
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link href="#" color="foreground">
              About
            </Link>
          </NavbarItem>
          <NavbarItem>
            {!loading &&
              (isLoggedIn ? (
                <LogoutForm />
              ) : (
                <Link href="/login">
                  <Button color="primary">Login</Button>
                </Link>
              ))}
          </NavbarItem>
        </NavbarContent>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <Button isIconOnly variant="light" onClick={toggleMenu}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="md:hidden bg-white shadow-inner rounded-md px-4 pt-4 pb-2 space-y-3"
        >
          <Link href="/" className="block">
            Home
          </Link>
          <Link href="/HomeScreen" className="block">
            Store
          </Link>
          <Link href="#" className="block">
            About
          </Link>
          {!loading &&
            (isLoggedIn ? (
              <LogoutForm />
            ) : (
              <Link href="/login">
                <Button color="primary">Login</Button>
              </Link>
            ))}
        </motion.div>
      )}
    </Navbar>
  );
}

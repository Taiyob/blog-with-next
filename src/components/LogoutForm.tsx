"use client";

import React from "react";
import { Button } from "@nextui-org/react";
import { doLogout } from "@/lib/action";

const LogoutForm = () => {
  return (
    <form action={doLogout}>
      <Button type="submit" className="bg-red-400 text-white px-4 py-2 rounded">
        Logout
      </Button>
    </form>
  );
};

export default LogoutForm;

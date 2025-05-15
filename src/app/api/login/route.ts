// app/api/login/route.ts

import { NextResponse } from "next/server";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { sign } from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Missing credentials." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });
    console.log(user);

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid password." }, { status: 401 });
    }

    // JWT token if needed (for custom auth logic)
    const token = sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET!,
      {
        expiresIn: "1d",
      }
    );

    console.log(token);

    return NextResponse.json(
      { message: "Login successful", token },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

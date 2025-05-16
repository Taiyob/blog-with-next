/* eslint-disable @typescript-eslint/no-unused-vars */

import { getCurrentUser } from "@/lib/getCurrentUser";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

type Context = {
  params: {
    id: string;
  };
};

export async function POST(req: NextRequest, context: Context) {
  try {
    const user = await getCurrentUser(req);
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const comment = await prisma.comment.create({
      data: {
        content: body.content,
        postId: Number(context.params.id),
        userId: user.id,
      },
      include: {
        user: { select: { name: true } },
      },
    });

    return NextResponse.json(comment);
  } catch (err) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest, context: Context) {
  try {
    const comments = await prisma.comment.findMany({
      where: { postId: Number(context.params.id) },
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true } },
      },
    });
    return NextResponse.json(comments);
  } catch (err) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

// export async function POST(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const user = await getCurrentUser(req);
//     if (!user)
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     const body = await req.json();
//     const comment = await prisma.comment.create({
//       data: {
//         content: body.content,
//         postId: Number(params.id),
//         userId: user.id,
//       },
//       include: {
//         user: { select: { name: true } },
//       },
//     });

//     return NextResponse.json(comment);
//   } catch (err) {
//     return NextResponse.json({ error: "Server Error" }, { status: 500 });
//   }
// }

// export async function GET(
//   _: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const comments = await prisma.comment.findMany({
//       where: { postId: Number(params.id) },
//       orderBy: { createdAt: "desc" },
//       include: {
//         user: { select: { name: true } },
//       },
//     });
//     return NextResponse.json(comments);
//   } catch (err) {
//     return NextResponse.json({ error: "Server Error" }, { status: 500 });
//   }
// }

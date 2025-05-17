/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: any) {
  const { id } = params;

  try {
    const post = await prisma.post.findUnique({
      where: { id: Number(id) },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 }
    );
  }
}

// UPDATE post
export async function PUT(req: NextRequest, { params }: any) {
  const { id } = params;
  const body = await req.json();
  const { title, content } = body;

  try {
    const updatedPost = await prisma.post.update({
      where: { id: Number(id) },
      data: { title, content },
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    );
  }
}

// DELETE post
export async function DELETE(req: NextRequest, { params }: any) {
  const { id } = params;

  try {
    await prisma.post.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: "Post deleted" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
}

// GET a single post by ID
// export async function GET(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   const { id } = params;
//   try {
//     const post = await prisma.post.findUnique({
//       where: { id: Number(id) },
//     });

//     if (!post) {
//       return NextResponse.json({ error: "Post not found" }, { status: 404 });
//     }

//     return NextResponse.json(post);
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Failed to fetch post" },
//       { status: 500 }
//     );
//   }
// }

// UPDATE post
// export async function PUT(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   const { id } = params;
//   const body = await req.json();
//   const { title, content } = body;

//   try {
//     const updatedPost = await prisma.post.update({
//       where: { id: Number(id) },
//       data: { title, content },
//     });

//     return NextResponse.json(updatedPost);
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Failed to update post" },
//       { status: 500 }
//     );
//   }
// }

// DELETE post
// export async function DELETE(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   const { id } = params;
//   try {
//     await prisma.post.delete({
//       where: { id: Number(id) },
//     });
//     return NextResponse.json({ message: "Post deleted" });
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Failed to delete post" },
//       { status: 500 }
//     );
//   }
// }

// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/authOptions";

// export async function PUT(
//   req: Request,
//   { params }: { params: { id: string } }
// ) {
//   const session = await getServerSession(authOptions);
//   if (!session) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   const { title, content } = await req.json();
//   const updatedPost = await prisma.post.update({
//     where: { id: Number(params.id) },
//     data: { title, content },
//   });

//   return NextResponse.json(updatedPost);
// }

// export async function DELETE(
//   req: Request,
//   { params }: { params: { id: string } }
// ) {
//   const session = await getServerSession(authOptions);
//   if (!session) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   await prisma.post.delete({
//     where: { id: Number(params.id) },
//   });

//   return NextResponse.json({ message: "Post deleted" });
// }

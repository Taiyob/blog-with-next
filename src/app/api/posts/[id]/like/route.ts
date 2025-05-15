import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const urlParts = req.nextUrl.pathname.split("/");
    const postId = parseInt(urlParts[urlParts.length - 2]);

    if (isNaN(postId)) {
      return NextResponse.json({ error: "Invalid post ID" }, { status: 400 });
    }

    const { liked } = await req.json();

    const existing = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId: user.id,
          postId,
        },
      },
    });

    if (liked && !existing) {
      await prisma.like.create({
        data: {
          userId: user.id,
          postId,
        },
      });
    } else if (!liked && existing) {
      await prisma.like.delete({
        where: {
          userId_postId: {
            userId: user.id,
            postId,
          },
        },
      });
    }

    const updatedLikes = await prisma.like.count({
      where: {
        postId,
      },
    });

    return NextResponse.json({ likes: updatedLikes }, { status: 200 });
  } catch (err) {
    console.error("LIKE API ERROR:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

// import { NextRequest, NextResponse } from "next/server";
// import { getCurrentUser } from "@/lib/getCurrentUser";
// import { prisma } from "@/lib/prisma";

// export async function POST(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   const user = await getCurrentUser(req);

//   if (!user) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   const postId = parseInt(params.id);
//   if (isNaN(postId)) {
//     return NextResponse.json({ error: "Invalid post ID" }, { status: 400 });
//   }

//   try {
//     await prisma.like.create({
//       data: {
//         userId: user.id,
//         postId,
//       },
//     });

//     return NextResponse.json({ message: "Liked" });
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Something went wrong" },
//       { status: 500 }
//     );
//   }
// }

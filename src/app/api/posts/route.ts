/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/getCurrentUser";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  console.log(session);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { title, content } = body;

  try {
    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        authorId: Number(session.user.id),
      },
    });

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 6;
    const skip = (page - 1) * limit;

    const search = searchParams.get("search") || "";
    const sentiment = searchParams.get("sentiment") || "";

    const where: any = {
      title: {
        contains: search,
        mode: "insensitive",
      },
    };

    if (sentiment) {
      where.content = {
        contains: sentiment,
        mode: "insensitive",
      };
    }

    const user = await getCurrentUser(req);
    const currentUserId = user?.id || null;

    const posts = await prisma.post.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: {
          select: {
            name: true,
          },
        },
        _count: {
          select: {
            like: true,
          },
        },
        like: currentUserId
          ? {
              where: {
                userId: currentUserId,
              },
              select: {
                id: true,
              },
            }
          : false,
      },
    });

    const formattedPosts = posts.map((post) => ({
      id: post.id,
      title: post.title,
      content: post.content,
      createdAt: post.createdAt,
      author: post.author,
      likes: post._count.like,
      likedByMe: currentUserId ? post.like.length > 0 : false,
    }));

    return NextResponse.json(formattedPosts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

// export async function GET(req: NextRequest) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const page = parseInt(searchParams.get("page") || "1");
//     const limit = 6;
//     const skip = (page - 1) * limit;
//     const posts = await prisma.post.findMany({
//       skip,
//       take: limit,
//       orderBy: {
//         createdAt: "desc",
//       },
//       include: {
//         author: true,
//       },
//     });

//     return NextResponse.json(posts, { status: 200 });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json(
//       { error: "Failed to fetch posts" },
//       { status: 500 }
//     );
//   }
// }

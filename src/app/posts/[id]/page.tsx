import { prisma } from "@/lib/prisma";
import CommentSection from "./CommentSection";
import { notFound } from "next/navigation";

// interface PostPageProps {
//   params: {
//     id: string;
//   };
// }

export default async function PostDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const post = await prisma.post.findUnique({
    where: { id: Number(params.id) },
    include: { author: true },
  });

  // if (!post) return <div className="p-4">Post not found.</div>;
  if (!post) return notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
      <p className="text-sm text-gray-600 mb-4">
        by {post.author?.name || "Unknown"} |{" "}
        {new Date(post.createdAt).toLocaleDateString()}
      </p>
      <p className="text-lg text-gray-800 whitespace-pre-line">
        {post.content}
      </p>

      <CommentSection postId={post.id} />
    </div>
  );
}

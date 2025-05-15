import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
import { prisma } from "./prisma";

export async function getCurrentUser(req: NextRequest) {
  const token = await getToken({ req });

  if (!token?.id) return null;

  const userId = parseInt(token.id as string);
  if (isNaN(userId)) return null;

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  return user;
}

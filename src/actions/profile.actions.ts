"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAuthSession } from "@/lib/auth";
import { sanitizeText } from "@/lib/security";
import { updateNicknameSchema } from "@/schemas/profile.schema";

export async function updateNickname(input: { nickname: string }) {
  const session = await getAuthSession();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const parsed = updateNicknameSchema.parse(input);

  await prisma.user.update({
    where: { id: userId },
    data: {
      nickname: sanitizeText(parsed.nickname),
    },
  });

  revalidatePath("/dashboard");
}

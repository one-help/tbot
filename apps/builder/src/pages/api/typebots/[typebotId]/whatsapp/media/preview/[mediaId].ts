import { getAuthenticatedUser } from "@/features/auth/helpers/getAuthenticatedUser";
import { isReadWorkspaceFobidden } from "@/features/workspace/helpers/isReadWorkspaceFobidden";
import { env } from "@typebot.io/env";
import {
  methodNotAllowed,
  notAuthenticated,
  notFound,
} from "@typebot.io/lib/api/utils";
import prisma from "@typebot.io/prisma";
import { downloadMedia } from "@typebot.io/whatsapp/downloadMedia";
import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    if (!env.META_SYSTEM_USER_TOKEN)
      return res
        .status(400)
        .json({ error: "Meta system user token is not set" });
    const user = await getAuthenticatedUser(req, res);
    if (!user) return notAuthenticated(res);

    const typebotId = req.query.typebotId as string;

    const typebot = await prisma.typebot.findFirst({
      where: {
        id: typebotId,
      },
      select: {
        whatsAppCredentialsId: true,
        workspace: {
          select: {
            members: {
              select: {
                userId: true,
              },
            },
          },
        },
      },
    });

    if (!typebot?.workspace || isReadWorkspaceFobidden(typebot.workspace, user))
      return notFound(res, "Workspace not found");

    if (!typebot) return notFound(res, "Bot not found");

    const mediaIdWithExtension = req.query.mediaId as string;
    const mediaId = mediaIdWithExtension.split(".")[0];

    const { file, mimeType } = await downloadMedia({
      mediaId,
      systemUserAccessToken: env.META_SYSTEM_USER_TOKEN,
    });

    res.setHeader("Content-Type", mimeType);
    res.setHeader("Cache-Control", "public, max-age=86400");

    return res.send(file);
  }
  return methodNotAllowed(res);
};

export default handler;

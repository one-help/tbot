import { canReadTypebots } from "@/helpers/databaseRules";
import { authenticatedProcedure } from "@/helpers/server/trpc";
import { TRPCError } from "@trpc/server";
import { isHttpRequestBlock } from "@typebot.io/blocks-core/helpers";
import type { Block } from "@typebot.io/blocks-core/schemas/schema";
import { IntegrationBlockType } from "@typebot.io/blocks-integrations/constants";
import { parseGroups } from "@typebot.io/groups/helpers/parseGroups";
import { byId } from "@typebot.io/lib/utils";
import prisma from "@typebot.io/prisma";
import { z } from "@typebot.io/zod";

export const listHttpRequestBlocks = authenticatedProcedure
  .meta({
    openapi: {
      method: "GET",
      path: "/v1/typebots/{typebotId}/webhookBlocks",
      protect: true,
      summary: "List HTTP request blocks",
      description:
        "Returns a list of all the HTTP request blocks that you can subscribe to.",
      tags: ["HTTP request"],
    },
  })
  .input(
    z.object({
      typebotId: z.string(),
    }),
  )
  .output(
    z.object({
      webhookBlocks: z.array(
        z.object({
          id: z.string(),
          type: z.enum([
            IntegrationBlockType.HTTP_REQUEST,
            IntegrationBlockType.ZAPIER,
            IntegrationBlockType.MAKE_COM,
            IntegrationBlockType.PABBLY_CONNECT,
          ]),
          label: z.string(),
          url: z.string().optional(),
        }),
      ),
    }),
  )
  .query(async ({ input: { typebotId }, ctx: { user } }) => {
    const typebot = await prisma.typebot.findFirst({
      where: canReadTypebots(typebotId, user),
      select: {
        version: true,
        groups: true,
        webhooks: true,
      },
    });
    if (!typebot)
      throw new TRPCError({ code: "NOT_FOUND", message: "Bot not found" });

    const groups = parseGroups(typebot.groups, {
      typebotVersion: typebot.version,
    });

    const httpRequestBlocks = groups.reduce<
      {
        id: string;
        label: string;
        url: string | undefined;
        type:
          | IntegrationBlockType.HTTP_REQUEST
          | IntegrationBlockType.ZAPIER
          | IntegrationBlockType.MAKE_COM
          | IntegrationBlockType.PABBLY_CONNECT;
      }[]
    >((httpRequestBlock, group) => {
      const blocks = (group.blocks as Block[]).filter(isHttpRequestBlock);
      return [
        ...httpRequestBlock,
        ...blocks.map((block) => ({
          id: block.id,
          type: block.type,
          label: `${group.title} > ${block.id}`,
          url:
            "webhookId" in block && !block.options?.webhook
              ? (typebot?.webhooks.find(byId(block.webhookId))?.url ??
                undefined)
              : block.options?.webhook?.url,
        })),
      ];
    }, []);

    return { webhookBlocks: httpRequestBlocks };
  });

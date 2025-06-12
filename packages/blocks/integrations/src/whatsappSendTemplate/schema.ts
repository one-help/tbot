import { blockBaseSchema } from "@typebot.io/blocks-base/schemas";
import { z } from "@typebot.io/zod";
import { IntegrationBlockType } from "../constants";

export const whatsappTemplateComponentSchema = z.object({
  id: z.string(),
  type: z.enum(["header", "body", "footer"]),
  parameter_name: z.string().optional(),
  text: z.string().optional(),
});

const responseVariableMappingSchema = z.object({
  id: z.string(),
  variableId: z.string().optional(),
  responseKey: z.enum(["messageId", "messageStatus", "errorMessage"]),
});

export const whatsappSendTemplateOptionsSchema = z.object({
  templateName: z.string().optional(),
  phoneNumberId: z.string().optional(),
  recipientPhoneNumber: z.string().optional(),
  facebookApiUrl: z.string().optional(),
  facebookApiToken: z.string().optional(),
  components: z.array(whatsappTemplateComponentSchema).optional(),
  responseVariableMapping: z.array(responseVariableMappingSchema).optional(),
  successEdgeId: z.string().optional(),
  errorEdgeId: z.string().optional(),
});

export const whatsappSendTemplateBlockSchema = blockBaseSchema
  .merge(
    z.object({
      type: z.enum([IntegrationBlockType.WHATSAPP_SEND_TEMPLATE]),
      options: whatsappSendTemplateOptionsSchema.optional(),
    }),
  )
  .openapi({
    title: "WhatsApp - Disparar modelo",
    ref: "whatsappSendTemplateBlock",
  });

export type WhatsAppTemplateComponent = z.infer<typeof whatsappTemplateComponentSchema>;
export type WhatsAppSendTemplateBlock = z.infer<typeof whatsappSendTemplateBlockSchema>;
export type WhatsAppResponseVariableMapping = z.infer<typeof responseVariableMappingSchema>;

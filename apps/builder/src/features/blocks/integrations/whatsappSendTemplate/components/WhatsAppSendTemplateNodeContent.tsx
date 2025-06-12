import { Stack, Text } from "@chakra-ui/react";
import type { WhatsAppSendTemplateBlock } from "@typebot.io/blocks-integrations/whatsappSendTemplate/schema";

type Props = {
  block: WhatsAppSendTemplateBlock;
};

export const WhatsAppSendTemplateNodeContent = ({ block: { options } }: Props) => {
  if (!options?.templateName) return <Text color="gray.500">Configure...</Text>;
  
  return (
    <Stack w="full">
      <Text noOfLines={1} pr="6">
        📱 {options.templateName}
      </Text>
      {options.recipientPhoneNumber && (
        <Text fontSize="sm" color="gray.500" noOfLines={1}>
          Para: {options.recipientPhoneNumber}
        </Text>
      )}
      {options.components && options.components.length > 0 && (
        <Text fontSize="sm" color="gray.500">
          {options.components.length} componente(s)
        </Text>
      )}
    </Stack>
  );
};

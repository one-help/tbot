import type { TableListItemProps } from "@/components/TableList";
import { DropdownList } from "@/components/DropdownList";
import { VariableSearchInput } from "@/components/inputs/VariableSearchInput";
import { FormControl, FormLabel, Stack } from "@chakra-ui/react";
import type { WhatsAppResponseVariableMapping } from "@typebot.io/blocks-integrations/whatsappSendTemplate/schema";
import type { Variable } from "@typebot.io/variables/schemas";

const responseKeys = [
  { label: "Message ID", value: "messageId" },
  { label: "Status", value: "messageStatus" },
  { label: "Error Message", value: "errorMessage" },
] as const;

export const WhatsAppResponseMappingInputs = ({
  item,
  onItemChange,
}: TableListItemProps<WhatsAppResponseVariableMapping>) => {  const handleResponseKeyChange = (responseKey: string) =>
    onItemChange({ ...item, responseKey: responseKey as "messageId" | "messageStatus" | "errorMessage" });
    
  const handleVariableChange = (variable?: Variable) =>
    onItemChange({ ...item, variableId: variable?.id });

  return (
    <Stack p="4" rounded="md" flex="1" borderWidth="1px">
      <FormControl>
        <FormLabel htmlFor="response-key">Valor da resposta:</FormLabel>
        <DropdownList
          currentItem={item.responseKey}
          onItemSelect={handleResponseKeyChange}
          items={responseKeys}
          placeholder="Selecionar valor"
        />
      </FormControl>
      <FormControl>
        <FormLabel htmlFor="variable">Salvar na variável:</FormLabel>
        <VariableSearchInput
          onSelectVariable={handleVariableChange}
          placeholder="Pesquisar variável"
          initialVariableId={item.variableId}
        />
      </FormControl>
    </Stack>
  );
};

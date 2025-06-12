import type { TableListItemProps } from "@/components/TableList";
import { TextInput } from "@/components/inputs";
import { DropdownList } from "@/components/DropdownList";
import { Stack, FormControl, FormLabel } from "@chakra-ui/react";
import type { WhatsAppTemplateComponent } from "@typebot.io/blocks-integrations/whatsappSendTemplate/schema";

const componentTypes = ["header", "body", "footer"] as const;

export const WhatsAppComponentInputs = ({
  item,
  onItemChange,
}: TableListItemProps<WhatsAppTemplateComponent>) => {
  const handleTypeChange = (type: string) =>
    onItemChange({ ...item, type: type as "header" | "body" | "footer" });
  
  const handleParameterNameChange = (parameter_name: string) =>
    onItemChange({ ...item, parameter_name });
  
  const handleTextChange = (text: string) =>
    onItemChange({ ...item, text });

  return (
    <Stack p="4" rounded="md" flex="1" borderWidth="1px">
      <FormControl>
        <FormLabel>Tipo</FormLabel>
        <DropdownList
          currentItem={item.type || "body"}
          onItemSelect={handleTypeChange}
          items={componentTypes}
        />
      </FormControl>
      
      <FormControl>
        <FormLabel>Nome do parâmetro</FormLabel>
        <TextInput
          defaultValue={item.parameter_name}
          onChange={handleParameterNameChange}
          placeholder="Ex: nome_usuario"
        />
      </FormControl>
        <FormControl>
        <FormLabel>Texto (aceita variáveis)</FormLabel>
        <TextInput
          defaultValue={item.text}
          onChange={handleTextChange}
          placeholder="Ex: {{Nome do usuário}}"
        />
      </FormControl>
    </Stack>
  );
};

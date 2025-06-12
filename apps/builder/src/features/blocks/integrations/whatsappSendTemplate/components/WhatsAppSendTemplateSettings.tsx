import { TextInput } from "@/components/inputs";
import { TableList } from "@/components/TableList";
import {
  Stack,
  FormControl,
  FormLabel,
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Text,
} from "@chakra-ui/react";
import type {
  WhatsAppSendTemplateBlock,
  WhatsAppTemplateComponent,
  WhatsAppResponseVariableMapping,
} from "@typebot.io/blocks-integrations/whatsappSendTemplate/schema";
import { defaultWhatsAppSendTemplateOptions } from "@typebot.io/blocks-integrations/whatsappSendTemplate/constants";
import { WhatsAppComponentInputs } from "./WhatsAppComponentInputs";
import { WhatsAppResponseMappingInputs } from "./WhatsAppResponseMappingInputs";

type Props = {
  block: WhatsAppSendTemplateBlock;
  onOptionsChange: (options: WhatsAppSendTemplateBlock["options"]) => void;
};

export const WhatsAppSendTemplateSettings = ({
  block: { options },
  onOptionsChange,
}: Props) => {
  const updateTemplateName = (templateName: string) =>
    onOptionsChange({ ...options, templateName });

  const updatePhoneNumberId = (phoneNumberId: string) =>
    onOptionsChange({ ...options, phoneNumberId });

  const updateRecipientPhoneNumber = (recipientPhoneNumber: string) =>
    onOptionsChange({ ...options, recipientPhoneNumber });

  const updateFacebookApiUrl = (facebookApiUrl: string) =>
    onOptionsChange({ ...options, facebookApiUrl });

  const updateFacebookApiToken = (facebookApiToken: string) =>
    onOptionsChange({ ...options, facebookApiToken });
  const updateComponents = (components: WhatsAppTemplateComponent[]) =>
    onOptionsChange({ ...options, components });

  const updateResponseVariableMapping = (responseVariableMapping: WhatsAppResponseVariableMapping[]) =>
    onOptionsChange({ ...options, responseVariableMapping });

  const updateSuccessEdgeId = (successEdgeId: string) =>
    onOptionsChange({ ...options, successEdgeId });

  const updateErrorEdgeId = (errorEdgeId: string) =>
    onOptionsChange({ ...options, errorEdgeId });

  return (
    <Stack spacing={4}>
      <FormControl>
        <FormLabel>Nome do modelo/template</FormLabel>
        <TextInput
          defaultValue={options?.templateName}
          onChange={updateTemplateName}
          placeholder="Ex: hello_world"
        />
      </FormControl>      <FormControl>
        <FormLabel>ID do telefone de envio</FormLabel>
        <TextInput
          defaultValue={options?.phoneNumberId}
          onChange={updatePhoneNumberId}
          placeholder="Ex: {{Phone Number ID}} ou 123456789"
        />
      </FormControl>

      <FormControl>
        <FormLabel>Número de telefone para envio</FormLabel>
        <TextInput
          defaultValue={options?.recipientPhoneNumber}
          onChange={updateRecipientPhoneNumber}
          placeholder="Ex: {{Telefone}} ou 5511999999999"
        />
      </FormControl>

      <FormControl>
        <FormLabel>URL Facebook API</FormLabel>
        <TextInput
          defaultValue={options?.facebookApiUrl || defaultWhatsAppSendTemplateOptions.facebookApiUrl}
          onChange={updateFacebookApiUrl}
          placeholder="https://graph.facebook.com/v18.0"
        />
      </FormControl>

      <FormControl>
        <FormLabel>Token Facebook API</FormLabel>
        <TextInput
          defaultValue={options?.facebookApiToken}
          onChange={updateFacebookApiToken}
          placeholder="Ex: {{Facebook Token}} ou seu_token_aqui"
        />
      </FormControl>      <FormControl>
        <FormLabel>Componentes do template</FormLabel>
        <TableList<WhatsAppTemplateComponent>
          initialItems={options?.components || []}
          onItemsChange={updateComponents}
          addLabel="Adicionar componente"
        >
          {(props) => <WhatsAppComponentInputs {...props} />}
        </TableList>
      </FormControl>

      <Accordion allowMultiple>
        <AccordionItem>
          <AccordionButton justifyContent="space-between">
            <Text>Salvar resposta em variáveis</Text>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pt="4">
            <TableList<WhatsAppResponseVariableMapping>
              initialItems={options?.responseVariableMapping || []}
              onItemsChange={updateResponseVariableMapping}
              addLabel="Adicionar mapeamento"
            >
              {(props) => <WhatsAppResponseMappingInputs {...props} />}
            </TableList>
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <AccordionButton justifyContent="space-between">
            <Text>Roteamento condicional</Text>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pt="4" as={Stack} spacing="4">
            <FormControl>
              <FormLabel>Edge ID para sucesso (status 200, message_status="accepted")</FormLabel>
              <TextInput
                defaultValue={options?.successEdgeId}
                onChange={updateSuccessEdgeId}
                placeholder="ID da conexão para sucesso"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Edge ID para erro</FormLabel>
              <TextInput
                defaultValue={options?.errorEdgeId}
                onChange={updateErrorEdgeId}
                placeholder="ID da conexão para erro"
              />
            </FormControl>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Stack>
  );
};

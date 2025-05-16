import { TextLink } from "@/components/TextLink";
import { TextInput } from "@/components/inputs/TextInput";
import { useWorkspace } from "@/features/workspace/WorkspaceProvider";
import { toast } from "@/lib/toast";
import { trpc } from "@/lib/trpc";
import {
  Alert,
  AlertIcon,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
} from "@chakra-ui/react";
import type { Credentials } from "@typebot.io/credentials/schemas";
import type React from "react";
import { useState } from "react";

const openAITokensPage = "https://platform.openai.com/account/api-keys";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onNewCredentials: (id: string) => void;
};

export const OpenAICredentialsModal = ({
  isOpen,
  onClose,
  onNewCredentials,
}: Props) => {
  const { workspace } = useWorkspace();
  const [apiKey, setApiKey] = useState("");
  const [name, setName] = useState("");

  const [isCreating, setIsCreating] = useState(false);

  const {
    credentials: {
      listCredentials: { refetch: refetchCredentials },
    },
  } = trpc.useContext();
  const { mutate } = trpc.credentials.createCredentials.useMutation({
    onMutate: () => setIsCreating(true),
    onSettled: () => setIsCreating(false),
    onError: (err) => {
      toast({
        description: err.message,
      });
    },
    onSuccess: (data) => {
      refetchCredentials();
      onNewCredentials(data.credentialsId);
      onClose();
    },
  });

  const createOpenAICredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspace) return;
    mutate({
      scope: "workspace",
      workspaceId: workspace.id,
      credentials: {
        type: "openai",
        name,
        data: {
          apiKey,
        },
      } as Credentials,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Adicionar conta da OpenAI</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={createOpenAICredentials}>
          <ModalBody as={Stack} spacing="6">
            <TextInput
              isRequired
              label="Nome"
              onChange={setName}
              placeholder="Minha conta"
              withVariableButton={false}
              debounceTimeout={0}
            />
            <TextInput
              isRequired
              type="password"
              label="Chave da API (API Key)"
              helperText={
                <>
                  Pegue sua API Key{" "}
                  <TextLink href={openAITokensPage} isExternal>
                    aqui
                  </TextLink>
                  .
                </>
              }
              onChange={setApiKey}
              placeholder="sk-..."
              withVariableButton={false}
              debounceTimeout={0}
            />
            {/* <Alert status="warning">
              <AlertIcon />
              Make sure to add a payment method to your OpenAI account.
              Otherwise, it will not work after a few messages.
            </Alert> */}
          </ModalBody>

          <ModalFooter>
            <Button
              type="submit"
              isLoading={isCreating}
              isDisabled={apiKey === "" || name === ""}
              colorScheme="orange"
            >
              Criar
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

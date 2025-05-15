import { Seo } from "@/components/Seo";
import {
  Button,
  Heading,
  Stack,
  Tag,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { useQueryState } from "nuqs";
import { toast } from "sonner";
import { createEmailMagicLink } from "../helpers/createEmailMagicLink";

export const EmailRedirectPage = () => {
  const [redirectPath] = useQueryState("redirectPath");
  const [email] = useQueryState("email");
  const [token] = useQueryState("token");
  const bgColor = useColorModeValue("gray.50", "gray.900");

  const redirectToMagicLink = () => {
    if (!token || !email) {
      toast.error("Missing token or email query params");
      return;
    }
    window.location.assign(
      createEmailMagicLink(token, email, redirectPath ?? undefined),
    );
  };

  if (!email || !token) return null;

  return (
    <VStack h="100vh" justifyContent="center">
      <Seo title={"Confirmação de login por e-mail"} />
      <Stack bg={bgColor} p={10} borderRadius={8} borderWidth={1} spacing={6}>
        <Stack spacing={4}>
          <Heading
            onClick={() => {
              throw new Error("Sentry is working");
            }}
          >
            Autenticação por e-mail
          </Heading>
          <Text>
            Você está logando com o e-mail <Tag>{email}</Tag>
          </Text>
        </Stack>
        <Button onClick={redirectToMagicLink} colorScheme="orange">
          Continuar
        </Button>
      </Stack>
    </VStack>
  );
};

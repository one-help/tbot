import { EmojiOrImageIcon } from "@/components/EmojiOrImageIcon";
import { TypebotLogo } from "@/components/TypebotLogo";
import { CopyIcon, PlayIcon } from "@/components/icons";
import { useUser } from "@/features/user/hooks/useUser";
import { useRightPanel } from "@/hooks/useRightPanel";
import {
  Button,
  Divider,
  Flex,
  HStack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useTranslate } from "@tolgee/react";
import { isNotDefined } from "@typebot.io/lib/utils";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { headerHeight } from "../constants";
import { useEditor } from "../providers/EditorProvider";
import { useTypebot } from "../providers/TypebotProvider";

export const GuestTypebotHeader = () => {
  const { t } = useTranslate();
  const router = useRouter();
  const { user } = useUser();
  const { typebot, save } = useTypebot();
  const { setStartPreviewFrom } = useEditor();
  const [rightPanel, setRightPanel] = useRightPanel();

  const handlePreviewClick = async () => {
    setStartPreviewFrom(undefined);
    save().then();
    setRightPanel("preview");
  };

  return (
    <Flex
      w="full"
      borderBottomWidth="1px"
      justify="center"
      align="center"
      h={`${headerHeight}px`}
      zIndex={1}
      pos="relative"
      bgColor={useColorModeValue("white", "gray.950")}
      flexShrink={0}
    >
      <HStack
        display={["none", "flex"]}
        pos={{ base: "absolute", xl: "static" }}
        right={{ base: 280, xl: 0 }}
      >
        <Button
          as={Link}
          href={`/bots/${typebot?.id}/edit`}
          colorScheme={router.pathname.includes("/edit") ? "orange" : "gray"}
          variant={router.pathname.includes("/edit") ? "outline" : "ghost"}
          size="sm"
        >
          {t("editor.header.flowButton.label")}
        </Button>
        {/* <Button
          as={Link}
          href={`/bots/${typebot?.id}/theme`}
          colorScheme={router.pathname.endsWith("theme") ? "orange" : "gray"}
          variant={router.pathname.endsWith("theme") ? "outline" : "ghost"}
          size="sm"
        >
          {t("editor.header.themeButton.label")}
        </Button>
        <Button
          as={Link}
          href={`/bots/${typebot?.id}/settings`}
          colorScheme={router.pathname.endsWith("settings") ? "orange" : "gray"}
          variant={router.pathname.endsWith("settings") ? "outline" : "ghost"}
          size="sm"
        >
          {t("editor.header.settingsButton.label")}
        </Button> */}
      </HStack>
      <HStack
        pos="absolute"
        left="1rem"
        justify="center"
        align="center"
        spacing="6"
      >
        <HStack alignItems="center" spacing={3}>
          {typebot && (
            <EmojiOrImageIcon icon={typebot.icon} emojiFontSize="2xl" />
          )}
          <Text
            noOfLines={2}
            maxW="150px"
            overflow="hidden"
            fontSize="14px"
            minW="30px"
            minH="20px"
          >
            {typebot?.name}
          </Text>
        </HStack>
      </HStack>

      <HStack
        right="1rem"
        pos="absolute"
        display={["none", "flex"]}
        spacing={4}
      >
        <HStack>
          {/* {typebot?.id && (
            <Button
              as={Link}
              href={
                !user
                  ? {
                      pathname: `/register`,
                      query: {
                        redirectPath: `/bots/${typebot.id}/duplicate`,
                      },
                    }
                  : `/bots/${typebot.id}/duplicate`
              }
              leftIcon={<CopyIcon />}
              isLoading={isNotDefined(typebot)}
              size="sm"
            >
              Duplicate
            </Button>
          )} */}
          {/* {router.pathname.includes("/edit") && isNotDefined(rightPanel) && (
            <Button
              colorScheme="orange"
              onClick={handlePreviewClick}
              isLoading={isNotDefined(typebot)}
              leftIcon={<PlayIcon />}
              size="sm"
            >
              Play bot
            </Button>
          )} */}
        </HStack>

        {/* {!user && (
          <>
            <Divider orientation="vertical" h="25px" borderColor="gray.400" />
            <Button
              as={Link}
              href={`/register`}
              leftIcon={<TypebotLogo />}
              variant="outline"
              size="sm"
            >
              Try Typebot
            </Button>
          </>
        )} */}
      </HStack>
    </Flex>
  );
};

import { EditableEmojiOrImageIcon } from "@/components/EditableEmojiOrImageIcon";
import { SupportBubble } from "@/components/SupportBubble";
import {
  BuoyIcon,
  ChevronLeftIcon,
  CopyIcon,
  PlayIcon,
  RedoIcon,
  UndoIcon,
} from "@/components/icons";
import { PublishButton } from "@/features/publish/components/PublishButton";
import { ShareTypebotButton } from "@/features/share/components/ShareTypebotButton";
import { useWorkspace } from "@/features/workspace/WorkspaceProvider";
import { isCloudProdInstance } from "@/helpers/isCloudProdInstance";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useRightPanel } from "@/hooks/useRightPanel";
import {
  Button,
  Flex,
  HStack,
  IconButton,
  Spinner,
  type StackProps,
  Text,
  Tooltip,
  chakra,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { useTranslate } from "@tolgee/react";
import { isDefined, isNotDefined } from "@typebot.io/lib/utils";
import { Plan } from "@typebot.io/prisma/enum";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { headerHeight } from "../constants";
import { useEditor } from "../providers/EditorProvider";
import { useTypebot } from "../providers/TypebotProvider";
import { EditablebotName } from "./EditableTypebotName";
import { GuestTypebotHeader } from "./UnauthenticatedTypebotHeader";

export const TypebotHeader = () => {
  const { typebot, publishedTypebot, currentUserMode } = useTypebot();
  const { workspace, currentUserMode: cum } = useWorkspace();
  const { isOpen, onOpen } = useDisclosure();
  const headerBgColor = useColorModeValue("white", "gray.950");

  const handleHelpClick = () => {
    isCloudProdInstance() && workspace?.plan && workspace.plan !== Plan.FREE
      ? onOpen()
      : window.open("https://docs.typebot.io/guides/how-to-get-help", "_blank");
  };

  if (currentUserMode === "guest") return <GuestTypebotHeader />;
  return (
    <Flex
      w="full"
      borderBottomWidth="1px"
      justify="center"
      align="center"
      h={`${headerHeight}px`}
      pos="relative"
      bgColor={headerBgColor}
      flexShrink={0}
    >
      {/* {isOpen && <SupportBubble autoShowDelay={0} />} */}
      <LeftElements pos="absolute" left="1rem" onHelpClick={handleHelpClick} />
      {cum === "write" && (
        <>
          <TypebotNav
            display={{ base: "none", xl: "flex" }}
            pos={{ base: "absolute" }}
            typebotId={typebot?.id}
            isResultsDisplayed={isDefined(publishedTypebot)}
          />
          <RightElements
            right="40px"
            pos="absolute"
            display={["none", "flex"]}
            isResultsDisplayed={isDefined(publishedTypebot)}
          />
        </>
      )}
    </Flex>
  );
};

const LeftElements = ({
  onHelpClick,
  ...props
}: StackProps & { onHelpClick: () => void }) => {
  const { t } = useTranslate();
  const router = useRouter();
  const {
    typebot,
    updateTypebot,
    canUndo,
    canRedo,
    undo,
    redo,
    currentUserMode,
    isSavingLoading,
  } = useTypebot();

  const [isRedoShortcutTooltipOpen, setRedoShortcutTooltipOpen] =
    useState(false);

  const [isUndoShortcutTooltipOpen, setUndoShortcutTooltipOpen] =
    useState(false);

  const hideUndoShortcutTooltipLater = useDebouncedCallback(() => {
    setUndoShortcutTooltipOpen(false);
  }, 1000);

  const hideRedoShortcutTooltipLater = useDebouncedCallback(() => {
    setRedoShortcutTooltipOpen(false);
  }, 1000);

  const handleNameSubmit = (name: string) =>
    updateTypebot({ updates: { name } });

  const handleChangeIcon = (icon: string) =>
    updateTypebot({ updates: { icon } });

  useKeyboardShortcuts({
    undo: () => {
      if (!canUndo) return;
      hideUndoShortcutTooltipLater.flush();
      setUndoShortcutTooltipOpen(true);
      hideUndoShortcutTooltipLater();
      undo();
    },
    redo: () => {
      if (!canRedo) return;
      hideUndoShortcutTooltipLater.flush();
      setRedoShortcutTooltipOpen(true);
      hideRedoShortcutTooltipLater();
      redo();
    },
  });

  return (
    <HStack justify="center" align="center" spacing="6" {...props}>
      <HStack alignItems="center" spacing={3}>
        <IconButton
          as={Link}
          aria-label="Navigate back"
          icon={<ChevronLeftIcon fontSize="md" />}
          href={{
            pathname: router.query.parentId
              ? "/bots/[typebotId]/edit"
              : typebot?.folderId
                ? "/bots/folders/[id]"
                : "/bots",
            query: {
              id: typebot?.folderId ?? [],
              parentId: Array.isArray(router.query.parentId)
                ? router.query.parentId.slice(0, -1)
                : [],
              typebotId: Array.isArray(router.query.parentId)
                ? [...router.query.parentId].pop()
                : (router.query.parentId ?? []),
            },
          }}
          size="sm"
        />
        <HStack spacing={1}>
          {typebot && (
            <EditableEmojiOrImageIcon
              uploadFileProps={{
                workspaceId: typebot.workspaceId,
                typebotId: typebot.id,
                fileName: "icon",
              }}
              icon={typebot?.icon}
              onChangeIcon={handleChangeIcon}
            />
          )}
          (
          <EditablebotName
            key={`typebot-name-${typebot?.name ?? ""}`}
            defaultName={typebot?.name ?? ""}
            onNewName={handleNameSubmit}
          />
          )
        </HStack>

        {currentUserMode === "write" && (
          <HStack>
            <Tooltip
              label={
                isUndoShortcutTooltipOpen
                  ? t("editor.header.undo.tooltip.label")
                  : t("editor.header.undoButton.label")
              }
              isOpen={isUndoShortcutTooltipOpen ? true : undefined}
              hasArrow={isUndoShortcutTooltipOpen}
            >
              <IconButton
                display={["none", "flex"]}
                icon={<UndoIcon fontSize="16px" />}
                size="sm"
                aria-label={t("editor.header.undoButton.label")}
                onClick={undo}
                isDisabled={!canUndo}
              />
            </Tooltip>

            <Tooltip
              label={
                isRedoShortcutTooltipOpen
                  ? t("editor.header.undo.tooltip.label")
                  : t("editor.header.redoButton.label")
              }
              isOpen={isRedoShortcutTooltipOpen ? true : undefined}
              hasArrow={isRedoShortcutTooltipOpen}
            >
              <IconButton
                display={["none", "flex"]}
                icon={<RedoIcon fontSize="16px" />}
                size="sm"
                aria-label={t("editor.header.redoButton.label")}
                onClick={redo}
                isDisabled={!canRedo}
              />
            </Tooltip>
          </HStack>
        )}
        {/* <Button
          leftIcon={<BuoyIcon />}
          onClick={onHelpClick}
          size="sm"
          iconSpacing={{ base: 0, xl: 2 }}
        >
          <chakra.span display={{ base: "none", xl: "inline" }}>
            {t("editor.header.helpButton.label")}
          </chakra.span>
        </Button> */}
      </HStack>
      {isSavingLoading && (
        <HStack>
          <Spinner speed="0.7s" size="sm" color="gray.400" />
          <Text fontSize="sm" color="gray.400">
            {t("editor.header.savingSpinner.label")}
          </Text>
        </HStack>
      )}
    </HStack>
  );
};

const RightElements = ({
  isResultsDisplayed,
  ...props
}: StackProps & { isResultsDisplayed: boolean }) => {
  const router = useRouter();
  const { t } = useTranslate();
  const { typebot, save, isSavingLoading } = useTypebot();
  const { setStartPreviewFrom } = useEditor();
  const [rightPanel, setRightPanel] = useRightPanel();
  const { currentUserMode } = useWorkspace();

  const handlePreviewClick = async () => {
    setStartPreviewFrom(undefined);
    await save();
    setRightPanel("preview");
  };

  if (currentUserMode !== "write") return <></>;

  return (
    <HStack {...props}>
      <TypebotNav
        display={{ base: "none", md: "flex", xl: "none" }}
        typebotId={typebot?.id}
        isResultsDisplayed={isResultsDisplayed}
      />
      <Flex pos="relative">
        <ShareTypebotButton isLoading={isNotDefined(typebot)} />
      </Flex>
      {router.pathname.includes("/edit") && rightPanel !== "preview" && (
        <Button
          colorScheme="gray"
          onClick={handlePreviewClick}
          isLoading={isNotDefined(typebot) || isSavingLoading}
          leftIcon={<PlayIcon />}
          size="sm"
          iconSpacing={{ base: 0, xl: 2 }}
        >
          <chakra.span display={{ base: "none", xl: "inline" }}>
            {t("editor.header.previewButton.label")}
          </chakra.span>
        </Button>
      )}
      {/* {currentUserMode === "guest" && (
        <Button
          as={Link}
          href={`/bots/${typebot?.id}/duplicate`}
          leftIcon={<CopyIcon />}
          isLoading={isNotDefined(typebot)}
          size="sm"
        >
          Duplicar
        </Button>
      )} */}
      {currentUserMode === "write" && <PublishButton size="sm" />}
    </HStack>
  );
};

const TypebotNav = ({
  typebotId,
  isResultsDisplayed,
  ...stackProps
}: {
  typebotId?: string;
  isResultsDisplayed: boolean;
} & StackProps) => {
  const { t } = useTranslate();
  const router = useRouter();

  return (
    <HStack {...stackProps}>
      <Button
        as={Link}
        href={`/bots/${typebotId}/edit`}
        colorScheme={router.pathname.includes("/edit") ? "orange" : "gray"}
        variant={router.pathname.includes("/edit") ? "outline" : "ghost"}
        size="sm"
      >
        {t("editor.header.flowButton.label")}
      </Button>
      {/* <Button
        as={Link}
        href={`/bots/${typebotId}/theme`}
        colorScheme={router.pathname.endsWith("theme") ? "orange" : "gray"}
        variant={router.pathname.endsWith("theme") ? "outline" : "ghost"}
        size="sm"
      >
        {t("editor.header.themeButton.label")}
      </Button> */}
      <Button
        as={Link}
        href={`/bots/${typebotId}/settings`}
        colorScheme={router.pathname.endsWith("settings") ? "orange" : "gray"}
        variant={router.pathname.endsWith("settings") ? "outline" : "ghost"}
        size="sm"
      >
        {t("editor.header.settingsButton.label")}
      </Button>
      <Button
        as={Link}
        href={`/bots/${typebotId}/share`}
        colorScheme={router.pathname.endsWith("share") ? "orange" : "gray"}
        variant={router.pathname.endsWith("share") ? "outline" : "ghost"}
        size="sm"
      >
        {t("share.button.label")}
      </Button>
      <Button
        as={Link}
        href={`/bots/${typebotId}/results`}
        colorScheme={router.pathname.includes("results") ? "orange" : "gray"}
        variant={router.pathname.includes("results") ? "outline" : "ghost"}
        size="sm"
      >
        {t("editor.header.resultsButton.label")}
      </Button>
    </HStack>
  );
};

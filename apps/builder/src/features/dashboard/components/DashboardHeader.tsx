import { EmojiOrImageIcon } from "@/components/EmojiOrImageIcon";
import { HardDriveIcon, SettingsIcon } from "@/components/icons";
import { ParentModalProvider } from "@/features/graph/providers/ParentModalProvider";
import { useUser } from "@/features/user/hooks/useUser";
import { useWorkspace } from "@/features/workspace/WorkspaceProvider";
import { WorkspaceDropdown } from "@/features/workspace/components/WorkspaceDropdown";
import { WorkspaceSettingsModal } from "@/features/workspace/components/WorkspaceSettingsModal";
import {
  Button,
  Flex,
  HStack,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { useTranslate } from "@tolgee/react";
import { isNotDefined } from "@typebot.io/lib/utils";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

export const DashboardHeader = () => {
  const { t } = useTranslate();
  const { user, logOut } = useUser();
  const { workspace, switchWorkspace, createWorkspace, currentUserMode } =
    useWorkspace();
  const { asPath } = useRouter();

  const isRedirectFromCredentialsCreation = asPath.includes("credentials");

  const { isOpen, onOpen, onClose } = useDisclosure({
    defaultIsOpen: isRedirectFromCredentialsCreation,
  });

  const handleCreateNewWorkspace = () =>
    createWorkspace(user?.name ?? undefined);

  return (
    <Flex
      w="full"
      borderBottomWidth="1px"
      justify="center"
      bg={useColorModeValue("white", "gray.900")}
    >
      <Flex
        justify="space-between"
        alignItems="center"
        h="16"
        maxW="1000px"
        flex="1"
      >
        <Link href="/bots" data-testid="typebot-logo">
          <EmojiOrImageIcon
            boxSize="80px"
            icon={workspace?.icon}
            defaultIcon={HardDriveIcon}
          />
        </Link>
        <HStack>
          {user && workspace && !workspace.isPastDue && (
            <ParentModalProvider>
              <WorkspaceSettingsModal
                isOpen={isOpen}
                onClose={onClose}
                user={user}
                workspace={workspace}
                defaultTab={
                  isRedirectFromCredentialsCreation ? "credentials" : undefined
                }
              />
            </ParentModalProvider>
          )}
          {!workspace?.isPastDue && (
            <Button
              leftIcon={<SettingsIcon />}
              onClick={onOpen}
              isLoading={isNotDefined(workspace)}
            >
              {t("dashboard.header.settingsButton.label")}
            </Button>
          )}
          <WorkspaceDropdown
            currentWorkspace={workspace}
            onLogoutClick={logOut}
            onCreateNewWorkspaceClick={handleCreateNewWorkspace}
            onWorkspaceSelected={switchWorkspace}
          />
        </HStack>
      </Flex>
    </Flex>
  );
};

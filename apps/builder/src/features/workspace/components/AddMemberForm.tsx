import { ChevronLeftIcon } from "@/components/icons";
import { toast } from "@/lib/toast";
import {
  Button,
  HStack,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
} from "@chakra-ui/react";
import { useTranslate } from "@tolgee/react";
import { WorkspaceRole } from "@typebot.io/prisma/enum";
import type { Prisma } from "@typebot.io/prisma/types";
import { type FormEvent, useState } from "react";
import { sendInvitationQuery } from "../queries/sendInvitationQuery";
import type { Member } from "../types";

type Props = {
  workspaceId: string;
  onNewMember: (member: Member) => void;
  onNewInvitation: (invitation: Prisma.WorkspaceInvitation) => void;
  isLoading: boolean;
  isLocked: boolean;
};
export const AddMemberForm = ({
  workspaceId,
  onNewMember,
  onNewInvitation,
  isLoading,
  isLocked,
}: Props) => {
  const { t } = useTranslate();
  const [invitationEmail, setInvitationEmail] = useState("");
  const [invitationRole, setInvitationRole] = useState<WorkspaceRole>(
    WorkspaceRole.MEMBER,
  );

  const [isSendingInvitation, setIsSendingInvitation] = useState(false);

  const handleInvitationSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSendingInvitation(true);
    const { data, error } = await sendInvitationQuery({
      email: invitationEmail,
      type: invitationRole,
      workspaceId,
    });
    if (error) {
      toast({
        description: error.message,
        status: "error",
      });
    } else {
      setInvitationEmail("");
    }
    if (data?.member) onNewMember(data.member);
    if (data?.invitation) onNewInvitation(data.invitation);
    setIsSendingInvitation(false);
  };

  return (
    <HStack as="form" onSubmit={handleInvitationSubmit}>
      <Input
        placeholder={t("workspace.membersList.inviteInput.placeholder")}
        name="inviteEmail"
        value={invitationEmail}
        onChange={(e) => setInvitationEmail(e.target.value)}
        rounded="md"
        isDisabled={isLocked}
      />

      {!isLocked && (
        <WorkspaceRoleMenuButton
          role={invitationRole}
          onChange={setInvitationRole}
        />
      )}
      <Button
        colorScheme="orange"
        isLoading={isSendingInvitation}
        flexShrink={0}
        type="submit"
        isDisabled={isLoading || isLocked || invitationEmail === ""}
      >
        {t("workspace.membersList.inviteButton.label")}
      </Button>
    </HStack>
  );
};

const WorkspaceRoleMenuButton = ({
  role,
  onChange,
}: {
  role: WorkspaceRole;
  onChange: (role: WorkspaceRole) => void;
}) => {
  return (
    <Menu placement="bottom" isLazy matchWidth>
      <MenuButton
        flexShrink={0}
        as={Button}
        rightIcon={<ChevronLeftIcon transform={"rotate(-90deg)"} />}
      >
        {convertWorkspaceRoleToReadable(role)}
      </MenuButton>
      <MenuList minW={0}>
        <Stack maxH={"35vh"} overflowY="auto" spacing="0">
          <MenuItem onClick={() => onChange(WorkspaceRole.ADMIN)}>
            {convertWorkspaceRoleToReadable(WorkspaceRole.ADMIN)}
          </MenuItem>
          <MenuItem onClick={() => onChange(WorkspaceRole.MEMBER)}>
            {convertWorkspaceRoleToReadable(WorkspaceRole.MEMBER)}
          </MenuItem>
        </Stack>
      </MenuList>
    </Menu>
  );
};

export const convertWorkspaceRoleToReadable = (role: WorkspaceRole): string => {
  switch (role) {
    case WorkspaceRole.ADMIN:
      return "Dono";
    case WorkspaceRole.MEMBER:
      return "Membro";
    case WorkspaceRole.GUEST:
      return "Convidado";
  }
};

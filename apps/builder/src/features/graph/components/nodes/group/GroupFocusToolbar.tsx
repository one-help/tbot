import { CopyIcon, InfoIcon, PlayIcon, TrashIcon } from "@/components/icons";
import { isMac } from "@/helpers/isMac";
import {
  HStack,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Tooltip,
  useClipboard,
  useColorModeValue,
} from "@chakra-ui/react";
import { useState } from "react";

type Props = {
  groupId: string;
  isReadOnly: boolean;
  onPlayClick: () => void;
  color?: string;
  onColorChange?: (color: string) => void;
};

export const GroupFocusToolbar = ({
  groupId,
  isReadOnly,
  onPlayClick,
  color,
  onColorChange,
}: Props) => {
  const { hasCopied, onCopy } = useClipboard(groupId);

  const dispatchCopyEvent = () => {
    dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "c",
        [isMac() ? "metaKey" : "ctrlKey"]: true,
      }),
    );
  };

  const dispatchDeleteEvent = () => {
    dispatchEvent(new KeyboardEvent("keydown", { key: "Backspace" }));
  };

  return (
    <HStack
      rounded="md"
      spacing={0}
      borderWidth="1px"
      bgColor={useColorModeValue("white", "gray.900")}
      shadow="md"
    >
      <IconButton
        icon={<PlayIcon />}
        borderRightWidth="1px"
        borderRightRadius="none"
        aria-label={"Preview bot from this group"}
        variant="ghost"
        onClick={onPlayClick}
        size="sm"
      />
      {!isReadOnly && (
        <IconButton
          icon={<CopyIcon />}
          borderRightWidth="1px"
          borderRightRadius="none"
          borderLeftRadius="none"
          aria-label={"Copy group"}
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation();
            dispatchCopyEvent();
          }}
          size="sm"
        />
      )}
      <Tooltip
        label={hasCopied ? "Copied!" : groupId}
        closeOnClick={false}
        placement="top"
      >
        <IconButton
          icon={<InfoIcon />}
          borderRightWidth="1px"
          borderRightRadius="none"
          borderLeftRadius="none"
          aria-label={"Show group info"}
          variant="ghost"
          size="sm"
          onClick={onCopy}
        />
      </Tooltip>
      {!isReadOnly && (
        <IconButton
          aria-label="Delete"
          borderLeftRadius="none"
          icon={<TrashIcon />}
          onClick={dispatchDeleteEvent}
          variant="ghost"
          size="sm"
        />
      )}
      {!isReadOnly && onColorChange && (
        <Menu>
          <MenuButton
            as={IconButton}
            aria-label="Alterar cor do grupo"
            icon={
              <Icon viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" fill={color || "#7f8c8d"} />
                <path
                  d="M7 14a2 2 0 1 0 4 0 2 2 0 0 0-4 0zm6-6a2 2 0 1 0 4 0 2 2 0 0 0-4 0z"
                  fill="#fff"
                />
              </Icon>
            }
            size="sm"
            borderRightWidth="1px"
            borderRightRadius="none"
            variant="ghost"
          />
          <MenuList minW="0" p={1}>
            {[
              "#27ae60",
              "#8e44ad",
              "#2980b9",
              "#e67e22",
              "#f1c40f",
              "#7f8c8d",
            ].map((c) => (
              <MenuItem
                key={c}
                onClick={() => onColorChange(c)}
                icon={
                  <Icon viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" fill={c} />
                  </Icon>
                }
                minH="32px"
              >
                <span style={{ color: c }}>Alterar fundo</span>
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      )}
    </HStack>
  );
};

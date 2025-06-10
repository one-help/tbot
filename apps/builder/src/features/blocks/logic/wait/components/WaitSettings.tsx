import { TextInput } from "@/components/inputs";
import { SwitchWithLabel } from "@/components/inputs/SwitchWithLabel";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Stack,
} from "@chakra-ui/react";
import { defaultWaitOptions } from "@typebot.io/blocks-logic/wait/constants";
import type { WaitBlock } from "@typebot.io/blocks-logic/wait/schema";
import React from "react";

type Props = {
  options: WaitBlock["options"];
  onOptionsChange: (options: WaitBlock["options"]) => void;
};

export const WaitSettings = ({ options, onOptionsChange }: Props) => {
  const handleSecondsChange = (secondsToWaitFor: string | undefined) => {
    onOptionsChange({ ...options, secondsToWaitFor });
  };

  const updateShouldPause = (shouldPause: boolean) => {
    onOptionsChange({ ...options, shouldPause });
  };

  return (
    <Stack spacing={4}>
      <TextInput
        label="Quantos segundos aguardar:"
        defaultValue={options?.secondsToWaitFor}
        onChange={handleSecondsChange}
      />
      <Accordion allowToggle>
        <AccordionItem>
          <AccordionButton justifyContent="space-between">
            Avançado
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel py="4">
            <SwitchWithLabel
              label="Pausar o fluxo"
              moreInfoContent="Quando ativado, o fluxo será pausado após o tempo de espera. O usuário poderá retomar o fluxo manualmente."
              initialValue={
                options?.shouldPause ?? defaultWaitOptions.shouldPause
              }
              onCheckChange={updateShouldPause}
            />
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Stack>
  );
};

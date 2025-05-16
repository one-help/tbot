import { defaultButtonLabel } from "../constants";
import type { PhoneNumberInputBlock } from "./schema";

export const defaultPhoneInputOptions = {
  labels: {
    button: defaultButtonLabel,
    placeholder: "Digite seu telefone......",
  },
  retryMessageContent:
    "This phone number doesn't seem to be valid. Can you type it again?",
} as const satisfies PhoneNumberInputBlock["options"];

import { createAuth, option } from "@typebot.io/forge";

export const auth = createAuth({
  type: "encryptedCredentials",
  name: "Conta OpenAI",
  schema: option.object({
    apiKey: option.string.layout({
      isRequired: true,
      label: "Chave API (API Key)",
      placeholder: "sk-...",
      inputType: "password",
      helperText:
        "Gere a sua API key [aqui](https://platform.openai.com/account/api-keys).",
      withVariableButton: false,
      isDebounceDisabled: true,
    }),
    baseUrl: option.string.layout({
      label: "URL base",
      defaultValue: "https://api.openai.com/v1",
      moreInfoTooltip:
        "Use este campo se você estiver usando uma instância auto-hospedada do OpenAI.",
      withVariableButton: false,
      isDebounceDisabled: true,
    }),
  }),
});

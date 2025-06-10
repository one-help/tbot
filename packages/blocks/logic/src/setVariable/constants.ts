import type { SetVariableBlock } from "./schema";

export const valueTypes = [
  "Custom",
  "Empty",
  "Append value(s)",
  "Environment name",
  "Device type",
  "Transcript",
  "User ID",
  "Result ID",
  "Now",
  "Today",
  "Yesterday",
  "Tomorrow",
  "Random ID",
  "Moment of the day",
  "Map item with same index",
  "Pop",
  "Shift",
  "Phone number",
  "Contact name",
  "Referral Click ID",
  "Referral Source ID",
] as const;

export const valueTypesBR = {
  "Custom": "Personalizado",
  "Empty": "Vazio",
  "Append value(s)": "Anexar valor(es)",
  "Environment name": "Nome do ambiente",
  "Device type": "Tipo de dispositivo",
  "Transcript": "Transcrição",
  "User ID": "ID do usuário",
  "Result ID": "ID do resultado",
  "Now": "Agora",
  "Today": "Hoje",
  "Yesterday": "Ontem",
  "Tomorrow": "Amanhã",
  "Random ID": "ID aleatório",
  "Moment of the day": "Momento do dia",
  "Map item with same index": "Item do mapa com mesmo índice",
  "Pop": "Remover último item",
  "Shift": "Remover primeiro item",
  "Phone number": "Número de telefone",
  "Contact name": "Nome do contato",
  "Referral Click ID": "ID de clique de referência",
  "Referral Source ID": "ID de fonte de referência",
 } as const;

export const valueTypesWithNoOptions = [
  "Today",
  "Moment of the day",
  "Empty",
  "Environment name",
  "User ID",
  "Result ID",
  "Random ID",
  "Phone number",
  "Contact name",
  "Transcript",
  "Referral Click ID",
  "Referral Source ID",
  "Device type",
] as const satisfies (typeof valueTypes)[number][];

export const hiddenTypes = ["Today", "User ID"] as const;

export const sessionOnlySetVariableOptions = ["Transcript"] as const;

export const defaultSetVariableOptions = {
  type: "Custom",
  isExecutedOnClient: false,
  isCode: false,
} as const satisfies SetVariableBlock["options"];

export const whatsAppSetVariableTypes = [
  "Phone number",
  "Contact name",
  "Referral Click ID",
  "Referral Source ID",
] as const satisfies (typeof valueTypes)[number][];

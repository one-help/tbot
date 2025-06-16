import type {
  WhatsAppSendTemplateBlock,
  WhatsAppTemplateComponent,
} from "@typebot.io/blocks-integrations/whatsappSendTemplate/schema";
import type { SessionState } from "@typebot.io/chat-session/schemas";
import type { LogInSession } from "@typebot.io/logs/schemas";
import type { SessionStore } from "@typebot.io/runtime-session-store";
import { parseVariables } from "@typebot.io/variables/parseVariables";
import { normalizeBrazilianPhoneNumber } from "@typebot.io/whatsapp/normalizeBrazilianPhoneNumber";
import { updateVariablesInSession } from "../../../updateVariablesInSession";
import type { ExecuteIntegrationResponse } from "../../../types";

export const executeWhatsAppSendTemplateBlock = async (
  block: WhatsAppSendTemplateBlock,
  {
    state,
    sessionStore,
  }: {
    state: SessionState;
    sessionStore: SessionStore;
  },
): Promise<ExecuteIntegrationResponse> => {
  const logs: LogInSession[] = [];
  const { typebot } = state.typebotsQueue[0];

  if (!block.options) {
    logs.push({
      status: "error",
      description: "WhatsApp Send Template block is not configured",
    });
    return { outgoingEdgeId: block.outgoingEdgeId, logs };
  }

  const {
    templateName,
    phoneNumberId,
    recipientPhoneNumber,
    facebookApiUrl,
    facebookApiToken,
    components,
    responseVariableMapping,
  } = block.options;

  // Parse variables in the configuration
  const parsedTemplateName = parseVariables(templateName || "", {
    variables: typebot.variables,
    sessionStore,
  });

  const parsedPhoneNumberId = parseVariables(phoneNumberId || "", {
    variables: typebot.variables,
    sessionStore,
  });

  const parsedRecipientPhone = parseVariables(recipientPhoneNumber || "", {
    variables: typebot.variables,
    sessionStore,
  });

  const parsedApiUrl = parseVariables(facebookApiUrl || "", {
    variables: typebot.variables,
    sessionStore,
  });

  const parsedApiToken = parseVariables(facebookApiToken || "", {
    variables: typebot.variables,
    sessionStore,
  });
  if (!parsedTemplateName || !parsedPhoneNumberId || !parsedRecipientPhone || !parsedApiUrl || !parsedApiToken) {
    logs.push({
      status: "error",
      description: "Missing required WhatsApp configuration parameters",
    });
    return { outgoingEdgeId: block.outgoingEdgeId, logs };
  }

  // Normalize Brazilian phone numbers to handle 8/9 digit mobile numbers
  const normalizedRecipientPhone = normalizeBrazilianPhoneNumber(parsedRecipientPhone);

  // Build the WhatsApp template components
  const templateComponents = buildTemplateComponents(components || [], typebot.variables, sessionStore);

  // Build the request payload
  const requestBody = {
    messaging_product: "whatsapp",
    to: normalizedRecipientPhone,
    recipient_type: "individual",
    type: "template",
    template: {
      name: parsedTemplateName,
      language: { code: "pt_BR" },
      components: templateComponents,
    },
  };

  const url = `${parsedApiUrl}/${parsedPhoneNumberId}/messages`;

  try {
    // Make the HTTP request to Facebook API
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${parsedApiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const responseData = await response.json();

    logs.push({
      status: response.ok ? "success" : "error",
      description: response.ok 
        ? "WhatsApp template message sent successfully"
        : "WhatsApp template message failed to send",
      details: JSON.stringify({
        statusCode: response.status,
        request: requestBody,
        response: responseData,
      }),
    });

    // Handle response and save to variables
    const newVariables = processWhatsAppResponse(
      responseData,
      response.status,
      responseVariableMapping || [],
      typebot.variables,
    );

    // Determine next edge based on response
    let nextEdgeId = block.outgoingEdgeId;
    
    if (response.ok && responseData.messages?.[0]?.message_status === "accepted") {
      // Success case
      nextEdgeId = block.options.successEdgeId || block.outgoingEdgeId;
    } else {
      // Error case
      nextEdgeId = block.options.errorEdgeId || block.outgoingEdgeId;
    }    // Handle response and save to variables
    const { updatedState, newSetVariableHistory } = updateVariablesInSession({
      state,
      newVariables,
      currentBlockId: block.id,
    });

    return {
      outgoingEdgeId: nextEdgeId,
      logs,
      newSessionState: updatedState,
      newSetVariableHistory,
    };
  } catch (error) {
    logs.push({
      status: "error",
      description: "Failed to send WhatsApp template message",
      details: JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
        request: requestBody,
      }),
    });

    // Save error to variables if mapping exists
    const { updatedState, newSetVariableHistory } = updateVariablesInSession({
      state,
      newVariables: processWhatsAppResponse(
        { error: { message: error instanceof Error ? error.message : "Unknown error" } },
        500,
        responseVariableMapping || [],
        typebot.variables,
      ),
      currentBlockId: block.id,
    });

    return {
      outgoingEdgeId: block.options.errorEdgeId || block.outgoingEdgeId,
      logs,
      newSessionState: updatedState,
      newSetVariableHistory,
    };
  }
};

const buildTemplateComponents = (
  components: WhatsAppTemplateComponent[],
  variables: any[],
  sessionStore: SessionStore,
) => {
  const groupedComponents = components.reduce((acc, component) => {
    const facebookType = component.type;
    
    if (!acc[facebookType]) {
      acc[facebookType] = [];
    }
    
    const parsedText = parseVariables(component.text || "", {
      variables,
      sessionStore,
    });

    acc[facebookType].push({
      type: "text",
      parameter_name: component.parameter_name,
      text: parsedText,
    });

    return acc;
  }, {} as Record<string, any[]>);

  return Object.entries(groupedComponents).map(([type, parameters]) => ({
    type,
    parameters,
  }));
};

const processWhatsAppResponse = (
  responseData: any,
  statusCode: number,
  responseVariableMapping: any[],
  variables: any[],
) => {
  const newVariables = [...variables];

  responseVariableMapping.forEach((mapping) => {
    if (!mapping.variableId) return;

    const variableIndex = newVariables.findIndex(
      (variable: any) => variable.id === mapping.variableId,
    );

    if (variableIndex === -1) return;

    let value: string | undefined;

    switch (mapping.responseKey) {
      case "messageId":
        value = responseData.messages?.[0]?.id;
        break;
      case "messageStatus":
        value = responseData.messages?.[0]?.message_status;
        break;
      case "errorMessage":
        value = responseData.error?.message;
        break;
    }

    if (value !== undefined) {
      newVariables[variableIndex] = {
        ...newVariables[variableIndex],
        value,
      };
    }
  });

  return newVariables;
};

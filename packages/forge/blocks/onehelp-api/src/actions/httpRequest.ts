import { createAction, option } from "@typebot.io/forge";
import ky from "ky";
import { auth } from "../auth";

export const httpRequest = createAction({
  auth,
  name: "OneHelp API",
  parseBlockNodeLabel: (node) => {
    return `OneHelp API - ${node.selectedAction || "Selecionar ação"}`;
  },
  options: option.object({
    selectedAction: option.string.layout({
      label: "Selecionar ação",
      isRequired: true,
      placeholder: "Selecione uma requisição HTTP pré-configurada", 
      fetcher: "fetchActions",
      helperText: "Escolha uma das requisições HTTP configuradas nas credenciais",
    }),
    parameters: option.array(
      option.object({
        name: option.string.layout({
          label: "Parâmetro",
          isRequired: true,
          helperText: "Nome do parâmetro da action",
          fetcher: "fetchParameterNames",
        }),
        value: option.string.layout({
          label: "Valor",
          isRequired: true,
          helperText: "Valor que será usado na requisição (pode usar {{variavel}})",
        }),
      })
    ).layout({
      itemLabel: "parâmetro", 
      accordion: "Parâmetros da Requisição",
      helperText: "Configure os valores dos parâmetros da action selecionada",
    }),
    saveResultInVariable: option.string.layout({
      label: "Salvar resultado em variável",
      inputType: "variableDropdown",
      helperText: "Variável onde salvar a resposta da API",
    }),
  }),  fetchers: [
    {
      id: "fetchActions",
      fetch: async ({ credentials }) => {
        try {
          if (!credentials?.actions || !Array.isArray(credentials.actions)) {
            return { data: [] };
          }
          
          return {
            data: credentials.actions.map((action: any) => ({
              label: `OneHelp API - ${action.name || "Action sem nome"}`,
              value: action.name || "",
            }))
          };
        } catch (error) {
          return { 
            error: { 
              description: "Erro ao carregar actions pré-definidas" 
            }
          };
        }
      },
      dependencies: [],
    },
    {
      id: "fetchParameterNames",
      fetch: async ({ credentials, options }) => {
        try {
          if (!credentials?.actions || !options?.selectedAction) {
            return { data: [] };
          }
          
          const selectedActionConfig = credentials.actions.find((action: any) => action.name === options.selectedAction);
          if (!selectedActionConfig) {
            return { data: [] };
          }
          
          // Coleta todos os parâmetros da action
          const allParameters = new Set<string>();
          
          // Parâmetros da URL
          if (selectedActionConfig.urlParameters && Array.isArray(selectedActionConfig.urlParameters)) {
            selectedActionConfig.urlParameters.forEach((param: any) => {
              if (param.name) {
                allParameters.add(param.name);
              }
            });
          }
          
          // Parâmetros do Body
          if (selectedActionConfig.bodyParameters && Array.isArray(selectedActionConfig.bodyParameters)) {
            selectedActionConfig.bodyParameters.forEach((param: any) => {
              if (param.name) {
                allParameters.add(param.name);
              }
            });
          }
          
          return {
            data: Array.from(allParameters).map((paramName) => ({
              label: paramName,
              value: paramName
            }))
          };
        } catch (error) {
          return { 
            error: { 
              description: "Erro ao carregar parâmetros da action" 
            }
          };
        }
      },
      dependencies: ["selectedAction"],
    },
  ],
  run: {
    server: async ({
      credentials,
      options,
      variables,
      logs,
    }) => {
      const { apiUrl, apiToken, actions } = credentials;
      const { selectedAction, parameters, saveResultInVariable } = options;

      if (!selectedAction || !apiUrl || !apiToken) {
        logs.add({
          status: "error",
          description: "Action, URL da API ou token não configurados",
        });
        return;
      }

      // Encontra a action selecionada
      const actionConfig = actions?.find((action: any) => action.name === selectedAction);    
        if (!actionConfig || !actionConfig.endpoint || !actionConfig.method) {
        logs.add({
          status: "error",
          description: `Action "${selectedAction}" não encontrada ou incompleta`,
        });
        return;
      }

      try {
        // Montar URL com parâmetros
        let endpoint = actionConfig.endpoint;
        
        // Montar body JSON se necessário
        let body = undefined;
        const bodyObject: Record<string, any> = {};
        
        if (parameters && parameters.length > 0) {
          parameters.forEach((param: any) => {
            if (param.name && param.value) {
              // Se o parâmetro está na URL (endpoint), substitui
              if (endpoint.includes(`{{${param.name}}}`)) {
                endpoint = endpoint.replaceAll(`{{${param.name}}}`, param.value);              } else {
                // Senão, adiciona ao body para requisições POST/PUT/PATCH
                if (actionConfig.method && ['POST', 'PUT', 'PATCH'].includes(actionConfig.method)) {
                  bodyObject[param.name] = param.value;
                }
              }
            }
          });
            // Se tem dados no body, define o body
          if (Object.keys(bodyObject).length > 0) {
            body = bodyObject;
          }
        }

        const fullUrl = `${apiUrl.replace(/\/$/, '')}${endpoint}`;

        logs.add({
          status: "info",
          description: `Fazendo ${actionConfig.method} para: ${fullUrl}`,
        });

        // Fazer a requisição
        const response = await ky(fullUrl, {
          method: actionConfig.method,
          headers: {
            'Authorization': `Bearer ${apiToken}`,
            'Content-Type': 'application/json',
          },
          json: body,
        }).json();

        // Salvar resultado na variável
        if (saveResultInVariable) {
          variables.set([
            {
              id: saveResultInVariable,
              value: JSON.stringify(response),
            },
          ]);
        }

        logs.add({
          status: "success",
          description: `Requisição ${actionConfig.method} executada com sucesso`,
        });

      } catch (error) {
        logs.add({
          status: "error",
          description: `Erro na requisição: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
        });
      }
    },
  },
});

import { option } from '@typebot.io/forge'
import type { AuthDefinition } from '@typebot.io/forge/types'

export const auth = {
  type: 'encryptedCredentials',
  name: 'OneHelp API account',
  schema: option.object({
    apiUrl: option.string.layout({
      label: 'URL da API',
      isRequired: true,
      helperText: 'URL base da API (ex: https://api.exemplo.com)',
      withVariableButton: false,
    }),
    apiToken: option.string.layout({
      label: 'Token da API',
      isRequired: true,
      inputType: 'password',
      helperText: 'Token Bearer para autenticação na API',
      withVariableButton: false,
      isDebounceDisabled: true,
    }),
    actions: option.array(
      option.object({
        name: option.string.layout({
          label: 'Nome da Action',
          isRequired: true,
          helperText: 'Nome para identificar esta requisição HTTP',
        }),
        method: option.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH']).layout({
          label: 'Método HTTP',
          defaultValue: 'GET',
        }),
        endpoint: option.string.layout({
          label: 'Endpoint',
          isRequired: true,
          helperText: 'Caminho do endpoint (ex: /users ou /users/{{USER_ID}})',
        }),
        urlParameters: option.array(
          option.object({
            name: option.string.layout({
              label: 'Nome do Parâmetro',
              isRequired: true,
              helperText: 'Nome do parâmetro da URL (ex: USER_ID)',
            }),
            description: option.string.layout({
              label: 'Descrição',
              helperText: 'Descrição do parâmetro',
            }),
          })
        ).layout({
          itemLabel: 'parâmetro URL',
          accordion: 'Parâmetros da URL',
        }),
        bodyParameters: option.array(
          option.object({
            name: option.string.layout({
              label: 'Nome do Campo',
              isRequired: true,
              helperText: 'Nome do campo no body JSON',
            }),
            description: option.string.layout({
              label: 'Descrição',
              helperText: 'Descrição do campo',
            }),
          })
        ).layout({
          itemLabel: 'campo body',
          accordion: 'Parâmetros do Body',
        }),
      })
    ).layout({
      itemLabel: 'action',
      accordion: 'Actions HTTP',
      helperText: 'Defina requisições HTTP reutilizáveis',
    }),
  }),
} satisfies AuthDefinition

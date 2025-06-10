# Configuração do Azure OpenAI no tbot

Este guia mostra como configurar o Azure OpenAI no bloco OpenAI do tbot.

## Suas Credenciais Azure OpenAI

- **API Key**: `76wDTrhO9SjlF4JPAbCBtAhts6tmzRMS2OJvnLHzVgpbhhSQvqTiJQQJ99BEACYeBjFXJ3w3AAAAACOGILGQ`
- **Endpoint**: `https://onehelphub1721533523.openai.azure.com/`
- **API Version**: `2024-04-01-preview`
- **Model/Deployment**: `gpt-4o-mini`

## Configuração no tbot

### 1. Credenciais do OpenAI

No bloco OpenAI do tbot, configure as seguintes credenciais:

- **Chave API (API Key)**: `76wDTrhO9SjlF4JPAbCBtAhts6tmzRMS2OJvnLHzVgpbhhSQvqTiJQQJ99BEACYeBjFXJ3w3AAAAACOGILGQ`

- **URL base**: `https://onehelphub1721533523.openai.azure.com/openai/deployments/gpt-4o-mini`

- **Versão da API**: `2024-04-01-preview`

### 2. Configuração do Modelo

No campo do modelo, use: `gpt-4o-mini`

### Como Funciona

O Azure OpenAI requer uma URL base específica que inclui:
- O endpoint base: `https://onehelphub1721533523.openai.azure.com`
- O caminho para deployments: `/openai/deployments/`
- O nome do deployment: `gpt-4o-mini`

A biblioteca `@ai-sdk/openai` automaticamente:
- Detecta que é Azure OpenAI pelo formato da URL
- Usa o header `api-key` em vez de `Authorization: Bearer`
- Adiciona o parâmetro `api-version` nas queries

### Exemplo de Configuração Completa

```json
{
  "credentials": {
    "apiKey": "76wDTrhO9SjlF4JPAbCBtAhts6tmzRMS2OJvnLHzVgpbhhSQvqTiJQQJ99BEACYeBjFXJ3w3AAAAACOGILGQ",
    "baseUrl": "https://onehelphub1721533523.openai.azure.com/openai/deployments/gpt-4o-mini",
    "apiVersion": "2024-04-01-preview"
  },
  "model": "gpt-4o-mini"
}
```

### Teste a Configuração

1. Crie um novo bot no tbot
2. Adicione um bloco OpenAI
3. Configure as credenciais conforme acima
4. Defina o modelo como `gpt-4o-mini`
5. Teste com uma mensagem simples

### Troubleshooting

Se você encontrar erros:

1. **401 Unauthorized**: Verifique se a API key está correta
2. **404 Not Found**: Verifique se a URL base está correta e inclui o deployment
3. **400 Bad Request**: Verifique se a versão da API está correta

### Diferenças do OpenAI Padrão

| Aspecto | OpenAI Padrão | Azure OpenAI |
|---------|---------------|--------------|
| URL Base | `https://api.openai.com/v1` | `https://[resource].openai.azure.com/openai/deployments/[deployment]` |
| Autenticação | `Authorization: Bearer [key]` | `api-key: [key]` |
| Modelo | Nome do modelo (ex: `gpt-4`) | Nome do deployment (ex: `gpt-4o-mini`) |
| Versão API | Não necessária | Obrigatória (ex: `2024-04-01-preview`) |

## Modificações Realizadas

Foi feita uma atualização no arquivo `createChatCompletion.ts` para suportar o parâmetro `apiVersion` do Azure OpenAI:

```typescript
// Adicionado suporte ao apiVersion nas credenciais
credentials: { apiKey, baseUrl, apiVersion }

// Configuração do cliente OpenAI com apiVersion
createOpenAI({
  baseURL: baseUrl ?? options.baseUrl,
  apiKey,
  compatibility: "strict",
  ...(apiVersion && {
    defaultQuery: {
      "api-version": apiVersion,
    },
  }),
})(modelName)
```

Esta modificação garante que o parâmetro `api-version` seja incluído em todas as requisições quando configurado.

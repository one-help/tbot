import type { TElement, TText } from "@udecode/plate-common";
import { defaultNodeTypes } from "./serializer/ast-types";
import serialize from "./serializer/serialize";

const serializeNode = (
  acc: string[],
  node: TElement | TText,
  options?: { flavour?: "common" | "whatsapp" },
) => {
  const serializedElement = serialize(node, {
    nodeTypes: defaultNodeTypes,
    flavour: options?.flavour,
  });
  if (!serializedElement || serializedElement === "<br>\n\n") {
    return [...acc, "\n"];
  }
  return [...acc, serializedElement];
};

export const convertRichTextToMarkdown = (
  richText: TElement[],
  options?: { flavour?: "common" | "whatsapp" },
) => {
  const test = richText
    .reduce<string[]>((acc, node) => {
      if (node.type === "variable") {
        return [
          ...acc,
          ...node.children.reduce<string[]>((acc, node) => {
            return serializeNode(acc, node, options);
          }, []),
        ];
      }
      return serializeNode(acc, node, options);
    }, [])
    .join("");

  return test.endsWith("\n") ? test.slice(0, -1) : test;
};

// Função para WhatsApp: extrai header/body/footer do richText
export function extractHeaderBodyFooterFromRichText(richText: TElement[]) {
  let header = "";
  let footer = "";
  let body = "";

  for (const node of richText) {
    if (node.children && Array.isArray(node.children)) {
      for (const child of node.children) {
        if (child.code) {
          header +=
            serialize(child, {
              nodeTypes: defaultNodeTypes,
              flavour: "whatsapp",
            }) + "\n";
        } else if (child.subscript) {
          footer +=
            serialize(child, {
              nodeTypes: defaultNodeTypes,
              flavour: "whatsapp",
            }) + "\n";
        } else {
          body += serialize(child, {
            nodeTypes: defaultNodeTypes,
            flavour: "whatsapp",
          });
        }
      }
    } else if ((node as any).code) {
      header +=
        serialize(node, { nodeTypes: defaultNodeTypes, flavour: "whatsapp" }) +
        "\n";
    } else if ((node as any).subscript) {
      footer +=
        serialize(node, { nodeTypes: defaultNodeTypes, flavour: "whatsapp" }) +
        "\n";
    } else if ((node as any).text) {
      body += serialize(node, {
        nodeTypes: defaultNodeTypes,
        flavour: "whatsapp",
      });
    }
  }

  // Remove quebras extras
  header = header.trim();
  footer = footer.trim();
  body = body.trim();

  return { header, body, footer };
}

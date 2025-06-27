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
          header += (child.text || "") + "\n";
        } else if (child.subscript) {
          footer += (child.text || "") + "\n";
        } else {
          body += child.text || "";
        }
      }
    } else if (node.code) {
      header += (node.text || "") + "\n";
    } else if (node.subscript) {
      footer += (node.text || "") + "\n";
    } else if (node.text) {
      body += node.text;
    }
  }

  // Remove quebras extras
  header = header.trim();
  footer = footer.trim();
  body = body.trim();

  return { header, body, footer };
}

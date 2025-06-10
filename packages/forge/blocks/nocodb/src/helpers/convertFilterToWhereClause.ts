// See `where`: https://docs.nocodb.com/0.109.7/developer-resources/rest-apis/#query-params
// Example: (colName,eq,colValue)~or(colName2,gt,colValue2)

import { isEmpty } from "@typebot.io/lib/utils";

export const convertFilterToWhereClause = (
  filter:
    | {
        comparisons: {
          input?: string;
          operator?: string;
          value?: string;
        }[];
        joiner?: "AND" | "OR";
      }
    | undefined,
): string | undefined => {
  if (!filter || !filter.comparisons || filter.comparisons.length === 0) return;

  const where = filter.comparisons
    .map((comparison) => {
      switch (comparison.operator) {
        case "Não é igual a":
          return `(${comparison.input},ne,${comparison.value})`;
        case "Contém":
          return `(${comparison.input},like,%${comparison.value}%)`;
        case "Maior que":
          return `(${comparison.input},gt,${comparison.value})`;
        case "Menor que":
          return `(${comparison.input},lt,${comparison.value})`;
        case "Está definido":
          return `(${comparison.input},isnot,null)`;
        case "Está vazio":
          return `(${comparison.input},is,null)`;
        case "Começa com":
          return `(${comparison.input},like,${comparison.value}%)`;
        case "Termina com":
          return `(${comparison.input},like,%${comparison.value})`;
        default:
          return `(${comparison.input},eq,${comparison.value})`;
      }
    })
    .filter(Boolean)
    .join("~" + (filter.joiner === "OR" ? "or" : "and"));

  if (isEmpty(where)) return;
  return where;
};

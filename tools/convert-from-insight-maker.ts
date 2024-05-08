// SPDX-License-Identifier: AGPL-3.0-or-later
// This tool only runs during development for code generation and is not part of the final distribution.
// Hence, it can be licensed under different terms than the rest of the codebase.
import { strict as assert } from 'assert';
import lodash from 'lodash';
import { Console } from 'node:console';

import { loadInsightMaker } from 'simulation';

const logger = new Console(process.stderr);

function createTemplateFiller(
  strings: TemplateStringsArray,
  ...keys: string[]
) {
  return function fillTemplate(values: Record<string, string>) {
    const substrings: string[] = [];
    for (let i = 0; i < keys.length; i += 1) {
      substrings.push(strings[i]);
      const value = values[keys[i]];
      assert(
        typeof value !== 'undefined',
        `Value for key ${keys[i]} is missing`,
      );
      substrings.push(value);
    }
    substrings.push(strings[strings.length - 1]);
    return substrings.join('');
  };
}

const fillTemplate = createTemplateFiller`
// This file was auto-generated from the InsightMaker model. Do not edit it manually.
import type {
  ModelElementObject,
  ModelElementId,
  ModelElementArray,
  ModelRecord,
} from './model';

import { Model } from './model';

${'stockIdsString'}

${'flowIdsString'}

${'variableIdsString'}

${'parameterIdsString'}

type StockIds = typeof stockIds;
type StockId = ModelElementId<StockIds>;
type Stocks = ModelElementObject<StockIds>;
type StockArray = ModelElementArray<StockIds>;

type FlowIds = typeof flowIds;
type FlowId = ModelElementId<FlowIds>;
type Flows = ModelElementObject<FlowIds>;
type FlowArray = ModelElementArray<FlowIds>;

type VariableIds = typeof variableIds;
type VariableId = ModelElementId<VariableIds>;
type Variables = ModelElementObject<VariableIds>;
type VariableArray = ModelElementArray<VariableIds>;

type ParameterIds = typeof parameterIds;
type ParameterId = ModelElementId<ParameterIds>;
type Parameters = ModelElementObject<ParameterIds>;
type ParameterArray = ModelElementArray<ParameterIds>;

type Record = ModelRecord<StockIds, FlowIds, VariableIds, ParameterIds>;

class ${'className'} extends Model<
  StockIds,
  FlowIds,
  VariableIds,
  ParameterIds
> {
${'initialStocksString'}

${'initialParametersString'}

  constructor() {
    super(stockIds, flowIds, variableIds, parameterIds);
  }

${'modelEvaluatorString'}

${'flowPerStockAccumulatorString'}

}

export type {
  StockIds,
  StockId,
  Stocks,
  StockArray,
  FlowIds,
  FlowId,
  Flows,
  FlowArray,
  VariableIds,
  VariableId,
  Variables,
  VariableArray,
  ParameterIds,
  ParameterId,
  Parameters,
  ParameterArray,
  Record,
};

export { CircularEconomyModel, stockIds, flowIds, variableIds, parameterIds };
`;

const className = 'CircularEconomyModel';

function transformNameToJs(name: string): string {
  return lodash.camelCase(name);
}

function transformFormulaToJs(expression: string): string {
  const identifiers = [...expression.matchAll(/\[([\w- ]+)]/g)];
  let f = expression;
  identifiers.forEach((i) => {
    f = f.replaceAll(`[${i[1]}]`, `[${transformNameToJs(i[1])}]`);
  });
  f = f.replaceAll(/\s/g, '');
  f = f.replaceAll('Min(', 'Math.min(');
  f = f.replaceAll('Max(', 'Math.max(');

  f = f.replaceAll(/[[\]]/g, '');

  return f;
}

function getNamesFromExpression(expression: string): string[] {
  return lodash.uniq(
    [...expression.matchAll(/\[([\w- ]+)]/g)].map(([_, capture]) =>
      transformNameToJs(capture),
    ),
  );
}

type Stock = {
  type: 'stock';
  name: string;
  initialValue: string;
  arcs: [];
};

type Flow = {
  type: 'flow';
  name: string;
  formula: string;
  arcs: string[];
  start: string;
  end: string;
};

type Variable = {
  type: 'variable';
  name: string;
  formula: string;
  arcs: string[];
};

type Parameter = {
  type: 'parameter';
  name: string;
  initialValue: string;
  arcs: [];
};

type GraphNode = Stock | Flow | Variable | Parameter;
type Graph = GraphNode[];

function isStock(node: GraphNode): node is Stock {
  return node.type === 'stock';
}

function isFlow(node: GraphNode): node is Flow {
  return node.type === 'flow';
}

function isVariable(node: GraphNode): node is Variable {
  return node.type === 'variable';
}

function isParameter(node: GraphNode): node is Parameter {
  return node.type === 'parameter';
}

function isFlorOrVariable(node: GraphNode): node is Flow | Variable {
  return isFlow(node) || isVariable(node);
}

function topSortKahn(graph: Graph): GraphNode[] {
  type GraphNodeTopSort = {
    node: GraphNode;
    temporaryMark: boolean;
    permanentMark: boolean;
  };
  const G: GraphNodeTopSort[] = graph.map((node) => ({
    node,
    temporaryMark: false,
    permanentMark: false,
  }));
  const graphNameToNode = new Map<string, GraphNodeTopSort>(
    G.map((topSortNode) => [topSortNode.node.name, topSortNode]),
  );
  const L: GraphNode[] = [];

  function visit(n: GraphNodeTopSort) {
    /* eslint-disable no-param-reassign */
    logger.log(`visiting ${n.node.name}`);
    if (n.permanentMark) return;
    if (n.temporaryMark) throw new Error('Cycle detected: Not a DAG!');

    n.temporaryMark = true;

    n.node.arcs
      .map((mName) => {
        const node = graphNameToNode.get(mName);
        assert(
          node !== undefined,
          `Node ${n.node.name} has an arc to ${mName} which is not in the graph`,
        );
        return node;
      })
      .forEach(visit);

    n.temporaryMark = false;
    n.permanentMark = true;
    L.push(n.node);
  }

  let n = [...graphNameToNode.values()].find(
    (node) => !node.temporaryMark && !node.permanentMark,
  );
  while (typeof n !== 'undefined') {
    visit(n);
    n = [...graphNameToNode.values()].find(
      (node) => !node.temporaryMark && !node.permanentMark,
    );
  }

  return L;
}

function toIdArray(prefix: string, suffix: string, ids: string[]) {
  return `${prefix}[\n  ${ids.map((s) => `'${s}'`).join(',\n  ')},\n]${suffix}`;
}

function toInitialValueObject(
  prefix: string,
  suffix: string,
  elements: Stock[] | Parameter[],
) {
  return `${prefix}{\n  ${elements
    .map((e) => `${e.name}: ${e.initialValue}`)
    .join(',\n  ')},\n}${suffix}`;
}

function indent(s: string) {
  return s
    .split('\n')
    .map((l) => `  ${l}`)
    .join('\n');
}
function toModelEvaluator(graph: Graph) {
  const stocks: Stock[] = graph.filter(isStock);
  const flows: Flow[] = graph.filter(isFlow);
  const variables: Variable[] = graph.filter(isVariable);
  const parameters: Parameter[] = graph.filter(isParameter);

  const topSort = topSortKahn(graph);
  logger.log(topSort);
  const variablesAndFlowsTopSort: (Flow | Variable)[] =
    topSort.filter(isFlorOrVariable);

  const prefix = `// eslint-disable-next-line class-methods-use-this
public evaluate(stocks: Stocks, parameters: Parameters, t: number): Record {
  /* eslint-disable @typescript-eslint/no-unused-vars */`;

  const stockDestructuring = `const { ${stocks
    .map((e) => e.name)
    .join(', ')} } = stocks;`;
  const parameterDestructuring = `const { ${parameters
    .map((e) => e.name)
    .join(', ')} } = parameters;`;
  const variableAndStockEvaluation = variablesAndFlowsTopSort
    .map((e) => `const ${e.name} = ${e.formula};`)
    .join('\n');

  const variableRestructuring = `const variables = { ${variables
    .map((v) => v.name)
    .join(', ')} };`;
  const flowRestructuring = `const flows = { ${flows
    .map((f) => f.name)
    .join(', ')} };`;

  const suffix = `  return { t, stocks, parameters, variables, flows };
}`;

  return `${prefix}
${indent(stockDestructuring)}
${indent(parameterDestructuring)}

${indent(variableAndStockEvaluation)}

${indent(variableRestructuring)}
${indent(flowRestructuring)}
  
${suffix}
`;
}

function toFlowPerStockAccumulator(stocks: Stock[], flows: Flow[]) {
  const stockInOut = new Map(
    stocks.map((s) => [s.name, { in: [] as string[], out: [] as string[] }]),
  );
  flows.forEach((f) => {
    stockInOut.get(f.start)?.out.push(f.name);
    stockInOut.get(f.end)?.in.push(f.name);
  });
  const stockStrings = [...stockInOut.entries()]
    .map(([name, inOuts]) => {
      let sumString = '';
      if (inOuts.in.length === 0 && inOuts.out.length === 0) {
        sumString = '0.0';
      } else {
        if (inOuts.in.length > 0) sumString += `( ${inOuts.in.join(' + ')} )`;
        if (inOuts.out.length > 0) {
          sumString += `${
            sumString.length === 0 ? '' : ' '
          }- ( ${inOuts.out.join(' + ')} )`;
        }
      }
      return `${name}: ${sumString},`;
    })
    .join('\n');

  const flowDestructuring = `const { ${flows
    .map((e) => e.name)
    .join(', ')} } = flows;`;

  return `// eslint-disable-next-line class-methods-use-this
public accumulateFlowsPerStock(flows: Flows): Stocks {
  /* eslint-disable @typescript-eslint/no-unused-vars */
  ${flowDestructuring}
  
  const flowPerStock: Stocks = {
${indent(indent(stockStrings))}
  };
  
  return flowPerStock;
}
  `;
}

function compareByName(a: GraphNode, b: GraphNode) {
  if (a.name < b.name) {
    return -1;
  }
  if (a.name > b.name) {
    return 1;
  }

  // names must be equal
  return 0;
}

function convert(insightMakerModelXml: string) {
  const im = loadInsightMaker(insightMakerModelXml);

  const stocks: Stock[] = im.findStocks().map(
    (s): Stock => ({
      type: 'stock',
      name: transformNameToJs(s.name),
      initialValue: s.initial,
      arcs: [],
    }),
  );
  stocks.sort(compareByName);

  const flows: Flow[] = im.findFlows().map(
    (f): Flow => ({
      type: 'flow',
      name: transformNameToJs(f.name),
      formula: transformFormulaToJs(f.rate),
      arcs: getNamesFromExpression(f.rate),
      start: transformNameToJs(f.start?.name),
      end: transformNameToJs(f.end?.name),
    }),
  );
  flows.sort(compareByName);

  const variables: Variable[] = im
    .findVariables()
    .filter((v) => v.value.includes('['))
    .map((v: { name: string; value: string }) => ({
      type: 'variable',
      name: transformNameToJs(v.name),
      formula: transformFormulaToJs(v.value),
      arcs: getNamesFromExpression(v.value),
    }));
  variables.sort(compareByName);

  const parameters: Parameter[] = (
    im.findVariables() as { name: string; value: string }[]
  )
    .filter((v) => !v.value.includes('['))
    .map((p: { name: string; value: string }) => ({
      type: 'parameter',
      name: transformNameToJs(p.name),
      initialValue: transformFormulaToJs(p.value),
      arcs: [],
    }));
  parameters.sort(compareByName);

  logger.log({ stocks, flows, variables, parameters });

  const graph: Graph = [...stocks, ...flows, ...variables, ...parameters];

  const stockIdsString = toIdArray(
    'const stockIds = ',
    ' as const;',
    stocks.map(({ name }) => name),
  );

  const flowIdsString = toIdArray(
    'const flowIds = ',
    ' as const;',
    flows.map(({ name }) => name),
  );

  const variableIdsString = toIdArray(
    'const variableIds = ',
    ' as const;',
    variables.map(({ name }) => name),
  );

  const parameterIdsString = toIdArray(
    'const parameterIds = ',
    ' as const;',
    parameters.map(({ name }) => name),
  );

  const initialStocksString = toInitialValueObject(
    'public static readonly initialStocks: Readonly<Stocks> = ',
    ';',
    stocks,
  );

  const initialParametersString = toInitialValueObject(
    'public static readonly defaultParameters: Readonly<Parameters> = ',
    ';',
    parameters,
  );

  const modelEvaluatorString = toModelEvaluator(graph);

  const flowPerStockAccumulatorString = toFlowPerStockAccumulator(
    stocks,
    flows,
  );

  logger.log(graph);

  const substitutions = {
    className,
    stockIdsString,
    flowIdsString,
    variableIdsString,
    parameterIdsString,
    initialStocksString,
    initialParametersString,
    modelEvaluatorString,
    flowPerStockAccumulatorString,
  };

  const code = fillTemplate(substitutions);
  return code;
}

async function streamToString(stream: NodeJS.ReadableStream): Promise<string> {
  // lets have a ReadableStream as a stream variable
  const chunks = [];

  // eslint-disable-next-line no-restricted-syntax
  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk));
  }

  return Buffer.concat(chunks).toString('utf-8');
}

streamToString(process.stdin)
  .then(convert)
  .then((boxModelCode) => {
    process.stdout.write(boxModelCode);
  })
  .catch((err) => logger.error(err));

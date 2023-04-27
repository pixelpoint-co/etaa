// import { ConversionDagreGraph } from '@ant-design/graphs';
import { useCallback } from 'react';
import styled from 'styled-components';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from 'reactflow';
import {
  map, every,
} from 'lodash';

import 'reactflow/dist/style.css';

import Flex from '../../components/atoms/Flex';

import useProductData from '../../hooks/useProductData';

const Wrapper = styled(Flex)`
  height: 100%;
`;

// const initialNodes = [
//   {
//     id: '1',
//     position: {
//       x: 0,
//       y: 0,
//     },
//     data: { label: '1' },
//   },
//   {
//     id: '2',
//     position: {
//       x: 0,
//       y: 100,
//     },
//     data: { label: '2' },
//   },
// ];

// const initialEdges = [{
//   id: 'e1-2',
//   source: '1',
//   target: '2',
// }];
const mapProductToNode = (product, i, edges) => {
  const id = String(product.id);
  const productEdges = edges.filter((edge) => edge.source === id || edge.target === id);
  const isTop = every(productEdges, (edge) => edge.target !== id);
  const isBottom = every(productEdges, (edge) => edge.source !== id);
  return {
    id: String(product.id),
    position: {
      x: (i) * 200,
      y: isTop ? 0 : (isBottom ? 400 : 200),
    },
    data: { label: product.name },
  };
};
const mapIngredientToEdge = (ingredient) => {
  console.log(ingredient);
  return {
    id: `${ingredient.startVertexId}-${ingredient.endVertexId}`,
    source: String(ingredient.startVertexId),
    target: String(ingredient.endVertexId),
    label: ingredient.amount,
  };
};

const Flow = (props) => {
  const {
    nodes: initialNodes,
    edges: initialEdges,
  } = props;
  const [
    nodes,
    setNodes,
    onNodesChange,
  ] = useNodesState(initialNodes);
  const [
    edges,
    setEdges,
    onEdgesChange,
  ] = useEdgesState(initialEdges);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);
  console.log(nodes);
  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
    >
      <MiniMap />
      <Controls />
      <Background />
    </ReactFlow>
  );
};

const TreeView = (props) => {
  const {
    productListData,
    ingredientListData,
    loading,
    error,
  } = useProductData();
  if (loading) return null;
  const edges = map(ingredientListData, mapIngredientToEdge);
  const nodes = map(productListData, (product, i) => mapProductToNode(product, i, edges));
  console.log(productListData);
  console.log(ingredientListData);
  console.log(nodes);
  console.log(edges);
  return (
    <Wrapper>
      <Flow
        nodes={nodes}
        edges={edges}
      />
    </Wrapper>
  );
};

export default TreeView;

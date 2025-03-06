import React, { FC, useCallback } from 'react';
import {
  ReactFlow,
  Controls,
  MiniMap,
  Background,
  Node,
  Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import FormNode from './FormNode';
import { NodeData, EdgeData } from '../types';

interface GraphProps {
  nodes: NodeData[];
  edges: EdgeData[];
  onNodeSelect: (nodeId: string) => void;
}

// Register our custom node under the "formNode" type
const nodeTypes = {
  formNode: FormNode,
};

const Graph: FC<GraphProps> = ({ nodes, edges, onNodeSelect }) => {
  // Handle node clicks. We explicitly annotate "node" as Node<any> to satisfy type expectations.
  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: Node<any>) => {
      onNodeSelect(node.id);
    },
    [onNodeSelect]
  );

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        // Cast nodes and edges to match the expected types
        nodes={nodes as Node<any>[]}
        edges={edges as Edge<any>[]}
        nodeTypes={nodeTypes}
        onNodeClick={handleNodeClick}
        fitView
        fitViewOptions={{ padding: 0.4 }}
        defaultEdgeOptions={{
          type: 'smoothstep',
          style: { stroke: '#9CA8B3' },
        }}
      >
        <Controls />
        <MiniMap />
        <Background />
      </ReactFlow>
    </div>
  );
};

export default Graph;

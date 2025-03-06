import React, { FC, useCallback, useMemo } from 'react';
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

const Graph: FC<GraphProps> = ({ nodes, edges, onNodeSelect }) => {
  // Memoizing node types to prevent unnecessary re-renders
  const nodeTypes = useMemo(() => ({ formNode: FormNode }), []);

  // Handles node clicks and triggers selection
  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: Node<any>) => {
      onNodeSelect(node.id);
    },
    [onNodeSelect]
  );

  return (
    <div style={styles.graphContainer}>
      <ReactFlow
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
        panOnScroll
        zoomOnScroll
        zoomOnDoubleClick
      >
        <Controls />
        <MiniMap
          nodeColor={() => '#4664F5'} // Default node color in MiniMap
          maskColor="rgba(72, 76, 122, 0.1)" // Subtle overlay color
        />
        <Background />
      </ReactFlow>
    </div>
  );
};

export default Graph;

// Styles for Graph Container
const styles: Record<string, React.CSSProperties> = {
  graphContainer: {
    width: '100%',
    height: '100vh', // Ensures the graph takes full height
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F7F9FC', // Light gray background for a cleaner look
  },
};

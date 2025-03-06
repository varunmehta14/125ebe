import React, { useEffect, useState } from 'react';
import Graph from './components/Graph';
import PrefillPanel from './components/PrefillPanel';
import { NodeData, EdgeData } from './types';

const API_URL = 'http://localhost:3000/api/v1/namespace/actions/blueprints/blueprintId/graph';

function App() {
  const [nodes, setNodes] = useState<NodeData[]>([]);
  const [edges, setEdges] = useState<EdgeData[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        const { nodes: newNodes, edges: newEdges } = transformData(data);
        setNodes(newNodes);
        setEdges(newEdges);
      })
      .catch((error) => {
        console.error('Error fetching graph data:', error);
      });
  }, []);

  function transformData(data: any): { nodes: NodeData[]; edges: EdgeData[] } {
    const formSchemas: Record<string, string[]> = {};
  
    // Correctly map each form's component_id to its fields
    data.forms.forEach((form: any) => {
      formSchemas[form.id] = Object.keys(form.field_schema?.properties || []);
    });
  
    console.log("Form Schemas:", formSchemas); // Debugging logs
  
    const newNodes: NodeData[] = data.nodes.map((n: any) => {
      const formId = n.data.component_id; // Each node has a component_id linking to a form
  
      return {
        id: n.id,
        type: 'formNode',
        position: { x: n.position.x, y: n.position.y },
        data: {
          label: n.data.name || 'Untitled Form',
          formFields: formSchemas[formId] || [], 
          prefillConfig: n.data.prefillConfig || {},
        },
      };
    });
  
    console.log("Transformed Nodes:", newNodes); // Debugging logs
  
    const newEdges: EdgeData[] = data.edges.map((e: any) => ({
      id: `edge-${e.source}-${e.target}`,
      source: e.source,
      target: e.target,
    }));
  
    return { nodes: newNodes, edges: newEdges };
  }
  

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ flex: 1 }}>
        <Graph
          nodes={nodes}
          edges={edges}
          onNodeSelect={(nodeId) => setSelectedNodeId(nodeId)}
        />
      </div>

      {selectedNodeId && (
        <div style={{ width: 300, borderLeft: '1px solid #ddd' }}>
          <PrefillPanel
            nodeId={selectedNodeId}
            nodes={nodes}
            edges={edges}
            setNodes={setNodes}
            onClose={() => setSelectedNodeId(null)}
          />
        </div>
      )}
    </div>
  );
}

export default App;

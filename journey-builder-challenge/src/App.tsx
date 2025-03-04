// // src/App.tsx
// import React, { useEffect, useState } from 'react';
// import { Node as XYNode, Edge as XYEdge } from '@xyflow/react';

// import Graph from './components/Graph';
// import PrefillPanel from './components/PrefillPanel';
// import { NodeData, EdgeData } from './types';

// // Replace with your actual API endpoint if needed
// const API_URL = 'http://localhost:3000/api/v1/namespace/actions/blueprints/blueprintId/graph';

// function App() {
//   // Use NodeData and EdgeData as state types
//   const [nodes, setNodes] = useState<NodeData[]>([]);
//   const [edges, setEdges] = useState<EdgeData[]>([]);
//   const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

//   useEffect(() => {
//     fetch(API_URL)
//       .then((res) => res.json())
//       .then((data) => {
//         const { nodes: newNodes, edges: newEdges } = transformData(data);
//         setNodes(newNodes);
//         setEdges(newEdges);
//       })
//       .catch((error) => {
//         console.error('Error fetching graph data:', error);
//       });
//   }, []);

//   // Transform raw data into arrays conforming to NodeData and EdgeData
//   function transformData(data: any): { nodes: NodeData[]; edges: EdgeData[] } {
//     const newNodes: NodeData[] = data.nodes.map((n: any) => ({
//       id: n.id,
//       type: 'formNode', // Ensure your custom node type is used
//       position: { x: n.position.x, y: n.position.y },
//       data: {
//         label: n.data.name || 'Untitled Form',
//         // You can attach additional properties if available:
//         formFields: n.data.formFields || [],
//         prefillConfig: n.data.prefillConfig || {},
//       },
//       // Explicitly set width/height as undefined (not null)
//       width: undefined,
//       height: undefined,
//     }));

//     const newEdges: EdgeData[] = data.edges.map((e: any) => ({
//       id: `edge-${e.source}-${e.target}`,
//       source: e.source,
//       target: e.target,
//     }));

//     return { nodes: newNodes, edges: newEdges };
//   }

//   return (
//     <div style={{ display: 'flex', height: '100vh' }}>
//       {/* Left side: Graph */}
//       <div style={{ flex: 1 }}>
//         <Graph
//           nodes={nodes}
//           edges={edges}
//           onNodeSelect={(nodeId) => setSelectedNodeId(nodeId)}
//         />
//       </div>

//       {/* Right side: Prefill Panel */}
//       <div style={{ width: 300, borderLeft: '1px solid #ddd' }}>
//         {selectedNodeId && (
//           <PrefillPanel
//             nodeId={selectedNodeId}
//             nodes={nodes}
//             setNodes={setNodes}
//             onClose={() => setSelectedNodeId(null)}
//           />
//         )}
//       </div>
//     </div>
//   );
// }

// export default App;


// src/App.tsx
// import React, { useEffect, useState } from 'react';
// import { Node as XYNode, Edge as XYEdge } from '@xyflow/react';

// import Graph from './components/Graph';
// import PrefillPanel from './components/PrefillPanel';
// import { NodeData, EdgeData } from './types';

// const API_URL = 'http://localhost:3000/api/v1/namespace/actions/blueprints/blueprintId/graph';

// function App() {
//   const [nodes, setNodes] = useState<NodeData[]>([]);
//   const [edges, setEdges] = useState<EdgeData[]>([]);
//   const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

//   useEffect(() => {
//     fetch(API_URL)
//       .then((res) => res.json())
//       .then((data) => {
//         const { nodes: newNodes, edges: newEdges } = transformData(data);
//         setNodes(newNodes);
//         setEdges(newEdges);
//       })
//       .catch((error) => {
//         console.error('Error fetching graph data:', error);
//       });
//   }, []);

//   /**
//    * Transform the raw JSON into NodeData[] and EdgeData[].
//    * 1) Build a map of form IDs -> array of field names from data.forms
//    * 2) For each node, find its associated form ID and attach the correct fields
//    */
//   function transformData(data: any): { nodes: NodeData[]; edges: EdgeData[] } {
//     // Build a map: formId -> array of field names
//     const formFieldsMap: Record<string, string[]> = {};
//     if (data.forms && Array.isArray(data.forms)) {
//       data.forms.forEach((form: any) => {
//         const fieldNames = Object.keys(form.field_schema?.properties || {});
//         formFieldsMap[form.id] = fieldNames;
//       });
//     }

//     // Convert nodes
//     const newNodes: NodeData[] = data.nodes.map((n: any) => {
//       // The node's associated form ID (e.g. "f_01jk7ap2...")
//       const formId = n.data.component_id;
//       const fields = formFieldsMap[formId] || [];

//       return {
//         id: n.id,
//         type: 'formNode', // link to our custom node component
//         position: { x: n.position.x, y: n.position.y },
//         data: {
//           label: n.data.name || 'Untitled Form',
//           formFields: fields,
//           prefillConfig: {}, // empty object by default
//         },
//         // Make sure width/height are undefined (not null)
//         width: undefined,
//         height: undefined,
//       };
//     });

//     // Convert edges
//     const newEdges: EdgeData[] = data.edges.map((e: any) => ({
//       id: `edge-${e.source}-${e.target}`,
//       source: e.source,
//       target: e.target,
//     }));

//     return { nodes: newNodes, edges: newEdges };
//   }

//   return (
//     <div style={{ display: 'flex', height: '100vh' }}>
//       {/* Left side: Graph rendering */}
//       <div style={{ flex: 1 }}>
//         <Graph
//           nodes={nodes}
//           edges={edges}
//           onNodeSelect={(nodeId) => setSelectedNodeId(nodeId)}
//         />
//       </div>

//       {/* Right side: Prefill Panel for the selected node */}
//       <div style={{ width: 300, borderLeft: '1px solid #ddd' }}>
//         {selectedNodeId && (
//           <PrefillPanel
//             nodeId={selectedNodeId}
//             nodes={nodes}
//             edges={edges}      
//             setNodes={setNodes}
//             onClose={() => setSelectedNodeId(null)}
//           />
          
//         )}
//       </div>
//     </div>
//   );
// }

// export default App;



// src/App.tsx
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
  
    // ✅ Correctly map each form's component_id to its fields
    data.forms.forEach((form: any) => {
      formSchemas[form.id] = Object.keys(form.field_schema?.properties || []);
    });
  
    console.log("📌 Form Schemas:", formSchemas); // Debugging logs
  
    const newNodes: NodeData[] = data.nodes.map((n: any) => {
      const formId = n.data.component_id; // Each node has a component_id linking to a form
  
      return {
        id: n.id,
        type: 'formNode',
        position: { x: n.position.x, y: n.position.y },
        data: {
          label: n.data.name || 'Untitled Form',
          formFields: formSchemas[formId] || [], // ✅ Correct field mapping
          prefillConfig: n.data.prefillConfig || {},
        },
      };
    });
  
    console.log("✅ Transformed Nodes:", newNodes); // Debugging logs
  
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

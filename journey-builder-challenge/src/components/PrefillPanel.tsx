// // src/components/PrefillPanel.tsx
// import React, { FC, useState } from 'react';
// import PrefillModal from './PrefillModal';
// import { NodeData } from '../types';

// interface PrefillPanelProps {
//   nodeId: string;
//   nodes: NodeData[];
//   setNodes: React.Dispatch<React.SetStateAction<NodeData[]>>;
//   onClose: () => void;
// }

// const PrefillPanel: FC<PrefillPanelProps> = ({ nodeId, nodes, setNodes, onClose }) => {
//   const [showModal, setShowModal] = useState(false);
//   const [selectedField, setSelectedField] = useState<string | null>(null);

//   // Find the selected node and cast it to NodeData
//   const node = nodes.find((n: NodeData) => n.id === nodeId);
//   if (!node) return null;

//   // Ensure that formFields and prefillConfig are defined
//   const formFields = node.data.formFields || [];
//   const prefillConfig = node.data.prefillConfig || {};

//   const handleClear = (fieldName: string) => {
//     setNodes((prev) =>
//       (prev as NodeData[]).map((n: NodeData) => {
//         if (n.id === nodeId) {
//           return {
//             ...n,
//             data: {
//               ...n.data,
//               prefillConfig: {
//                 ...(n.data.prefillConfig || {}),
//                 [fieldName]: null,
//               },
//             },
//             // Ensure width/height are not null
//             width: n.width === null ? undefined : n.width,
//             height: n.height === null ? undefined : n.height,
//           };
//         }
//         return n;
//       })
//     );
//   };

//   const handleOpenModal = (fieldName: string) => {
//     setSelectedField(fieldName);
//     setShowModal(true);
//   };

//   return (
//     <div style={{ padding: '1rem' }}>
//       <button onClick={onClose} style={{ float: 'right' }}>
//         Close
//       </button>
//       <h3>Prefill for {node.data.label || nodeId}</h3>

//       <div style={{ marginTop: '2rem' }}>
//         {formFields.map((fieldName: string) => {
//           const configValue = prefillConfig[fieldName];
//           return (
//             <div
//               key={fieldName}
//               style={{
//                 display: 'flex',
//                 justifyContent: 'space-between',
//                 alignItems: 'center',
//                 marginBottom: '8px',
//               }}
//             >
//               <div>
//                 <strong>{fieldName}</strong>
//                 {configValue ? `: ${configValue}` : ''}
//               </div>
//               {configValue ? (
//                 <button onClick={() => handleClear(fieldName)}>X</button>
//               ) : (
//                 <button onClick={() => handleOpenModal(fieldName)}>Set</button>
//               )}
//             </div>
//           );
//         })}
//       </div>

//       {showModal && selectedField && (
//         <PrefillModal
//           nodeId={nodeId}
//           fieldName={selectedField}
//           onClose={() => {
//             setShowModal(false);
//             setSelectedField(null);
//           }}
//           onSave={(sourceValue) => {
//             setNodes((prev) =>
//               (prev as NodeData[]).map((n: NodeData) => {
//                 if (n.id === nodeId) {
//                   return {
//                     ...n,
//                     data: {
//                       ...n.data,
//                       prefillConfig: {
//                         ...(n.data.prefillConfig || {}),
//                         [selectedField]: sourceValue,
//                       },
//                     },
//                     width: n.width === null ? undefined : n.width,
//                     height: n.height === null ? undefined : n.height,
//                   };
//                 }
//                 return n;
//               })
//             );
//             setShowModal(false);
//             setSelectedField(null);
//           }}
//         />
//       )}
//     </div>
//   );
// };

// export default PrefillPanel;


// src/components/PrefillPanel.tsx

// import React, { FC, useState } from 'react';
// import PrefillModal from './PrefillModal';
// import { NodeData, EdgeData } from '../types';

// interface PrefillPanelProps {
//   nodeId: string;
//   nodes: NodeData[];
//   edges: EdgeData[]; // <-- Add edges so we can pass them to PrefillModal
//   setNodes: React.Dispatch<React.SetStateAction<NodeData[]>>;
//   onClose: () => void;
// }

// const PrefillPanel: FC<PrefillPanelProps> = ({
//   nodeId,
//   nodes,
//   edges,
//   setNodes,
//   onClose,
// }) => {
//   const [showModal, setShowModal] = useState(false);
//   const [selectedField, setSelectedField] = useState<string | null>(null);

//   // Find the selected node
//   const node = nodes.find((n: NodeData) => n.id === nodeId);
//   if (!node) return null;

//   // Extract form fields & prefill config
//   const formFields = node.data.formFields || [];
//   const prefillConfig = node.data.prefillConfig || {};

//   // Clear a field's prefill
//   const handleClear = (fieldName: string) => {
//     setNodes((prev) =>
//       prev.map((n: NodeData) => {
//         if (n.id === nodeId) {
//           return {
//             ...n,
//             data: {
//               ...n.data,
//               prefillConfig: {
//                 ...(n.data.prefillConfig || {}),
//                 [fieldName]: null,
//               },
//             },
//             width: n.width === null ? undefined : n.width,
//             height: n.height === null ? undefined : n.height,
//           };
//         }
//         return n;
//       })
//     );
//   };

//   // Open the modal for a field with no prefill
//   const handleOpenModal = (fieldName: string) => {
//     setSelectedField(fieldName);
//     setShowModal(true);
//   };

//   // Save the chosen data source for a field
//   const handleSave = (sourceValue: string | null) => {
//     setNodes((prev) =>
//       prev.map((n: NodeData) => {
//         if (n.id === nodeId) {
//           return {
//             ...n,
//             data: {
//               ...n.data,
//               prefillConfig: {
//                 ...(n.data.prefillConfig || {}),
//                 [selectedField as string]: sourceValue,
//               },
//             },
//             width: n.width === null ? undefined : n.width,
//             height: n.height === null ? undefined : n.height,
//           };
//         }
//         return n;
//       })
//     );
//     setShowModal(false);
//     setSelectedField(null);
//   };

//   return (
//     <div style={{ padding: '1rem' }}>
//       <button onClick={onClose} style={{ float: 'right' }}>
//         Close
//       </button>
//       <h3>Prefill for {node.data.label || nodeId}</h3>

//       <div style={{ marginTop: '2rem' }}>
//         {formFields.map((fieldName) => {
//           const configValue = prefillConfig[fieldName];
//           return (
//             <div
//               key={fieldName}
//               style={{
//                 display: 'flex',
//                 justifyContent: 'space-between',
//                 alignItems: 'center',
//                 marginBottom: '8px',
//               }}
//             >
//               <div>
//                 <strong>{fieldName}</strong>
//                 {configValue ? `: ${configValue}` : ''}
//               </div>
//               {configValue ? (
//                 <button onClick={() => handleClear(fieldName)}>X</button>
//               ) : (
//                 <button onClick={() => handleOpenModal(fieldName)}>Set</button>
//               )}
//             </div>
//           );
//         })}
//       </div>

//       {showModal && selectedField && (
//         <PrefillModal
//           nodeId={nodeId}
//           fieldName={selectedField}
//           // Pass the entire graph so the modal can do DAG lookups:
//           graph={{ nodes, edges }}
//           onClose={() => {
//             setShowModal(false);
//             setSelectedField(null);
//           }}
//           onSave={handleSave}
//         />
//       )}
//     </div>
//   );
// };

// export default PrefillPanel;

import React, { FC, useState, useEffect } from 'react';
import PrefillModal from './PrefillModal';
import { NodeData, EdgeData } from '../types';

interface PrefillPanelProps {
  nodeId: string;
  nodes: NodeData[];
  edges: EdgeData[];
  
  setNodes: React.Dispatch<React.SetStateAction<NodeData[]>>;
  onClose: () => void;
}

const PrefillPanel: FC<PrefillPanelProps> = ({
  nodeId,
  nodes,
  edges,
  setNodes,
  onClose,
}) => {

 // Traverse DAG to find direct & transitive dependencies
 useEffect(() => {
    const getDependencies = (currentNodeId: string, visited = new Set()): NodeData[] => {
      if (visited.has(currentNodeId)) return [];
      visited.add(currentNodeId);

      const directParents = edges
        .filter((e) => e.target === currentNodeId)
        .map((e) => nodes.find((n) => n.id === e.source))
        .filter((n): n is NodeData => !!n); // Ensure nodes are valid

      return [...directParents, ...directParents.flatMap((p) => getDependencies(p.id, visited))];
    };

    setDependencyForms(getDependencies(nodeId));
  }, [nodeId, nodes, edges]);
  const [showModal, setShowModal] = useState(false);
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [dependencyForms, setDependencyForms] = useState<NodeData[]>([]);

  // Find the selected node
  const node = nodes.find((n) => n.id === nodeId);
  if (!node) return null;

  const formFields = node.data.formFields || [];
  console.log("node", node)
  const prefillConfig = node.data.prefillConfig || {};

 

  // Clear a field's prefill
  const handleClear = (fieldName: string) => {
    setNodes((prev) =>
      prev.map((n) =>
        n.id === nodeId
          ? {
              ...n,
              data: {
                ...n.data,
                prefillConfig: {
                  ...(n.data.prefillConfig || {}),
                  [fieldName]: null,
                },
              },
            }
          : n
      )
    );
  };

  // Open the modal for a field with no prefill
  const handleOpenModal = (fieldName: string) => {
    setSelectedField(fieldName);
    setShowModal(true);
  };

  // Save the chosen prefill value
  const handleSave = (sourceValue: string | null) => {
    setNodes((prev) =>
      prev.map((n) =>
        n.id === nodeId
          ? {
              ...n,
              data: {
                ...n.data,
                prefillConfig: {
                  ...(n.data.prefillConfig || {}),
                  [selectedField as string]: sourceValue,
                },
              },
            }
          : n
      )
    );
    setShowModal(false);
    setSelectedField(null);
  };

  // Function to get form label from node ID
  const getFormLabel = (formId: string): string => {
    const form = nodes.find((n) => n.id === formId);
    return form ? form.data.label : formId; // Fallback to ID if no label is found
  };


  return (
    <div style={styles.panel}>
      <div style={styles.headerRow}>
        <h4 style={{ margin: 0 }}>Prefill</h4>
        <button onClick={onClose} style={styles.closeButton}>
          Close
        </button>
      </div>

      <p style={styles.subtitle}>Prefill fields for this form</p>

      <div style={{ marginTop: '1rem' }}>
        {formFields.map((fieldName) => {
          const configValue = prefillConfig[fieldName];

          let displayLabel = configValue;
          if (configValue && configValue.includes('.')) {
            const [sourceNodeId, field] = configValue.split('.');
            displayLabel = `${getFormLabel(sourceNodeId)}.${field}`;
          }

          return (
            <div key={fieldName} style={styles.fieldRow}>
              <div style={styles.fieldIcon}>🗄</div>
              <div style={{ flex: 1 }}>
                {configValue ? (
                  <span style={{ fontWeight: 500 }}>{fieldName}:{displayLabel}</span>
                ) : (
                  <span style={{ color: '#555' }}>{fieldName}</span>
                )}
              </div>
              {configValue ? (
                <button onClick={() => handleClear(fieldName)} style={styles.clearButton}>
                  X
                </button>
              ) : (
                <button onClick={() => handleOpenModal(fieldName)} style={styles.setButton}>
                  Set
                </button>
              )}
            </div>
          );
        })}
      </div>

      {showModal && selectedField && (
        <PrefillModal
          nodeId={getFormLabel(nodeId)}
          fieldName={selectedField}
          dependencyForms={dependencyForms} // Pass computed dependencies
          onClose={() => {
            setShowModal(false);
            setSelectedField(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default PrefillPanel;

// Inline styles
const styles: Record<string, React.CSSProperties> = {
  panel: {
    padding: '1rem',
    borderLeft: '1px solid #ddd',
    width: '300px',
    fontFamily: 'Arial, sans-serif',
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.5rem',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#666',
  },
  subtitle: {
    fontSize: '14px',
    color: '#666',
  },
  fieldRow: {
    display: 'flex',
    alignItems: 'center',
    padding: '0.5rem',
    border: '1px dashed #ddd',
    borderRadius: '4px',
    marginBottom: '0.5rem',
  },
  fieldIcon: {
    width: '24px',
    height: '24px',
    backgroundColor: '#4664F5',
    color: '#fff',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '8px',
    fontSize: '14px',
  },
  clearButton: {
    background: 'none',
    border: 'none',
    color: '#666',
    cursor: 'pointer',
    marginLeft: '8px',
  },
  setButton: {
    backgroundColor: '#4664F5',
    color: '#fff',
    border: 'none',
    padding: '4px 8px',
    borderRadius: '4px',
    cursor: 'pointer',
    marginLeft: '8px',
  },
};

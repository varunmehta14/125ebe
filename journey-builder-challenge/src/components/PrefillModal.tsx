// // import React, { FC, useState } from 'react';

// // interface PrefillModalProps {
// //   nodeId: string;
// //   fieldName: string;
// //   onClose: () => void;
// //   onSave: (sourceValue: string | null) => void;
// // }

// // const PrefillModal: FC<PrefillModalProps> = ({ nodeId, fieldName, onClose, onSave }) => {
// //   // Hardcoded data sources for demonstration:
// //   const dataSources = [
// //     { label: 'Form A - email', value: 'FormA.email' },
// //     { label: 'Form B - name', value: 'FormB.name' },
// //     { label: 'Global - clientName', value: 'Global.clientName' },
// //     { label: 'Global - actionProperties', value: 'Global.actionProperties' },
// //   ];

// //   const [selectedSource, setSelectedSource] = useState<string>('');

// //   const handleSelect = () => {
// //     onSave(selectedSource || null);
// //   };

// //   return (
// //     <div style={styles.overlay}>
// //       <div style={styles.modal}>
// //         <h4>Select data element to map</h4>
// //         <p>
// //           Configuring prefill for <strong>{fieldName}</strong> on Node{' '}
// //           <strong>{nodeId}</strong>.
// //         </p>

// //         <select
// //           style={styles.input}
// //           value={selectedSource}
// //           onChange={(e) => setSelectedSource(e.target.value)}
// //         >
// //           <option value="">-- Choose a source --</option>
// //           {dataSources.map((ds) => (
// //             <option key={ds.value} value={ds.value}>
// //               {ds.label}
// //             </option>
// //           ))}
// //         </select>

// //         <div style={styles.buttonRow}>
// //           <button onClick={handleSelect}>Select</button>
// //           <button onClick={onClose} style={{ marginLeft: '10px' }}>
// //             Cancel
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // const styles: Record<string, React.CSSProperties> = {
// //   overlay: {
// //     position: 'fixed',
// //     top: 0,
// //     left: 0,
// //     right: 0,
// //     bottom: 0,
// //     backgroundColor: 'rgba(0,0,0,0.5)',
// //     display: 'flex',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //   },
// //   modal: {
// //     backgroundColor: 'white',
// //     padding: '1rem',
// //     borderRadius: '4px',
// //     width: '300px',
// //   },
// //   input: {
// //     width: '100%',
// //     marginBottom: '1rem',
// //   },
// //   buttonRow: {
// //     display: 'flex',
// //     justifyContent: 'flex-end',
// //   },
// // };

// // export default PrefillModal;

// import React, { FC, useEffect, useState } from 'react';

// // Example types - adjust them to match your code
// import { NodeData, EdgeData } from '../types';

// interface DataSource {
//   label: string;
//   value: string;
// }

// interface PrefillModalProps {
//   nodeId: string;
//   fieldName: string;
//   graph: {
//     nodes: NodeData[];
//     edges: EdgeData[];
//   };
//   onClose: () => void;
//   onSave: (sourceValue: string | null) => void;
// }

// const PrefillModal: FC<PrefillModalProps> = ({
//   nodeId,
//   fieldName,
//   graph,
//   onClose,
//   onSave,
// }) => {
//   const [dataSources, setDataSources] = useState<DataSource[]>([]);
//   const [selectedSource, setSelectedSource] = useState('');

//   // 1. Gather data sources (direct deps, transitive deps, global)
//   useEffect(() => {
//     const ds = gatherDataSources(nodeId, graph);
//     setDataSources(ds);
//   }, [nodeId, graph]);

//   const handleSelect = () => {
//     onSave(selectedSource || null);
//   };

//   return (
//     <div style={styles.overlay}>
//       <div style={styles.modal}>
//         <h4>Select data element to map</h4>
//         <p>
//           Configuring prefill for <strong>{fieldName}</strong> on Node{' '}
//           <strong>{nodeId}</strong>.
//         </p>

//         <select
//           style={styles.input}
//           value={selectedSource}
//           onChange={(e) => setSelectedSource(e.target.value)}
//         >
//           <option value="">-- Choose a source --</option>
//           {dataSources.map((ds) => (
//             <option key={ds.value} value={ds.value}>
//               {ds.label}
//             </option>
//           ))}
//         </select>

//         <div style={styles.buttonRow}>
//           <button onClick={handleSelect}>Select</button>
//           <button onClick={onClose} style={{ marginLeft: '10px' }}>
//             Cancel
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// /** 
//  * Combine direct dependencies, transitive dependencies, and global data
//  * into a single flat list of data sources. 
//  */
// function gatherDataSources(
//   nodeId: string,
//   graph: { nodes: NodeData[]; edges: EdgeData[] }
// ): DataSource[] {
//   // 1. Direct dependencies
//   const directDeps = getDirectDependencies(nodeId, graph);

//   // 2. Transitive dependencies
//   const transDeps = getTransitiveDependencies(nodeId, graph);

//   // 3. Global data
//   const globalData = getGlobalData();

//   // Merge them into a single array
//   return [...directDeps, ...transDeps, ...globalData];
// }

// /** 
//  * Find forms that feed directly into nodeId (i.e., edges where target = nodeId). 
//  * For each such form, gather its fields (like "Form B - email", "Form B - name"). 
//  */
// function getDirectDependencies(
//   nodeId: string,
//   graph: { nodes: NodeData[]; edges: EdgeData[] }
// ): DataSource[] {
//   // 1. Find edges with target = nodeId
//   const incomingEdges = graph.edges.filter((e) => e.target === nodeId);

//   // 2. For each edge.source, find that node, then build data sources for its fields
//   const dataSources: DataSource[] = [];
//   incomingEdges.forEach((edge) => {
//     const sourceNode = graph.nodes.find((n) => n.id === edge.source);
//     if (sourceNode) {
//       // For each field in sourceNode.data.formFields, create a data source
//       const formName = sourceNode.data.label || sourceNode.id;
//       (sourceNode.data.formFields || []).forEach((fieldName) => {
//         dataSources.push({
//           label: `${formName} - ${fieldName}`,
//           value: `${formName}.${fieldName}`,
//         });
//       });
//     }
//   });

//   return dataSources;
// }

// /**
//  * Recursively find all upstream nodes (transitive dependencies).
//  * E.g., if nodeId = D and there's a path A -> B -> D, we gather A's fields too.
//  * 
//  * In a real app, you'd do a BFS/DFS to collect *all* ancestors, 
//  * then flatten their fields.
//  */
// function getTransitiveDependencies(
//   nodeId: string,
//   graph: { nodes: NodeData[]; edges: EdgeData[] }
// ): DataSource[] {
//   // For simplicity, let's just do a placeholder BFS example:
//   const visited = new Set<string>();
//   const queue = [nodeId];
//   const result: DataSource[] = [];

//   while (queue.length > 0) {
//     const current = queue.shift()!;
//     // Find direct parents of `current`
//     const incomingEdges = graph.edges.filter((e) => e.target === current);

//     incomingEdges.forEach((edge) => {
//       if (!visited.has(edge.source)) {
//         visited.add(edge.source);
//         queue.push(edge.source);

//         // Add that node's fields
//         const parentNode = graph.nodes.find((n) => n.id === edge.source);
//         if (parentNode) {
//           const formName = parentNode.data.label || parentNode.id;
//           (parentNode.data.formFields || []).forEach((fieldName) => {
//             // We'll label these "transitive" to differentiate them from direct
//             result.push({
//               label: `${formName} - ${fieldName} (transitive)`,
//               value: `${formName}.${fieldName}`,
//             });
//           });
//         }
//       }
//     });
//   }

//   return result;
// }

// /**
//  * Return any "global" data sources you want to expose. 
//  * (Action Properties, Client Org Properties, etc.)
//  */
// function getGlobalData(): DataSource[] {
//   return [
//     { label: 'Global - clientName', value: 'Global.clientName' },
//     { label: 'Global - actionProperties', value: 'Global.actionProperties' },
//   ];
// }

// const styles: Record<string, React.CSSProperties> = {
//   overlay: {
//     position: 'fixed',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   modal: {
//     backgroundColor: 'white',
//     padding: '1rem',
//     borderRadius: '4px',
//     width: '300px',
//   },
//   input: {
//     width: '100%',
//     marginBottom: '1rem',
//   },
//   buttonRow: {
//     display: 'flex',
//     justifyContent: 'flex-end',
//   },
// };

// export default PrefillModal;


// src/components/PrefillModal.tsx
// import React, { FC, useEffect, useState } from 'react';
// import { NodeData, EdgeData } from '../types';

// interface DataSource {
//   label: string;
//   value: string;
// }

// interface PrefillModalProps {
//   nodeId: string;
//   fieldName: string;
//   graph: {
//     nodes: NodeData[];
//     edges: EdgeData[];
//   };
//   onClose: () => void;
//   onSave: (sourceValue: string | null) => void;
// }

// const PrefillModal: FC<PrefillModalProps> = ({
//   nodeId,
//   fieldName,
//   graph,
//   onClose,
//   onSave,
// }) => {
//   const [dataSources, setDataSources] = useState<DataSource[]>([]);
//   const [selectedSource, setSelectedSource] = useState('');

//   // 1. Gather data sources when the modal opens
//   useEffect(() => {
//     const ds = gatherDataSources(nodeId, graph);
//     setDataSources(ds);
//   }, [nodeId, graph]);

//   const handleSelect = () => {
//     onSave(selectedSource || null);
//   };

//   return (
//     <div style={styles.overlay}>
//       <div style={styles.modal}>
//         <h4>Select data element to map</h4>
//         <p>
//           You are configuring prefill for <strong>{fieldName}</strong> on node{' '}
//           <strong>{nodeId}</strong>.
//         </p>

//         <select
//           style={styles.input}
//           value={selectedSource}
//           onChange={(e) => setSelectedSource(e.target.value)}
//         >
//           <option value="">-- Choose a source --</option>
//           {dataSources.map((ds) => (
//             <option key={ds.value} value={ds.value}>
//               {ds.label}
//             </option>
//           ))}
//         </select>

//         <div style={styles.buttonRow}>
//           <button onClick={handleSelect}>Select</button>
//           <button onClick={onClose} style={{ marginLeft: '10px' }}>
//             Cancel
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// /** 
//  * Combine direct dependencies, transitive dependencies, and global data
//  * into a single flat list of data sources. 
//  */
// function gatherDataSources(
//   nodeId: string,
//   graph: { nodes: NodeData[]; edges: EdgeData[] }
// ): DataSource[] {
//   // 1. Direct dependencies
//   const directDeps = getDirectDependencies(nodeId, graph);

//   // 2. Transitive dependencies
//   const transDeps = getTransitiveDependencies(nodeId, graph);

//   // 3. Global data
//   const globalData = getGlobalData();

//   // Merge them into a single array
//   return [...directDeps, ...transDeps, ...globalData];
// }

// /** 
//  * Find forms that feed directly into nodeId (i.e., edges where target = nodeId). 
//  * For each such form, gather its fields (like "Form B - email", "Form B - name"). 
//  */
// function getDirectDependencies(
//   nodeId: string,
//   graph: { nodes: NodeData[]; edges: EdgeData[] }
// ): DataSource[] {
//   // 1. Find edges with target = nodeId
//   const incomingEdges = graph.edges.filter((e) => e.target === nodeId);

//   // 2. For each edge.source, find that node, then build data sources for its fields
//   const dataSources: DataSource[] = [];
//   incomingEdges.forEach((edge) => {
//     const sourceNode = graph.nodes.find((n) => n.id === edge.source);
//     if (sourceNode) {
//       // For each field in sourceNode.data.formFields, create a data source
//       const formName = sourceNode.data.label || sourceNode.id;
//       (sourceNode.data.formFields || []).forEach((fieldName) => {
//         dataSources.push({
//           label: `${formName} - ${fieldName} (direct)`,
//           value: `${formName}.${fieldName}`,
//         });
//       });
//     }
//   });

//   return dataSources;
// }

// /**
//  * Recursively find all upstream nodes (transitive dependencies).
//  * E.g., if nodeId = D and there's a path A -> B -> D, we gather A's fields too.
//  * 
//  * BFS approach: keep adding parents of each node until none left.
//  */
// function getTransitiveDependencies(
//   nodeId: string,
//   graph: { nodes: NodeData[]; edges: EdgeData[] }
// ): DataSource[] {
//   const visited = new Set<string>();
//   const queue = [nodeId];
//   const result: DataSource[] = [];

//   while (queue.length > 0) {
//     const current = queue.shift()!;
//     // Find direct parents of `current`
//     const incomingEdges = graph.edges.filter((e) => e.target === current);

//     incomingEdges.forEach((edge) => {
//       if (!visited.has(edge.source)) {
//         visited.add(edge.source);
//         queue.push(edge.source);

//         // Add that node's fields
//         const parentNode = graph.nodes.find((n) => n.id === edge.source);
//         if (parentNode) {
//           const formName = parentNode.data.label || parentNode.id;
//           (parentNode.data.formFields || []).forEach((fieldName) => {
//             result.push({
//               label: `${formName} - ${fieldName} (transitive)`,
//               value: `${formName}.${fieldName}`,
//             });
//           });
//         }
//       }
//     });
//   }

//   return result;
// }

// /**
//  * Return any "global" data sources you want to expose. 
//  * (Action Properties, Client Org Properties, etc.)
//  */
// function getGlobalData(): DataSource[] {
//   return [
//     { label: 'Global - clientName', value: 'Global.clientName' },
//     { label: 'Global - actionProperties', value: 'Global.actionProperties' },
//   ];
// }

// const styles: Record<string, React.CSSProperties> = {
//   overlay: {
//     position: 'fixed',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   modal: {
//     backgroundColor: 'white',
//     padding: '1rem',
//     borderRadius: '4px',
//     width: '300px',
//   },
//   input: {
//     width: '100%',
//     marginBottom: '1rem',
//   },
//   buttonRow: {
//     display: 'flex',
//     justifyContent: 'flex-end',
//   },
// };

// export default PrefillModal;


// src/components/PrefillModal.tsx
// src/components/PrefillModal.tsx
// import React, { useState, useEffect } from 'react';
// import { NodeData } from '../types';

// interface PrefillModalProps {
//   nodeId: string;
//   fieldName: string;
//   dependencyForms: NodeData[];
//   onClose: () => void;
//   onSave: (sourceValue: string | null) => void;
// }

// const PrefillModal: React.FC<PrefillModalProps> = ({
//   nodeId,
//   fieldName,
//   dependencyForms,
//   onClose,
//   onSave,
// }) => {
//   const [selectedSource, setSelectedSource] = useState<string | null>(null);
//   const [dataSources, setDataSources] = useState<{ label: string; value: string }[]>([]);

//   useEffect(() => {
//     const sources: { label: string; value: string }[] = [
//       { label: 'Global - clientName', value: 'Global.clientName' },
//     ];

//     // Add direct and transitive dependencies
//     dependencyForms.forEach((form) => {
//       if (form.data.formFields) {
//         form.data.formFields.forEach((field) => {
//           sources.push({
//             label: `${form.data.label} - ${field}`,
//             value: `${form.id}.${field}`,
//           });
//         });
//       }
//     });

//     setDataSources(sources);
//   }, [dependencyForms]);

//   return (
//     <div style={styles.overlay}>
//       <div style={styles.modal}>
//         <h4>Select data element to map</h4>
//         <p>
//           Configuring prefill for <strong>{fieldName}</strong> on Node <strong>{nodeId}</strong>.
//         </p>

//         <select
//           value={selectedSource || ''}
//           onChange={(e) => setSelectedSource(e.target.value)}
//           style={styles.selectBox}
//         >
//           <option value="">-- Choose a source --</option>
//           {dataSources.map((ds) => (
//             <option key={ds.value} value={ds.value}>
//               {ds.label}
//             </option>
//           ))}
//         </select>

//         <div style={styles.buttonRow}>
//           <button onClick={() => onSave(selectedSource)} disabled={!selectedSource} style={styles.button}>
//             Select
//           </button>
//           <button onClick={onClose} style={styles.cancelButton}>
//             Cancel
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PrefillModal;

// // Modal Styles
// const styles: Record<string, React.CSSProperties> = {
//   overlay: {
//     position: 'fixed',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: 'rgba(0, 0, 0, 0.3)',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   modal: {
//     backgroundColor: '#fff',
//     padding: '1rem',
//     borderRadius: '8px',
//     width: '400px',
//     boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
//   },
//   selectBox: {
//     width: '100%',
//     padding: '8px',
//     marginTop: '10px',
//   },
//   buttonRow: {
//     display: 'flex',
//     justifyContent: 'space-between',
//     marginTop: '15px',
//   },
//   button: {
//     backgroundColor: '#4664F5',
//     color: '#fff',
//     border: 'none',
//     padding: '8px 12px',
//     borderRadius: '4px',
//     cursor: 'pointer',
//   },
//   cancelButton: {
//     backgroundColor: '#ddd',
//     border: 'none',
//     padding: '8px 12px',
//     borderRadius: '4px',
//     cursor: 'pointer',
//   },
// };


// import React, { useState } from 'react';
// import { NodeData } from '../types';
// import Modal from 'react-modal';
// import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
// import { TreeItem } from '@mui/x-tree-view/TreeItem';

// interface PrefillModalProps {
//   nodeId: string;
//   fieldName: string;
//   dependencyForms: NodeData[];
//   onClose: () => void;
//   onSave: (sourceValue: string | null) => void;
// }

// const PrefillModal: React.FC<PrefillModalProps> = ({
//   nodeId,
//   fieldName,
//   dependencyForms,
//   onClose,
//   onSave,
// }) => {
//   const [selectedSource, setSelectedSource] = useState<string | null>(null);
//   const [searchTerm, setSearchTerm] = useState('');

//   const handleSelect = (_: React.SyntheticEvent, id: string | null) => {
//     setSelectedSource(id);
//   };

//   const filteredFields = (fields?: string[]) =>
//     (fields ?? []).filter((field) =>
//       field.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//   return (
//     <Modal isOpen onRequestClose={onClose} style={styles.modal} ariaHideApp={false}>
//       <h3>Select data element to map</h3>
//       <div style={styles.container}>
//         <div style={styles.leftPane}>
//           <input
//             type="text"
//             placeholder="Search"
//             style={styles.searchInput}
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//           <SimpleTreeView
//             // selectedItem={selectedSource || ''}
//             // onSelectedItemChange={handleSelect}
//           // style={styles.treeView}
//           >
//             <TreeItem itemId="Global" label="Global">
//               <TreeItem itemId="Global.clientName" label="clientName" />
//             </TreeItem>

//             {dependencyForms.map((form) => (
//               <TreeItem key={form.id} itemId={form.id} label={form.data.label}>
//                 {filteredFields(form.data.formFields).map((field) => (
//                   <TreeItem
//                     key={`${form.id}.${field}`}
//                     itemId={`${form.id}.${field}`}
//                     label={field}
//                   />
//                 ))}
//               </TreeItem>
//             ))}
//           </SimpleTreeView>
//         </div>
//       </div>

//       <div style={styles.buttonRow}>
//         <button onClick={onClose} style={styles.cancelButton}>
//           CANCEL
//         </button>
//         <button
//           onClick={() => onSave(selectedSource)}
//           disabled={!selectedSource}
//           style={selectedSource ? styles.selectButton : styles.selectDisabled}
//         >
//           SELECT
//         </button>
//       </div>
//     </Modal>
//   );
// };

// export default PrefillModal;

// const styles= {
//   modal: {
//     overlay: {
//       backgroundColor: 'rgba(0, 0, 0, 0.5)',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//     },
//     content: {
//       width: '600px',
//       height: '400px',
//       padding: '20px',
//       borderRadius: '8px',
//     },
//   },
//   container: {
//     display: 'flex',
//     height: '70%',
//     borderTop: '1px solid #ddd',
//     marginTop: '10px',
//   },
//   leftPane: {
//     width: '100%',
//     paddingRight: '10px',
//     display: 'flex',
//     flexDirection: 'column' as 'column', // Explicit type assignment
//   },
//   searchInput: {
//     padding: '8px',
//     marginBottom: '10px',
//     border: '1px solid #ddd',
//     borderRadius: '4px',
//   },
//   treeView: {
//     flex: 1,
//     overflowY: 'auto',
//   },
//   buttonRow: {
//     display: 'flex',
//     justifyContent: 'flex-end',
//     marginTop: '10px',
//   },
//   selectButton: {
//     backgroundColor: '#1E88E5',
//     color: 'white',
//     border: 'none',
//     padding: '6px 16px',
//     borderRadius: '4px',
//     cursor: 'pointer',
//   },
//   selectDisabled: {
//     backgroundColor: '#ddd',
//     color: '#999',
//     border: 'none',
//     padding: '6px 16px',
//     borderRadius: '4px',
//   },
//   cancelButton: {
//     marginRight: '10px',
//     backgroundColor: '#f5f5f5',
//     border: 'none',
//     padding: '6px 16px',
//     borderRadius: '4px',
//     cursor: 'pointer',
//   },
// };

import React, { useState, useEffect } from 'react';
import { NodeData } from '../types';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';

interface PrefillModalProps {
  nodeId: string;
  fieldName: string;
  dependencyForms: NodeData[];
  onClose: () => void;
  onSave: (sourceValue: string | null) => void;
}

const PrefillModal: React.FC<PrefillModalProps> = ({
  nodeId,
  fieldName,
  dependencyForms,
  onClose,
  onSave,
}) => {
  const [selectedSource, setSelectedSource] = useState<string | null>(null);

  const handleSelect = (_: React.SyntheticEvent, itemId: string | null) => {
    setSelectedSource(itemId);
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h4>Select data element to map</h4>
        <p>
          Configuring prefill for <strong>{fieldName}</strong> on Node <strong>{nodeId}</strong>.
        </p>

        <div style={{ height: 200, overflowY: 'auto' }}>
          <SimpleTreeView
            selectedItems={selectedSource || ''}
            onSelectedItemsChange={handleSelect}
          >
            <TreeItem itemId="Global" label="Global">
              <TreeItem itemId="Global.clientName" label="clientName" />
            </TreeItem>

            {dependencyForms.map((form) => (
              <TreeItem key={form.id} itemId={form.id} label={form.data.label}>
                {form.data.formFields?.map((field) => (
                  <TreeItem
                    key={`${form.id}.${field}`}
                    itemId={`${form.id}.${field}`}
                    label={field}
                  />
                ))}
              </TreeItem>
            ))}
          </SimpleTreeView>
        </div>

        <div style={styles.buttonRow}>
          <button
            onClick={() => onSave(selectedSource)}
            disabled={!selectedSource}
            style={styles.button}
          >
            Select
          </button>
          <button onClick={onClose} style={styles.cancelButton}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrefillModal;

// Modal Styles
const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    padding: '1rem',
    borderRadius: '8px',
    width: '400px',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
  },
  buttonRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '15px',
  },
  button: {
    backgroundColor: '#4664F5',
    color: '#fff',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  cancelButton: {
    backgroundColor: '#ddd',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

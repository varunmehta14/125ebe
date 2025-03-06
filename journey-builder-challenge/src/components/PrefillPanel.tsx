import React, { FC, useState, useEffect } from 'react';
import { Switch } from '@mui/material';
import PrefillModal from './PrefillModal';
import StorageIcon from '@mui/icons-material/Storage';
import CancelTwoToneIcon from '@mui/icons-material/CancelTwoTone';
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
  const [showModal, setShowModal] = useState(false);
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [dependencyForms, setDependencyForms] = useState<NodeData[]>([]);
  const [isPanelOpen, setIsPanelOpen] = useState(true);

  /**
   * Traverses the DAG using BFS/DFS to find direct & transitive dependencies.
   * This function helps identify which forms can be used for prefill.
   */
  useEffect(() => {
    const getDependencies = (
      currentNodeId: string,
      visited = new Set<string>()
    ): NodeData[] => {
      if (visited.has(currentNodeId)) return [];
      visited.add(currentNodeId);

      const directParents = edges
        .filter((e) => e.target === currentNodeId && !visited.has(e.source))
        .map((e) => nodes.find((n) => n.id === e.source))
        .filter((n): n is NodeData => !!n);

      return [
        ...directParents,
        ...directParents.flatMap((p) => getDependencies(p.id, visited)),
      ];
    };

    const uniqueDeps = Array.from(
      new Map(getDependencies(nodeId).map((n) => [n.id, n])).values()
    );
    setDependencyForms(uniqueDeps);
  }, [nodeId, nodes, edges]);

  // Find the selected node in the graph
  const node = nodes.find((n) => n.id === nodeId);
  if (!node) return null;

  const formFields = node.data.formFields || [];
  const prefillConfig = node.data.prefillConfig || {};

  /**
   * Clears the prefill configuration for a specific field.
   * Updates the state and removes the mapped value.
   */
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

  /**
   * Opens the prefill selection modal for a given field.
   */
  const handleOpenModal = (fieldName: string) => {
    setSelectedField(fieldName);
    setShowModal(true);
  };

  /**
   * Saves the chosen prefill value and updates the node data.
   */
  const handleSave = (sourceValue: string | null) => {
    if (!selectedField) return;
    setNodes((prev) =>
      prev.map((n) =>
        n.id === nodeId
          ? {
              ...n,
              data: {
                ...n.data,
                prefillConfig: {
                  ...(n.data.prefillConfig || {}),
                  [selectedField]: sourceValue,
                },
              },
            }
          : n
      )
    );
    setShowModal(false);
    setSelectedField(null);
  };

  /**
   * Retrieves the label of a form by its ID.
   * This ensures that instead of showing raw IDs, we display human-readable labels.
   */
  const getFormLabel = (formId: string): string => {
    const foundNode = nodes.find((n) => n.id === formId);
    return foundNode ? foundNode.data.label : formId;
  };

  if (!isPanelOpen) {
    // If the toggle is off, hide the entire panel
    return null;
  }

  return (
    <div style={styles.panel}>
      <div style={styles.headerRow}>
        <h4 style={{ margin: 0 }}>Prefill</h4>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p style={styles.subtitle}>Prefill fields for this form</p>
        <Switch
          checked={isPanelOpen}
          onChange={() => {
            setIsPanelOpen(!isPanelOpen);
            if (isPanelOpen) onClose(); // Close the entire panel if toggling off
          }}
        />
      </div>

      {/* List of form fields */}
      <div style={{ marginTop: '1rem' }}>
        {formFields.map((fieldName) => {
          const configValue = prefillConfig[fieldName];
          let displayLabel = configValue;

          if (configValue && configValue.includes('.')) {
            const [sourceNodeId, field] = configValue.split('.');
            displayLabel = `${getFormLabel(sourceNodeId)}.${field}`;
          }

          const isMapped = !!configValue;

          return (
            <div
              key={fieldName}
              onClick={!isMapped ? () => handleOpenModal(fieldName) : undefined}
              style={{
                ...styles.fieldRow,
                ...(isMapped ? styles.fieldRowMapped : styles.fieldRowUnmapped),
                cursor: isMapped ? 'default' : 'pointer',
              }}
            >
              {/* Show database icon only if unmapped */}
              {!isMapped && <StorageIcon style={styles.fieldIcon} />}

              <div style={{ flex: 1 }}>
                {isMapped ? (
                  <span style={{ fontWeight: 500 }}>
                    {fieldName}: {displayLabel}
                  </span>
                ) : (
                  <span style={{ color: '#555' }}>{fieldName}</span>
                )}
              </div>

              {/* If mapped, show 'X' button to remove prefill */}
              {isMapped && (
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent modal open
                    handleClear(fieldName);
                  }}
                  style={styles.clearButton}
                >
                  <CancelTwoToneIcon />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Prefill Selection Modal */}
      {showModal && selectedField && (
        <PrefillModal
          nodeId={getFormLabel(nodeId)}
          fieldName={selectedField}
          dependencyForms={dependencyForms}
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

/** Styles */
const styles: Record<string, React.CSSProperties> = {
  panel: {
    padding: '1rem',
    borderLeft: '0.0625rem solid #ddd', 
    maxWidth: '25rem', 
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5rem',
    flexWrap: 'wrap',
  },
  subtitle: {
    fontSize: '1rem',
    color: '#666',
    margin: 0,
  },
  fieldRow: {
    display: 'flex',
    alignItems: 'center',
    padding: '0.5rem',
    borderRadius: '0.25rem',
    marginBottom: '0.5rem',
    boxSizing: 'border-box',
  },
  fieldRowMapped: {
    backgroundColor: '#f5f5f5',
    border: '0.0625rem solid #ccc',
  },
  fieldRowUnmapped: {
    border: '0.0625rem dashed #ddd',
  },
  fieldIcon: {
    width: '1.5rem', 
    borderRadius: '0.25rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '0.5rem',
    fontSize: '0.875rem', 
    },
  clearButton: {
    background: 'none',
    border: 'none',
    color: '#666',
    cursor: 'pointer',
    marginLeft: '0.5rem',
    fontSize: '1rem',
  },
};
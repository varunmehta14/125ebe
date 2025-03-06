import React, { useState } from 'react';
import { NodeData } from '../types';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import Button from '@mui/material/Button';

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
  const [searchTerm, setSearchTerm] = useState('');

  /** Global properties dynamically defined */
  const globalData: Record<string, string[]> = {
    "Action Properties": ["clientName"],
    "Client Organisation Properties": ["clientEmail"],
  };

  /** Search filter for form and global fields */
  const filterItem = (label: string) =>
    label.toLowerCase().includes(searchTerm.toLowerCase());

  /** Handle selection of items, ensuring only fields are selectable */
  const handleSelect = (_: React.SyntheticEvent, itemId: string | null) => {
    if (!itemId) {
      setSelectedSource(null);
      return;
    }

    const isFormNode = dependencyForms.some((form) => form.id === itemId);
    const isGlobalCategory = Object.keys(globalData).includes(itemId);

    if (isFormNode || isGlobalCategory) {
      setSelectedSource(null); // Prevent selection of form names or global categories
    } else {
      setSelectedSource(itemId); // Select only actual fields
    }
  };

  /** Check if anything is matching (global + form fields) */
  const filteredGlobalData = Object.entries(globalData).reduce(
    (acc, [category, fields]) => {
      const matchingFields = fields.filter(filterItem);
      if (matchingFields.length > 0) {
        acc[category] = matchingFields;
      }
      return acc;
    },
    {} as Record<string, string[]>
  );

  const filteredForms = dependencyForms
    .map((form) => ({
      ...form,
      filteredFields: form.data.formFields?.filter(filterItem) ?? [],
    }))
    .filter((form) => form.filteredFields.length > 0);

  const showNoMatch = Object.keys(filteredGlobalData).length === 0 && filteredForms.length === 0;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        {/* White top section */}
        <div style={styles.topSection}>
          <h4 style={styles.title}>Select data element to map</h4>
        </div>

        {/* Gray bottom section */}
        <div style={styles.bottomSection}>
          <div style={styles.label}>Available data</div>

          <input
            type="text"
            placeholder="🔍 Search..."
            style={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* Tree View Container */}
          <div style={styles.treeContainer}>
            {showNoMatch ? (
              <p style={styles.noMatchText}>No match found</p>
            ) : (
              <SimpleTreeView
                selectedItems={selectedSource ? selectedSource : ""}
                onSelectedItemsChange={handleSelect}
                style={{ width: '100%' }}
              >
                {/* Global Properties - Dynamically Generated */}
                {Object.entries(filteredGlobalData).map(([category, fields]) => (
                  <TreeItem key={category} itemId={category} label={category}>
                    {fields.map((field) => (
                      <TreeItem
                        key={`${category}.${field}`}
                        itemId={`${category}.${field}`}
                        label={field}
                      />
                    ))}
                  </TreeItem>
                ))}

                {/* Forms - Dynamically Generated */}
                {filteredForms.map((form) => (
                  <TreeItem key={form.id} itemId={form.id} label={form.data.label}>
                    {form.filteredFields.map((field) => (
                      <TreeItem key={`${form.id}.${field}`} itemId={`${form.id}.${field}`} label={field} />
                    ))}
                  </TreeItem>
                ))}
              </SimpleTreeView>
            )}
          </div>

          {/* Buttons */}
          <div style={styles.buttonRow}>
            <Button variant="outlined" onClick={onClose} style={styles.cancelButton}>
              Cancel
            </Button>
            <Button
              variant="outlined"
              onClick={() => onSave(selectedSource)}
              disabled={!selectedSource}
              style={selectedSource ? styles.selectButton : styles.selectDisabled}
            >
              Select
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrefillModal;

/** Styles */
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
    zIndex: 9999,
    padding: '1rem',
  },
  modal: {
    width: '90%',
    maxWidth: '30rem',
    borderRadius: '0.5rem',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#fff',
  },
  topSection: {
    backgroundColor: '#fff',
    padding: '1rem',
    display:'flex'
  },
  title: {
    margin: 0,
    fontSize: '1rem',
    fontWeight: 600,
    textAlign: 'center',
  },
  bottomSection: {
    backgroundColor: '#f5f5f5',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
  },
  label: {
    fontSize: '0.9rem',
    color: '#555',
    marginBottom: '0.5rem',
  },
  searchInput: {
    padding: '0.5rem',
    marginBottom: '0.75rem',
    borderRadius: '0.5rem',
    border: '1px solid #ccc',
    fontSize: '0.9rem',
    width: '100%',
    boxSizing: 'border-box',
  },
  treeContainer: {
    flex: 1,
    overflowY: 'auto',
    border: '1px solid #ddd',
    borderRadius: '0.5rem',
    padding: '0.5rem',
    marginBottom: '1rem',
    backgroundColor: '#fff',
    minHeight: '10rem',
    maxHeight: '20rem',
  },
  noMatchText: {
    textAlign: 'center',
    color: '#777',
    fontSize: '0.9rem',
    padding: '1rem',
  },
  buttonRow: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '0.5rem',
    flexWrap: 'wrap',
  },
  selectButton: {
    backgroundColor: '#4664F5',
    color: '#fff',
    border: 'none',
    borderRadius: '0.5rem',
    padding: '0.5rem 1rem',
    cursor: 'pointer',
    fontSize: '0.85rem',
    minWidth: '5rem',
    textAlign: 'center',
  },
  selectDisabled: {
    backgroundColor: '#eee',
    color: '#999',
    border: 'none',
    borderRadius: '0.5rem',
    padding: '0.5rem 1rem',
    fontSize: '0.85rem',
    cursor: 'default',
    minWidth: '5rem',
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '0.5rem',
    padding: '0.5rem 1rem',
    cursor: 'pointer',
    fontSize: '0.85rem',
    minWidth: '5rem',
    textAlign: 'center',
  },
};

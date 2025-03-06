import React from 'react';
import { Handle, Position } from '@xyflow/react';
import TableChartIcon from '@mui/icons-material/TableChart';

function FormNode({ data }: any) {
  return (
    <div style={styles.nodeContainer}>
      {/* Left purple box with icon */}
      <div style={styles.iconBox}>
        <TableChartIcon style={styles.icon} />
      </div>

      {/* Form label container */}
      <div style={styles.labelContainer}>
        <div style={styles.formType}>Form</div>
        <div style={styles.formLabel}>{data.label || 'Form'}</div>
      </div>

      {/* Connection handles (left: target, right: source) */}
      <Handle type="target" position={Position.Left} style={styles.leftHandle} />
      <Handle type="source" position={Position.Right} style={styles.rightHandle} />
    </div>
  );
}

export default FormNode;

// Inline styles
const styles: Record<string, React.CSSProperties> = {
  nodeContainer: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    border: '1px solid #E5E5E5',
    borderRadius: '0.5rem',
    padding: '0.5rem 1rem',
    fontFamily: 'sans-serif',
    position: 'relative',
    transition: 'border-color 0.3s ease-in-out',
    cursor: 'pointer',
    minWidth: '8rem', // Prevents shrinking
  },
  iconBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '3rem',
    height: '3rem',
    borderRadius: '0.5rem',
    backgroundColor: '#4664F5',
    marginRight: '0.75rem',
  },
  icon: {
    color: '#fff',
    fontSize: '1.5rem',
  },
  labelContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  formType: {
    color: 'gray',
    fontSize: '0.75rem',
  },
  formLabel: {
    fontSize: '1rem',
    fontWeight: 'bold',
    color: '#333',
  },
  leftHandle: {
    top: '50%',
    transform: 'translateY(-50%)',
    left: '-0.4rem', // Positions slightly outside the box
    background: '#4664F5',
    width: '0.6rem',
    height: '0.6rem',
  },
  rightHandle: {
    top: '50%',
    transform: 'translateY(-50%)',
    right: '-0.4rem', // Positions slightly outside the box
    background: '#4664F5',
    width: '0.6rem',
    height: '0.6rem',
  },
};

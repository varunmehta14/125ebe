import React from 'react';
import { Handle, Position } from '@xyflow/react';
import TableChartIcon from '@mui/icons-material/TableChart';

function FormNode({ data }: any) {
  return (
    <div style={styles.nodeContainer}>
      {/* Left purple box with "Form" text and icon */}
      <div style={styles.iconBox}>
       
        {/* <div style={styles.iconBoxIcon}>📄</div> */}
        <TableChartIcon style={{ color: '#fff' }} />
      </div>

      {/* Main label for the form */}
      <div style={styles.labelContainer}>
      <div style={{color:"gray",fontSize:"small"}}>Form</div>
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
    borderRadius: 8,
    padding: '8px 12px',
    fontFamily: 'sans-serif',
    position: 'relative', // so handles position absolutely within
  },
  iconBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#4664F5',
    marginRight: 12,
  },
  iconBoxTitle: {
    fontSize: 10,
    color: '#fff',
    marginBottom: 2,
  },
  iconBoxIcon: {
    fontSize: 16,
    color: '#fff',
  },
  labelContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  formLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  leftHandle: {
    top: '50%',
    transform: 'translateY(-50%)',
  },
  rightHandle: {
    top: '50%',
    transform: 'translateY(-50%)',
  },
};

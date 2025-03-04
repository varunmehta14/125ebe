// src/components/FormNode.tsx
import React from 'react';
// If @xyflow/react exports Handle/Position, import from there. Otherwise, adapt accordingly.
import { Handle, Position } from '@xyflow/react';

function FormNode({ data }: any) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        border: '1px solid #E5E5E5',
        borderRadius: 8,
        padding: '8px 12px',
        fontFamily: 'sans-serif',
      }}
    >
      {/* Icon: small blue circle with an emoji. Replace with an SVG if you like. */}
      <div
        style={{
          width: 24,
          height: 24,
          borderRadius: '50%',
          backgroundColor: '#4664F5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 8,
        }}
      >
        <span style={{ color: '#fff', fontSize: 14 }}>📄</span>
      </div>

      {/* Node label (e.g. "Form A") */}
      <div style={{ fontWeight: 'bold' }}>
        {data.label || 'Form'}
      </div>

      {/* Connection handles on the left (target) and right (source) */}
      <Handle type="target" position={Position.Left} style={{ top: '50%' }} />
      <Handle type="source" position={Position.Right} style={{ top: '50%' }} />
    </div>
  );
}

export default FormNode;

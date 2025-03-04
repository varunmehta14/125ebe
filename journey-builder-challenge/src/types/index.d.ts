import { Node, Edge } from '@xyflow/react';

export interface NodeData extends Node {
  data: {
    label: string;
    formFields?: string[];
    prefillConfig?: Record<string, string | null>;
  };
  width?: number; // Use undefined if not set instead of null
}

// Ensure that EdgeData extends Edge<any>
export interface EdgeData extends Edge<any> {}

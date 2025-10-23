import React, { useMemo } from 'react';
import { render as renderAmis, type SchemaNode } from 'amis';
import { amisEnv } from '@/amis/env';

export interface AmisRendererProps {
  schema: SchemaNode;
  className?: string;
  data?: Record<string, unknown>;
}

const AmisRenderer: React.FC<AmisRendererProps> = ({ schema, className, data }) => {
  const env = useMemo(() => amisEnv, []);

  return <div className={className}>{renderAmis(schema, data ?? {}, env)}</div>;
};

export default AmisRenderer;

import React from 'react';
import type { RendererProps } from 'amis-core';
import { resolveVariable } from 'amis-core';

interface StatusOption {
  label: string;
  value: string | number;
  color?: string;
}

export interface StatusBadgeProps extends RendererProps {
  value?: string | number | null;
  source?: StatusOption[] | string;
  statusKey?: string;
  placeholder?: string;
}

const DEFAULT_COLOR = '#45CB7F';

function findOptions(props: StatusBadgeProps): StatusOption[] {
  if (Array.isArray(props.source)) {
    return props.source;
  }

  if (typeof props.source === 'string' && props.data) {
    const resolved = resolveVariable(props.source, props.data);
    if (Array.isArray(resolved)) {
      return resolved as StatusOption[];
    }
  }

  if (props.statusKey && props.data) {
    const key = props.statusKey;
    const fromData = resolveVariable(`statusOptions.${key}`, props.data);
    if (Array.isArray(fromData)) {
      return fromData as StatusOption[];
    }
  }

  return [];
}

const StatusBadge: React.FC<StatusBadgeProps> = (props) => {
  const options = findOptions(props);
  const value = props.value ?? null;
  const option = options.find((item) => item.value === value) ?? null;
  const color = option?.color ?? DEFAULT_COLOR;
  const label = option?.label ?? (value === null || value === undefined ? props.placeholder ?? '-' : String(value));

  return (
    <span className="status-badge" data-value={value ?? ''}>
      <span className="status-badge__dot" role="presentation" style={{ backgroundColor: color ?? DEFAULT_COLOR }} />
      <span>{label}</span>
    </span>
  );
};

export default StatusBadge;

import React from 'react';
import { registerRendererByType, setDefaultTheme } from 'amis';
import type { RendererProps } from 'amis-core';
import './styles.css';
import 'amis/lib/themes/cxd.css';
import 'amis/lib/helper.css';
import StatusBadge from '@/components/StatusBadge';

setDefaultTheme('cxd');

registerRendererByType(
  {
    type: 'app-title',
    usage: 'renderer',
    weight: 100,
    component: (props: RendererProps) => (
      <div className="app-title">
        <h2>{props.title}</h2>
        {props.render ? props.render('body', props.body, props) : null}
      </div>
    )
  },
  true
);

registerRendererByType(
  {
    type: 'status-badge',
    usage: 'renderer',
    weight: 100,
    component: StatusBadge
  },
  true
);

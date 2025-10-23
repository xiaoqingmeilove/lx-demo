import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="not-found">
      <h1>404</h1>
      <p>抱歉，您访问的页面不存在。</p>
      <Link to="/dashboard">返回首页</Link>
    </div>
  );
};

export default NotFound;

import React from 'react';

const AssistloreChatWidget = ({ config }) => {
  const defaultConfig = {
    width: 400,
    height: 600,
    position: {
      right: '20px',
      bottom: '20px'
    }
  };

  const mergedConfig = { ...defaultConfig, ...config };

  return (
    <iframe
      src="https://your-assistlore-endpoint.com/widget"
      width={mergedConfig.width}
      height={mergedConfig.height}
      style={{
        position: 'fixed',
        right: mergedConfig.position.right,
        bottom: mergedConfig.position.bottom,
        border: 'none',
        zIndex: 9999
      }}
    />
  );
};

export default AssistloreChatWidget;

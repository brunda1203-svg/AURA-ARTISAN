import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';

export const N8nOfficialWidget: React.FC = () => {
  const { n8nConfig } = useApp();

  useEffect(() => {
    if (n8nConfig.widgetMode !== 'n8n_native' || !n8nConfig.enabled) {
      const existing = document.getElementById('n8n-chat');
      if (existing) existing.remove();
      return;
    }

    // 1. Inject n8n chat stylesheet if not present
    const styleId = 'n8n-chat-style';
    if (!document.getElementById(styleId)) {
      const link = document.createElement('link');
      link.id = styleId;
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/style.css';
      document.head.appendChild(link);
    }

    // 2. Dynamically import n8n chat bundle
    // @ts-ignore
    import('https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js')
      .then((module) => {
        const createChat = module.createChat;
        if (typeof createChat === 'function') {
          // Remove old container before creating new one
          const existing = document.getElementById('n8n-chat');
          if (existing) existing.remove();

          createChat({
            webhookUrl: n8nConfig.webhookUrl,
            webhookConfig: {
              headers: {
                'X-Instance-Id': '62510f6075903ef57bbcb956a51584b6260614a1776b4ae0a2c3f1b91bcd577f',
              },
            },
            initialMessages: [
              'Hi there! 👋',
              'Welcome to Aura Artisan Decor & Gifts! How can I assist you with custom pipe cleaner flower bouquets, luxury gift hampers, or shipments today?',
            ],
            i18n: {
              en: {
                title: 'Aura Artisan Concierge',
                subtitle: 'Powered by n8n Cloud',
                inputPlaceholder: 'Ask a question...',
              },
            },
          });
        }
      })
      .catch((err) => {
        console.warn('Could not load official @n8n/chat bundle from CDN:', err);
      });

    return () => {
      const existing = document.getElementById('n8n-chat');
      if (existing) existing.remove();
    };
  }, [n8nConfig.widgetMode, n8nConfig.enabled, n8nConfig.webhookUrl]);

  return null;
};

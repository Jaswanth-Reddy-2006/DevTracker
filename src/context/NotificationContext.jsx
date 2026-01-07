import { createContext, useState, useContext, useCallback } from 'react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((message, type = 'info') => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3000);
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ addNotification }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`px-6 py-3 rounded-xl shadow-2xl animate-slideUp text-white font-bold flex items-center gap-3 min-w-[300px] border-2 ${
              n.type === 'success' ? 'bg-emerald-600 border-emerald-400' :
              n.type === 'error' ? 'bg-rose-600 border-rose-400' :
              'bg-blue-600 border-blue-400'
            }`}
          >
            <span>{n.type === 'success' ? '✅' : n.type === 'error' ? '❌' : 'ℹ️'}</span>
            <span className="flex-1">{n.message}</span>
            <button onClick={() => removeNotification(n.id)} className="opacity-50 hover:opacity-100 transition-opacity">✕</button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within NotificationProvider');
  return context;
};

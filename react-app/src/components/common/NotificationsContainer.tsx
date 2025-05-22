import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { removeNotification } from '../../store/slices/uiSlice';
import { CheckCircle, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

const NotificationsContainer: React.FC = () => {
  const dispatch = useDispatch();
  const { notifications } = useSelector((state: RootState) => state.ui);

  useEffect(() => {
    if (notifications.length > 0) {
      const timers = notifications.map((notification) => {
        return setTimeout(() => {
          dispatch(removeNotification(notification.id));
        }, 5000);
      });

      return () => {
        timers.forEach((timer) => clearTimeout(timer));
      };
    }
  }, [notifications, dispatch]);

  if (notifications.length === 0) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-success-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-warning-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-error-500" />;
      default:
        return <Info className="w-5 h-5 text-primary-500" />;
    }
  };

  const getNotificationClass = (type: string) => {
    switch (type) {
      case 'success':
        return 'border-success-500 bg-success-50 dark:bg-success-900/20';
      case 'warning':
        return 'border-warning-500 bg-warning-50 dark:bg-warning-900/20';
      case 'error':
        return 'border-error-500 bg-error-50 dark:bg-error-900/20';
      default:
        return 'border-primary-500 bg-primary-50 dark:bg-primary-900/20';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col space-y-4 max-w-sm">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`flex items-start p-4 border-l-4 rounded-md shadow-md animate-fade-in ${getNotificationClass(notification.type)}`}
        >
          <div className="flex-shrink-0 mr-3">
            {getIcon(notification.type)}
          </div>
          <div className="flex-1 mr-2">
            <p className="text-sm text-neutral-700 dark:text-neutral-200">
              {notification.message}
            </p>
          </div>
          <button
            onClick={() => dispatch(removeNotification(notification.id))}
            className="flex-shrink-0 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default NotificationsContainer;
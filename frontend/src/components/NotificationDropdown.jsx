import { useState, useEffect, useRef } from 'react';
import { Bell, X, Check, Trash2, Clock, Info, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../utils/api';
import { Link } from 'react-router-dom';

const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await api.get('/notifications');
      setNotifications(res.data.data);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // Poll every minute
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications(notifications.filter(n => n._id !== id));
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle2 className="text-emerald-500" size={16} />;
      case 'warning': return <AlertCircle className="text-orange-500" size={16} />;
      case 'error': return <X className="text-red-500" size={16} />;
      default: return <Info className="text-blue-500" size={16} />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-all"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 bg-white border border-gray-100 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in duration-200 origin-top-right">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest italic">Notifications</h3>
            {unreadCount > 0 && (
              <span className="text-[10px] font-bold bg-primary-100 text-primary-600 px-2 py-0.5 rounded-full">
                {unreadCount} New
              </span>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto custom-scrollbar">
            {loading && notifications.length === 0 ? (
              <div className="p-8 text-center">
                <div className="animate-spin text-primary-600 mb-2 inline-block">
                  <Clock size={20} />
                </div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest italic">Syncing...</p>
              </div>
            ) : notifications.length > 0 ? (
              <div className="divide-y divide-gray-50">
                {notifications.map((notification) => (
                  <div 
                    key={notification._id} 
                    className={`p-4 hover:bg-gray-50 transition-colors relative group ${!notification.isRead ? 'bg-primary-50/30' : ''}`}
                    onClick={() => !notification.isRead && markAsRead(notification._id)}
                  >
                    <div className="flex gap-3">
                      <div className="mt-1 shrink-0">{getIcon(notification.type)}</div>
                      <div className="flex-grow">
                        <p className={`text-xs ${notification.isRead ? 'text-gray-900 font-medium' : 'text-gray-900 font-bold'}`}>
                          {notification.title}
                        </p>
                        <p className="text-[10px] text-gray-500 mt-1 leading-relaxed">
                          {notification.message}
                        </p>
                        <p className="text-[8px] text-gray-400 mt-2 font-bold uppercase tracking-widest flex items-center gap-1 italic">
                          <Clock size={10} /> {new Date(notification.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="absolute top-4 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      {!notification.isRead && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); markAsRead(notification._id); }}
                          className="p-1 hover:bg-emerald-100 text-emerald-600 rounded"
                          title="Mark as read"
                        >
                          <Check size={12} />
                        </button>
                      )}
                      <button 
                        onClick={(e) => { e.stopPropagation(); deleteNotification(notification._id); }}
                        className="p-1 hover:bg-red-100 text-red-600 rounded"
                        title="Delete"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <Bell className="mx-auto text-gray-200 mb-4" size={32} />
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest italic leading-loose">
                  You're all caught up!<br/>No new alerts.
                </p>
              </div>
            )}
          </div>

          <div className="p-3 bg-gray-50 border-t border-gray-100 text-center">
            <Link to="/dashboard/support" className="text-[10px] font-black text-primary-600 uppercase tracking-widest hover:underline">
              Help Center & Alerts
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;

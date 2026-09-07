import { useState, useEffect } from 'react';
import { Bell, CheckCircle2, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function NotificationBell() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    fetchNotifications();

    const channel = supabase.channel('realtime-notifications')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications', filter: `profile_id=eq.${user.id}` },
        (payload) => {
          const newNotif = payload.new;
          
          setNotifications(prev => [newNotif, ...prev]);
          setUnreadCount(prev => prev + 1);

          if ("Notification" in window && Notification.permission === "granted") {
            const sysNotif = new Notification(newNotif.title, {
              body: newNotif.message,
              icon: "https://mcusercontent.com/f8003344e5055720b1568282f/images/e84ab177-5143-b5b7-4514-9298f1f3fa99.png"
            });

            sysNotif.onclick = () => {
              window.focus();
              handleNotificationClick(newNotif);
            };
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const fetchNotifications = async () => {
    if (!user?.id) return;
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('profile_id', user.id)
      .eq('is_read', false)
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (data) {
      setNotifications(data);
      setUnreadCount(data.length);
    }
  };

  // 🔥 MARCA COMO LEÍDA Y NAVEGA DIRECTO AL TICKET
  const handleNotificationClick = async (notif: any) => {
    setShowDropdown(false); 

    // 1. Limpia en interfaz y actualiza BD
    setNotifications(prev => prev.filter(n => n.id !== notif.id));
    setUnreadCount(prev => Math.max(0, prev - 1));
    await supabase.from('notifications').update({ is_read: true }).eq('id', notif.id);

    // 2. Extrae ID del ticket
    const targetId = notif.request_id || notif.task_id;

    // 3. Navegación inteligente
    if (notif.action_link) {
      navigate(notif.action_link);
    } else if (targetId) {
      navigate(`/coordinator?ticket=${targetId}`);
    }
  };

  const markAsReadSilently = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); 
    setNotifications(prev => prev.filter(n => n.id !== id));
    setUnreadCount(prev => Math.max(0, prev - 1));
    await supabase.from('notifications').update({ is_read: true }).eq('id', id);
  };

  const markAllAsRead = async () => {
    setNotifications([]);
    setUnreadCount(0);
    await supabase.from('notifications').update({ is_read: true }).eq('profile_id', user!.id).eq('is_read', false);
    setShowDropdown(false);
  };

  const handleBellClick = () => {
    setShowDropdown(!showDropdown);
    
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={handleBellClick} 
        className="relative p-2.5 text-gray-500 dark:text-gray-400 hover:text-luxury-red transition-colors rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm cursor-pointer pointer-events-auto"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 bg-luxury-red text-white text-[9px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white dark:border-[#0F0F12] shadow-sm animate-in zoom-in">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
          <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-[#141419] border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-zinc-800/60 bg-gray-50 dark:bg-black/20">
              <h3 className="text-xs font-black uppercase tracking-widest text-gray-900 dark:text-white">Notificaciones</h3>
              {unreadCount > 0 && (
                <button onClick={markAllAsRead} className="text-[10px] text-gray-500 hover:text-luxury-red font-bold uppercase cursor-pointer transition-colors">
                  Limpiar Todo
                </button>
              )}
            </div>
            
            <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-400">
                  <CheckCircle2 size={32} className="mx-auto mb-2 opacity-50 text-green-500" />
                  <p className="text-[10px] font-black uppercase tracking-widest">Estás al día</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50 dark:divide-zinc-800/40">
                  {notifications.map(notif => (
                    <div 
                      key={notif.id} 
                      onClick={() => handleNotificationClick(notif)}
                      className="p-4 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-all flex gap-3 items-start group cursor-pointer text-left select-none active:scale-[0.98]"
                    >
                      <div className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${notif.type === 'alert' ? 'bg-amber-500' : 'bg-luxury-red'} animate-pulse`} />
                      
                      {/* 🔥 SE QUITÓ pointer-events-none PARA PERMITIR CLIC COMPLETO */}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-black text-gray-900 dark:text-white uppercase truncate">{notif.title}</p>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 leading-snug font-medium">{notif.message}</p>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-2">
                          {new Date(notif.created_at).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>

                      <button 
                        onClick={(e) => markAsReadSilently(e, notif.id)}
                        className="text-gray-300 dark:text-zinc-600 hover:text-luxury-red opacity-0 group-hover:opacity-100 transition-all cursor-pointer p-1 shrink-0"
                        title="Borrar esta notificación"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
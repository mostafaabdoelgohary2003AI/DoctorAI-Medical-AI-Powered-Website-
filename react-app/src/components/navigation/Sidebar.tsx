import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { toggleSidebar } from '../../store/slices/uiSlice';
import { 
  Home, 
  Stethoscope, 
  Image as ImageIcon, 
  Activity, 
  User, 
  Heart, 
  FileText, 
  Calendar, 
  Settings,
  Menu,
  X,
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const dispatch = useDispatch();
  const { sidebarOpen, language } = useSelector((state: RootState) => state.ui);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const menu = document.getElementById('sidebar-menu');
      const toggleButton = document.getElementById('sidebar-toggle');
      
      if (menu && !menu.contains(event.target as Node) && 
          toggleButton && !toggleButton.contains(event.target as Node)) {
        if (sidebarOpen) {
          dispatch(toggleSidebar());
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dispatch, sidebarOpen]);

  // Close menu on route change
  useEffect(() => {
    if (sidebarOpen) {
      dispatch(toggleSidebar());
    }
  }, [dispatch, location.pathname]);

  const navClasses = "flex items-center p-3 text-neutral-600 dark:text-neutral-300 hover:bg-primary-50 dark:hover:bg-neutral-700 hover:text-primary-500 dark:hover:text-primary-400 rounded-lg transition-all duration-200";
  const activeClasses = "bg-primary-50 dark:bg-neutral-700 text-primary-500 dark:text-primary-400";

  return (
    <>
      <button
        id="sidebar-toggle"
        onClick={() => dispatch(toggleSidebar())}
        className={`fixed top-4 left-4 z-50 p-3 rounded-xl bg-white dark:bg-neutral-800 shadow-lg 
          hover:shadow-xl transform transition-all duration-300 ease-out
          hover:scale-105 active:scale-95 
          ${sidebarOpen ? 'rotate-90 bg-primary-50 dark:bg-neutral-700' : ''}
          group focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-900`}
        aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={sidebarOpen}
        aria-controls="sidebar-menu"
      >
        <div className="relative w-6 h-6 flex items-center justify-center">
          <div className={`absolute w-6 h-6 transition-all duration-300 
            ${sidebarOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'}`}>
            <X className="w-6 h-6 text-primary-500 dark:text-primary-400" />
          </div>
          <div className={`absolute w-6 h-6 transition-all duration-300 
            ${sidebarOpen ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'}`}>
            <Menu className="w-6 h-6 text-neutral-600 dark:text-neutral-300 
              group-hover:text-primary-500 dark:group-hover:text-primary-400" />
          </div>
        </div>
      </button>

      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black transition-opacity duration-300 
          ${sidebarOpen ? 'opacity-50 z-40' : 'opacity-0 -z-10'}`}
        aria-hidden="true"
      />

      {/* Popup Menu */}
      <div
        id="sidebar-menu"
        role="navigation"
        aria-label="Main navigation"
        className={`fixed left-0 top-0 h-full w-64 bg-white dark:bg-neutral-800 shadow-2xl z-50 
          transform transition-all duration-300 ease-out
          ${sidebarOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'} 
          pt-20`}
      >
        <div className="h-full px-4 py-6 overflow-y-auto">
          <nav className="space-y-2">
            <NavLink
              to="/"
              className={({ isActive }) => 
                `${navClasses} ${isActive ? activeClasses : ''}`
              }
              end
            >
              <Home className="w-5 h-5 mr-3" />
              <span>{language === 'en' ? 'Home' : 'الرئيسية'}</span>
            </NavLink>
            
            <NavLink
              to="/diagnostics"
              className={({ isActive }) => 
                `${navClasses} ${isActive ? activeClasses : ''}`
              }
            >
              <Stethoscope className="w-5 h-5 mr-3" />
              <span>{language === 'en' ? 'Diagnostics' : 'التشخيص'}</span>
            </NavLink>
            
            <NavLink
              to="/image-analysis"
              className={({ isActive }) => 
                `${navClasses} ${isActive ? activeClasses : ''}`
              }
            >
              <ImageIcon className="w-5 h-5 mr-3" />
              <span>{language === 'en' ? 'Image Analysis' : 'تحليل الصور'}</span>
            </NavLink>
            
            <NavLink
              to="/symptom-checker"
              className={({ isActive }) => 
                `${navClasses} ${isActive ? activeClasses : ''}`
              }
            >
              <Activity className="w-5 h-5 mr-3" />
              <span>{language === 'en' ? 'Symptom Checker' : 'فاحص الأعراض'}</span>
            </NavLink>
            
            {isAuthenticated && (
              <>
                <div className="pt-4 mt-4 border-t border-neutral-200 dark:border-neutral-700">
                  <h3 className="px-3 text-sm font-medium text-neutral-500 dark:text-neutral-400 uppercase">
                    {language === 'en' ? 'Personal' : 'شخصي'}
                  </h3>
                </div>
                
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) => 
                    `${navClasses} ${isActive ? activeClasses : ''}`
                  }
                >
                  <User className="w-5 h-5 mr-3" />
                  <span>{language === 'en' ? 'Dashboard' : 'لوحة التحكم'}</span>
                </NavLink>
                
                <NavLink
                  to="/health-records"
                  className={({ isActive }) => 
                    `${navClasses} ${isActive ? activeClasses : ''}`
                  }
                >
                  <FileText className="w-5 h-5 mr-3" />
                  <span>{language === 'en' ? 'Health Records' : 'السجلات الصحية'}</span>
                </NavLink>
                
                <NavLink
                  to="/appointments"
                  className={({ isActive }) => 
                    `${navClasses} ${isActive ? activeClasses : ''}`
                  }
                >
                  <Calendar className="w-5 h-5 mr-3" />
                  <span>{language === 'en' ? 'Appointments' : 'المواعيد'}</span>
                </NavLink>
                
                <NavLink
                  to="/settings"
                  className={({ isActive }) => 
                    `${navClasses} ${isActive ? activeClasses : ''}`
                  }
                >
                  <Settings className="w-5 h-5 mr-3" />
                  <span>{language === 'en' ? 'Settings' : 'الإعدادات'}</span>
                </NavLink>
              </>
            )}
            
            <div className="pt-4 mt-4 border-t border-neutral-200 dark:border-neutral-700">
              <h3 className="px-3 text-sm font-medium text-neutral-500 dark:text-neutral-400 uppercase">
                {language === 'en' ? 'Resources' : 'موارد'}
              </h3>
            </div>
            
            <NavLink
              to="/health-guides"
              className={({ isActive }) => 
                `${navClasses} ${isActive ? activeClasses : ''}`
              }
            >
              <Heart className="w-5 h-5 mr-3" />
              <span>{language === 'en' ? 'Health Guides' : 'أدلة صحية'}</span>
            </NavLink>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
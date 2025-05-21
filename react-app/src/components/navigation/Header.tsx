import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { toggleTheme, toggleSidebar, setLanguage } from '../../store/slices/uiSlice';
import { logout } from '../../store/slices/authSlice';
import { Menu, X, Sun, Moon, Globe, Menu as MenuIcon, User, LogOut } from 'lucide-react';

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme, language, sidebarOpen } = useSelector((state: RootState) => state.ui);
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  
  const [menuOpen, setMenuOpen] = React.useState(false);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/');
  };

  const toggleLanguage = () => {
    dispatch(setLanguage(language === 'en' ? 'ar' : 'en'));
  };

  return (
    <header className="bg-white dark:bg-neutral-800 shadow-sm sticky top-0 z-50">
      <div className="container-custom py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              className="md:hidden mr-2 text-neutral-600 dark:text-neutral-300 hover:text-primary-500 dark:hover:text-primary-400"
              onClick={() => dispatch(toggleSidebar())}
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            
            <Link to="/" className="flex items-center">
              <svg className="w-8 h-8 text-primary-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 6H9C7.34315 6 6 7.34315 6 9V16C6 17.6569 7.34315 19 9 19H16C17.6569 19 19 17.6569 19 16V9C19 7.34315 17.6569 6 16 6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8.5 14C9.32843 14 10 13.3284 10 12.5C10 11.6716 9.32843 11 8.5 11C7.67157 11 7 11.6716 7 12.5C7 13.3284 7.67157 14 8.5 14Z" fill="currentColor"/>
                <path d="M15.5 14C16.3284 14 17 13.3284 17 12.5C17 11.6716 16.3284 11 15.5 11C14.6716 11 14 11.6716 14 12.5C14 13.3284 14.6716 14 15.5 14Z" fill="currentColor"/>
                <path d="M10 16H14V15C14 14.4477 13.5523 14 13 14H11C10.4477 14 10 14.4477 10 15V16Z" fill="currentColor"/>
                <path d="M12 6V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M17 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5 12H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="ml-2 text-xl font-semibold text-neutral-800 dark:text-white">
                {language === 'en' ? 'DoctorAI' : 'دكتوري'}
              </span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/diagnostics"
              className="text-neutral-600 dark:text-neutral-300 hover:text-primary-500 dark:hover:text-primary-400"
            >
              {language === 'en' ? 'Diagnostics' : 'التشخيص'}
            </Link>
            <Link
              to="/image-analysis"
              className="text-neutral-600 dark:text-neutral-300 hover:text-primary-500 dark:hover:text-primary-400"
            >
              {language === 'en' ? 'Image Analysis' : 'تحليل الصور'}
            </Link>
            <Link
              to="/symptom-checker"
              className="text-neutral-600 dark:text-neutral-300 hover:text-primary-500 dark:hover:text-primary-400"
            >
              {language === 'en' ? 'Symptom Checker' : 'فاحص الأعراض'}
            </Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            <button
              className="text-neutral-600 dark:text-neutral-300 hover:text-primary-500 dark:hover:text-primary-400"
              onClick={() => dispatch(toggleTheme())}
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            
            <button
              className="text-neutral-600 dark:text-neutral-300 hover:text-primary-500 dark:hover:text-primary-400"
              onClick={toggleLanguage}
              aria-label="Toggle language"
            >
              <Globe size={20} />
            </button>
            
            {isAuthenticated ? (
              <div className="relative">
                <button
                  className="flex items-center text-neutral-600 dark:text-neutral-300 hover:text-primary-500 dark:hover:text-primary-400"
                  onClick={() => setMenuOpen(!menuOpen)}
                  aria-label="User menu"
                >
                  <User size={20} />
                  <span className="ml-2 hidden md:inline">{user?.name}</span>
                </button>
                
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-800 rounded-md shadow-lg py-1 z-50">
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                      onClick={() => setMenuOpen(false)}
                    >
                      {language === 'en' ? 'Dashboard' : 'لوحة التحكم'}
                    </Link>
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                      onClick={() => {
                        setMenuOpen(false);
                        handleLogout();
                      }}
                    >
                      <div className="flex items-center">
                        <LogOut size={16} className="mr-2" />
                        {language === 'en' ? 'Logout' : 'تسجيل الخروج'}
                      </div>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="btn-primary text-sm px-4 py-2"
              >
                {language === 'en' ? 'Login' : 'تسجيل الدخول'}
              </Link>
            )}
            
            <button
              className="md:hidden text-neutral-600 dark:text-neutral-300 hover:text-primary-500 dark:hover:text-primary-400"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle mobile menu"
            >
              <MenuIcon size={24} />
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {menuOpen && (
          <nav className="md:hidden mt-4 pb-2">
            <div className="flex flex-col space-y-4">
              <Link
                to="/diagnostics"
                className="text-neutral-600 dark:text-neutral-300 hover:text-primary-500 dark:hover:text-primary-400"
                onClick={() => setMenuOpen(false)}
              >
                {language === 'en' ? 'Diagnostics' : 'التشخيص'}
              </Link>
              <Link
                to="/image-analysis"
                className="text-neutral-600 dark:text-neutral-300 hover:text-primary-500 dark:hover:text-primary-400"
                onClick={() => setMenuOpen(false)}
              >
                {language === 'en' ? 'Image Analysis' : 'تحليل الصور'}
              </Link>
              <Link
                to="/symptom-checker"
                className="text-neutral-600 dark:text-neutral-300 hover:text-primary-500 dark:hover:text-primary-400"
                onClick={() => setMenuOpen(false)}
              >
                {language === 'en' ? 'Symptom Checker' : 'فاحص الأعراض'}
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
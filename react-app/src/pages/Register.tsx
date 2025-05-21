import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { AppDispatch } from '../store';
import { register } from '../store/slices/authSlice';
import { AtSign, Lock, User, AlertCircle, Eye, EyeOff, Check } from 'lucide-react';

const Register: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { language } = useSelector((state: RootState) => state.ui);
  const { isLoading, error } = useSelector((state: RootState) => state.auth);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  
  const checkPasswordStrength = (password: string) => {
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 25;
    
    // Contains lowercase
    if (/[a-z]/.test(password)) strength += 25;
    
    // Contains uppercase
    if (/[A-Z]/.test(password)) strength += 25;
    
    // Contains number or special char
    if (/[0-9!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 25;
    
    setPasswordStrength(strength);
  };
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    checkPasswordStrength(newPassword);
  };
  
  const getStrengthColor = () => {
    if (passwordStrength <= 25) return 'bg-error-500';
    if (passwordStrength <= 50) return 'bg-warning-500';
    if (passwordStrength <= 75) return 'bg-accent-500';
    return 'bg-success-500';
  };
  
  const getStrengthText = () => {
    if (passwordStrength <= 25) {
      return language === 'en' ? 'Weak' : 'ضعيف';
    }
    if (passwordStrength <= 50) {
      return language === 'en' ? 'Fair' : 'مقبول';
    }
    if (passwordStrength <= 75) {
      return language === 'en' ? 'Good' : 'جيد';
    }
    return language === 'en' ? 'Strong' : 'قوي';
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(register({ name, email, password }));
    
    if (register.fulfilled.match(result)) {
      navigate('/dashboard');
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center justify-center">
            <svg className="w-10 h-10 text-primary-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 6H9C7.34315 6 6 7.34315 6 9V16C6 17.6569 7.34315 19 9 19H16C17.6569 19 19 17.6569 19 16V9C19 7.34315 17.6569 6 16 6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8.5 14C9.32843 14 10 13.3284 10 12.5C10 11.6716 9.32843 11 8.5 11C7.67157 11 7 11.6716 7 12.5C7 13.3284 7.67157 14 8.5 14Z" fill="currentColor"/>
              <path d="M15.5 14C16.3284 14 17 13.3284 17 12.5C17 11.6716 16.3284 11 15.5 11C14.6716 11 14 11.6716 14 12.5C14 13.3284 14.6716 14 15.5 14Z" fill="currentColor"/>
              <path d="M10 16H14V15C14 14.4477 13.5523 14 13 14H11C10.4477 14 10 14.4477 10 15V16Z" fill="currentColor"/>
              <path d="M12 6V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M17 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5 12H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="ml-2 text-2xl font-bold text-neutral-900 dark:text-white">
              {language === 'en' ? 'DoctorAI' : 'دكتوري'}
            </span>
          </Link>
          <h2 className="mt-6 text-3xl font-extrabold text-neutral-900 dark:text-white">
            {language === 'en' ? 'Create your account' : 'إنشاء حسابك'}
          </h2>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
            {language === 'en' ? 'Already have an account? ' : 'لديك حساب بالفعل؟ '}
            <Link
              to="/login"
              className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
            >
              {language === 'en' ? 'Sign in' : 'تسجيل الدخول'}
            </Link>
          </p>
        </div>
        
        {error && (
          <div className="bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-md p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-error-400 dark:text-error-300" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-error-800 dark:text-error-200">
                  {language === 'en' ? 'Registration Error' : 'خطأ في التسجيل'}
                </h3>
                <div className="mt-2 text-sm text-error-700 dark:text-error-300">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                {language === 'en' ? 'Full name' : 'الاسم الكامل'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input pl-10"
                  placeholder={language === 'en' ? 'Full name' : 'الاسم الكامل'}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                {language === 'en' ? 'Email address' : 'البريد الإلكتروني'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <AtSign className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input pl-10"
                  placeholder={language === 'en' ? 'Email address' : 'البريد الإلكتروني'}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                {language === 'en' ? 'Password' : 'كلمة المرور'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={handlePasswordChange}
                  className="form-input pl-10 pr-10"
                  placeholder={language === 'en' ? 'Password' : 'كلمة المرور'}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-neutral-400 hover:text-neutral-500 dark:hover:text-neutral-300 focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              
              {password && (
                <div className="mt-2">
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex-1 h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full mr-2">
                      <div
                        className={`h-2 rounded-full ${getStrengthColor()}`}
                        style={{ width: `${passwordStrength}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-neutral-500 dark:text-neutral-400">
                      {getStrengthText()}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs mt-2">
                    <div className="flex items-center">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                        password.length >= 8 ? 'bg-success-100 text-success-700 dark:bg-success-900/20 dark:text-success-300' : 'bg-neutral-100 text-neutral-400 dark:bg-neutral-800'
                      }`}>
                        {password.length >= 8 && <Check className="w-3 h-3" />}
                      </div>
                      <span className="ml-2 text-neutral-600 dark:text-neutral-300">
                        {language === 'en' ? 'Min. 8 characters' : 'الحد الأدنى 8 أحرف'}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                        /[A-Z]/.test(password) ? 'bg-success-100 text-success-700 dark:bg-success-900/20 dark:text-success-300' : 'bg-neutral-100 text-neutral-400 dark:bg-neutral-800'
                      }`}>
                        {/[A-Z]/.test(password) && <Check className="w-3 h-3" />}
                      </div>
                      <span className="ml-2 text-neutral-600 dark:text-neutral-300">
                        {language === 'en' ? 'Uppercase letter' : 'حرف كبير'}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                        /[a-z]/.test(password) ? 'bg-success-100 text-success-700 dark:bg-success-900/20 dark:text-success-300' : 'bg-neutral-100 text-neutral-400 dark:bg-neutral-800'
                      }`}>
                        {/[a-z]/.test(password) && <Check className="w-3 h-3" />}
                      </div>
                      <span className="ml-2 text-neutral-600 dark:text-neutral-300">
                        {language === 'en' ? 'Lowercase letter' : 'حرف صغير'}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                        /[0-9!@#$%^&*(),.?":{}|<>]/.test(password) ? 'bg-success-100 text-success-700 dark:bg-success-900/20 dark:text-success-300' : 'bg-neutral-100 text-neutral-400 dark:bg-neutral-800'
                      }`}>
                        {/[0-9!@#$%^&*(),.?":{}|<>]/.test(password) && <Check className="w-3 h-3" />}
                      </div>
                      <span className="ml-2 text-neutral-600 dark:text-neutral-300">
                        {language === 'en' ? 'Number or symbol' : 'رقم أو رمز'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
            />
            <label
              htmlFor="terms"
              className="ml-2 block text-sm text-neutral-700 dark:text-neutral-300"
            >
              {language === 'en'
                ? 'I agree to the Terms of Service and Privacy Policy'
                : 'أوافق على شروط الخدمة وسياسة الخصوصية'}
            </label>
          </div>
          
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  {language === 'en' ? 'Creating account...' : 'جاري إنشاء الحساب...'}
                </>
              ) : (
                language === 'en' ? 'Create account' : 'إنشاء حساب'
              )}
            </button>
          </div>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-300 dark:border-neutral-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-neutral-900 text-neutral-500">
                  {language === 'en' ? 'Or sign up with' : 'أو قم بالتسجيل باستخدام'}
                </span>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-2 gap-3">
              <a
                href="#"
                className="w-full inline-flex justify-center py-2 px-4 border border-neutral-300 dark:border-neutral-700 rounded-md shadow-sm bg-white dark:bg-neutral-800 text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-700"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
              </a>
              
              <a
                href="#"
                className="w-full inline-flex justify-center py-2 px-4 border border-neutral-300 dark:border-neutral-700 rounded-md shadow-sm bg-white dark:bg-neutral-800 text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-700"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.12 0-.23-.02-.3-.03-.01-.06-.04-.22-.04-.39 0-1.15.572-2.27 1.206-2.98.804-.94 2.142-1.64 3.248-1.68.03.13.05.28.05.43zm4.565 15.71c-.03.07-.463 1.58-1.518 3.12-.945 1.34-1.94 2.71-3.43 2.71-1.517 0-1.9-.88-3.63-.88-1.698 0-2.302.91-3.67.91-1.377 0-2.332-1.26-3.428-2.8-1.287-1.82-2.323-4.63-2.323-7.28 0-4.28 2.797-6.55 5.552-6.55 1.448 0 2.675.95 3.6.95.865 0 2.222-1.01 3.902-1.01.613 0 2.886.06 4.374 2.19-.13.09-2.383 1.37-2.383 4.19 0 3.26 2.854 4.42 2.955 4.45z" />
                </svg>
              </a>
            </div>
          </div>
        </form>
        
        <p className="mt-10 text-center text-xs text-neutral-500 dark:text-neutral-400">
          {language === 'en'
            ? 'By creating an account, you agree to our Terms of Service, Privacy Policy, and our default Notification Settings.'
            : 'بإنشاء حساب، فإنك توافق على شروط الخدمة وسياسة الخصوصية وإعدادات الإشعارات الافتراضية.'}
        </p>
      </div>
    </div>
  );
};

export default Register;
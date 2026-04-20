import { useState } from 'react';
import { Home, List, BarChart3, Users, Settings, LogOut, Menu, X, MessageCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router';

const menuItems = [
  { path: '/dashboard', icon: Home, label: 'Дашборд' },
  { path: '/expenses', icon: List, label: 'Мої витрати' },
  { path: '/analytics', icon: BarChart3, label: 'Аналітика' },
  { path: '/family', icon: Users, label: "Сім'я" },
  { path: '/feedback', icon: MessageCircle, label: 'Зворотний зв\'язок' },
  { path: '/settings', icon: Settings, label: 'Налаштування' },
];

export function Sidebar() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    window.location.href = '/';
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Burger Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-3 rounded-lg"
        style={{ backgroundColor: '#222e54', color: 'white' }}
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed md:static
          w-64 min-h-screen flex flex-col
          transition-transform duration-300 z-40
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
        style={{ backgroundColor: '#222e54' }}
      >
        {/* Logo */}
        <div className="p-6 border-b" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
          <h2 className="text-2xl text-white">CoinKeeper</h2>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors min-h-[44px]"
                    style={{
                      backgroundColor: isActive ? '#4c929e' : 'transparent',
                      color: 'white'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = '#4c929e';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg w-full transition-colors min-h-[44px]"
            style={{ color: '#ce6a6c' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(206, 106, 108, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <LogOut size={20} />
            <span>Вийти</span>
          </button>
        </div>
      </div>
    </>
  );
}

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Home, PlusCircle, User, LogOut, LogIn, UserPlus } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold text-blue-600 flex items-center">
            <Home className="mr-2" size={24} />
            <span>SocialBlog</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {isAdmin() && (
                  <Link 
                    to="/create-post" 
                    className="flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <PlusCircle className="mr-1" size={20} />
                    <span>Create Post</span>
                  </Link>
                )}
                
                <Link 
                  to="/profile" 
                  className="flex items-center text-gray-700 hover:text-gray-900"
                >
                  <User className="mr-1" size={20} />
                  <span>{user.name}</span>
                </Link>
                
                <button 
                  onClick={handleLogout}
                  className="flex items-center text-gray-700 hover:text-gray-900"
                >
                  <LogOut className="mr-1" size={20} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="flex items-center text-gray-700 hover:text-gray-900"
                >
                  <LogIn className="mr-1" size={20} />
                  <span>Login</span>
                </Link>
                
                <Link 
                  to="/register" 
                  className="flex items-center text-gray-700 hover:text-gray-900"
                >
                  <UserPlus className="mr-1" size={20} />
                  <span>Register</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
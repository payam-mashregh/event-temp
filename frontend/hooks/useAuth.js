// upto/frontend/hooks/useAuth.js
import { useContext } from 'react';
// Import the actual Context object from the context file
import { AuthContext } from '../contexts/AuthContext';

const useAuth = () => {
    // Now, AuthContext is a guaranteed valid Context object
    const context = useContext(AuthContext);
    
    if (context === undefined) {
        // This error will correctly fire if a component is not wrapped in the Provider
        throw new Error('useAuth must be used within an AuthProvider');
    }
    
    return context;
};

export default useAuth;
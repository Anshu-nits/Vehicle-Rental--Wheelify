import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext/AuthContext.jsx';

const PrivateRoute = ({ children }) => {
  const { token } = useContext(AuthContext);
  return token ? children : <Navigate to="/login" />;
};

export default PrivateRoute;

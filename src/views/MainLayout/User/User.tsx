import { useNavigate, useOutletContext } from 'react-router-dom';
import { Auth, getAuth, signOut } from 'firebase/auth';
import { Button } from '@mui/material';

import { MainLayoutOutletProps } from '../MainLayout';

function User() {
  const navigate = useNavigate();
  const { setSnackbarState, setIsOpenLoading, user } =
    useOutletContext<MainLayoutOutletProps>();

  const firebaseAuth = getAuth();

  const logout = (auth: Auth) => {
    setIsOpenLoading(true);
    signOut(auth)
      .then(() => {
        setSnackbarState({ open: true, message: '登出成功' });
        navigate('/login');
      })
      .catch(() => {
        setSnackbarState({ open: true, message: '登出失敗' });
      })
      .finally(() => {
        setIsOpenLoading(false);
      });
  };

  return (
    <div className="flex-1 p-4">
      <h1 className="mb-4 text-xl">Hi, {user.displayName}</h1>
      <Button
        fullWidth
        variant="contained"
        onClick={() => logout(firebaseAuth)}
      >
        登出
      </Button>
    </div>
  );
}

export default User;

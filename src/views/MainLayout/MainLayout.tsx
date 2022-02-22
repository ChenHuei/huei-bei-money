/* eslint-disable react/jsx-no-useless-fragment */
import { useEffect, useState, useRef } from 'react';
import { Link, Outlet, useLocation, useNavigate, useOutletContext } from 'react-router-dom';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';

import { AppOutletProps } from '@/App';
import { TABS_LIST } from '@/constants/mainLayout';

interface MainLayoutOutletProps extends AppOutletProps {
  user: User;
}

function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const userRef = useRef<User | null>(null);
  const { setSnackbarState, setIsOpenLoading } = useOutletContext<AppOutletProps>();
  const [isAuth, setIsAuth] = useState(false);
  const [tab, setTab] = useState(0);

  const auth = getAuth();

  useEffect(() => {
    const unlisten = onAuthStateChanged(auth, (user) => {
      if (user) {
        userRef.current = user;
        setIsAuth(true);
      } else {
        navigate('/login');
      }
    });

    return () => {
      unlisten();
    };
  }, [auth, navigate]);

  useEffect(() => {
    const index = TABS_LIST.findIndex((item) => item.to === location.pathname);

    if (index > -1) {
      setTab(index);
    }
  }, [location]);

  return isAuth ? (
    <>
      <main className="relative flex flex-col min-w-full min-h-[calc(100vh-56px)] bg-primaryLighter">
        <Outlet context={{ setSnackbarState, setIsOpenLoading, user: userRef.current }} />
      </main>
      <BottomNavigation
        className="sticky bottom-0 right-0"
        showLabels
        value={tab}
        onChange={(_, newValue) => {
          setTab(newValue);
        }}
      >
        {TABS_LIST.map((item) => (
          <BottomNavigationAction key={item.to} {...item} component={Link} />
        ))}
      </BottomNavigation>
    </>
  ) : (
    <></>
  );
}

export default MainLayout;
export type { MainLayoutOutletProps };

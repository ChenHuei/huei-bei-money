/* eslint-disable react/jsx-no-useless-fragment */
import { useEffect, useState, useRef } from 'react';
import { Link, Outlet, useNavigate, useOutletContext } from 'react-router-dom';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';

import { AppOutletProps } from '@/App';

interface MainLayoutOutletProps extends AppOutletProps {
  user: User;
}

function MainLayout() {
  const navigate = useNavigate();
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
  }, [auth]);

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
        <BottomNavigationAction component={Link} to="/home" label="首頁" icon={<HomeIcon />} />
        <BottomNavigationAction
          component={Link}
          to="/home/family"
          label="家庭基金"
          icon={<FamilyRestroomIcon />}
        />
        <BottomNavigationAction
          component={Link}
          to="/home/user"
          label="帳戶"
          icon={<PersonIcon />}
        />
      </BottomNavigation>
    </>
  ) : (
    <></>
  );
}

export default MainLayout;
export type { MainLayoutOutletProps };

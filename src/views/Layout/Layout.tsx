import { useState } from 'react';
import { Link, Outlet, useOutletContext } from 'react-router-dom';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';

import { OutletProps } from '@/App';

function Layout() {
  const { setSnackbarState, setIsOpenLoading } = useOutletContext<OutletProps>();
  const [tab, setTab] = useState(0);

  return (
    <>
      <main className="relative flex flex-col min-w-full min-h-screen bg-primaryLighter">
        <Outlet context={{ setSnackbarState, setIsOpenLoading }} />
      </main>
      <BottomNavigation
        className="sticky bottom-0 right-0"
        showLabels
        value={tab}
        onChange={(_, newValue) => {
          setTab(newValue);
        }}
      >
        <BottomNavigationAction component={Link} to="/home" label="Home" icon={<HomeIcon />} />
        <BottomNavigationAction
          component={Link}
          to="/home/user"
          label="User"
          icon={<PersonIcon />}
        />
      </BottomNavigation>
    </>
  );
}

export default Layout;

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
      <Outlet context={{ setSnackbarState, setIsOpenLoading }} />
      <BottomNavigation
        className="sticky bottom-0 right-0"
        showLabels
        value={tab}
        onChange={(_, newValue) => {
          setTab(newValue);
        }}
      >
        <BottomNavigationAction component={Link} to="/" label="Home" icon={<HomeIcon />} />
        <BottomNavigationAction component={Link} to="/login" label="User" icon={<PersonIcon />} />
      </BottomNavigation>
    </>
  );
}

export default Layout;

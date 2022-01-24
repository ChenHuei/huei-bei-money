/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react/no-unstable-nested-components */
import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  Backdrop,
  BottomNavigation,
  BottomNavigationAction,
  CircularProgress,
  Snackbar,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';

import FirebaseProvider from '@/context/firebase';

import Transition from './components/Transition';

interface OutletProps {
  setSnackbarState: Function;
  setLoadingState: Function;
}

const theme = createTheme({
  palette: {
    secondary: {
      light: '#6998AB',
      main: '#406882',
      dark: '#1A374D',
      contrastText: '#ffffff',
    },
  },
});

function App() {
  const [snackbarState, setSnackbarState] = useState({
    open: false,
    message: '',
  });
  const [loadingState, setLoadingState] = useState({ open: false });
  const [tab, setTab] = useState(0);

  return (
    <ThemeProvider theme={theme}>
      <FirebaseProvider>
        <main className="relative flex flex-col min-w-full min-h-screen bg-primaryLighter">
          <Outlet context={{ setSnackbarState, setLoadingState }} />
        </main>
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
        <Snackbar
          {...snackbarState}
          onClose={() => setSnackbarState({ open: false, message: '' })}
          TransitionComponent={Transition}
          autoHideDuration={1500}
        />
        <Backdrop className="text-white z-9999" open={loadingState.open}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </FirebaseProvider>
    </ThemeProvider>
  );
}

export default App;
export type { OutletProps };

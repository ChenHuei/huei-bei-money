import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import {
  Backdrop,
  CircularProgress,
  createTheme,
  Snackbar,
  ThemeProvider,
} from '@mui/material';

import Transition from './components/Transition';
import FirebaseProvider from './context/firebase';

interface AppOutletProps {
  setSnackbarState: Function;
  setIsOpenLoading: Function;
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
  const [isOpenLoading, setIsOpenLoading] = useState(false);
  const [snackbarState, setSnackbarState] = useState({
    open: false,
    message: '',
  });

  return (
    <ThemeProvider theme={theme}>
      <FirebaseProvider>
        <Outlet
          context={{ setSnackbarState, setIsOpenLoading } as AppOutletProps}
        />
        <Snackbar
          {...snackbarState}
          onClose={() => setSnackbarState({ open: false, message: '' })}
          TransitionComponent={Transition}
          autoHideDuration={1500}
        />
        <Backdrop className="text-white z-9999" open={isOpenLoading}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </FirebaseProvider>
    </ThemeProvider>
  );
}

export default App;
export type { AppOutletProps };

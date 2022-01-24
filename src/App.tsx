/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react/no-unstable-nested-components */
import { useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Backdrop, CircularProgress, Slide, Snackbar } from '@mui/material';

import FirebaseProvider from '@/context/firebase';

// views
import Home from '@/views/Home';

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

  return (
    <ThemeProvider theme={theme}>
      <FirebaseProvider>
        <Home setSnackbarState={setSnackbarState} setLoadingState={setLoadingState} />
        <Snackbar
          {...snackbarState}
          onClose={() => setSnackbarState({ open: false, message: '' })}
          TransitionComponent={(props) => <Slide {...props} direction="up" />}
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

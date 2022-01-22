import { createTheme, ThemeProvider } from '@mui/material/styles';

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
  return (
    <ThemeProvider theme={theme}>
      <FirebaseProvider>
        <Home />
      </FirebaseProvider>
    </ThemeProvider>
  );
}

export default App;

import { createTheme, ThemeProvider } from '@mui/material/styles';

import FirebaseProvider from '@/context/firebase';

// views
import Home from '@/views/Home';

const theme = createTheme({
  palette: {
    secondary: {
      light: '#D3DEDC',
      main: '#92A9BD',
      dark: '#7C99AC',
      contrastText: '#FFEFEF',
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

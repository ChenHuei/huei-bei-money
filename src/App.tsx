import { useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import FirebaseProvider from "@/context/firebase";

import Header from "@/components/Header";

const theme = createTheme({
  palette: {
    secondary: {
      light: "#D3DEDC",
      main: "#92A9BD",
      dark: "#7C99AC",
      contrastText: "#FFEFEF",
    },
  },
});

function App() {
  const [current, setCurrent] = useState<Date>(new Date());

  return (
    <ThemeProvider theme={theme}>
      <FirebaseProvider>
        <main className="flex flex-col min-w-full min-h-screen">
          <Header current={current} onChange={setCurrent} />
          <div className="flex-1 bg-primaryLighter">content</div>
        </main>
      </FirebaseProvider>
    </ThemeProvider>
  );
}

export default App;

import { useState } from "react";
import Header from "@/components/Header";

function App() {
  const [current] = useState<Date>(new Date());

  return (
    <main className="flex flex-col min-w-full min-h-screen">
      <Header current={current} />
      <div className="flex-1 bg-primary">content</div>
    </main>
  );
}

export default App;

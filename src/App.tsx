import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import TrafficAnalysis from "./pages/TrafficAnalysis";
import AttacksAnalysis from "./pages/AttacksAnalysis";
import { useIDSData } from "./hooks/useIDSData";

function App() {
  const { lastUpdated } = useIDSData();

  return (
    <BrowserRouter>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 ml-64 min-h-screen bg-gray-50">
          <Header lastUpdated={lastUpdated} />
          <main>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/traffic" element={<TrafficAnalysis />} />
              <Route path="/attacks" element={<AttacksAnalysis />} />
              <Route path="*" element={<Dashboard />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;

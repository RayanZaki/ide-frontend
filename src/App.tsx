import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import TrafficAnalysis from "./pages/TrafficAnalysis";
import AttacksAnalysis from "./pages/AttacksAnalysis";
import { useIDSData } from "./hooks/useIDSData";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { io } from "socket.io-client";

const socket = io(
  "http://localhost:5000"
  //   , {
  //   transports: ["websocket"],
  //   withCredentials: true,
  //   reconnection: true,
  //   reconnectionAttempts: Infinity,
  //   reconnectionDelay: 1000,
  // }
);

function App() {
  const [open, setOpen] = useState(false);
  const [attackData, setAttackData] = useState(null);
  const { lastUpdated } = useIDSData();

  useEffect(() => {
    socket.on("attack_detected", (data) => {
      console.log("Attack detected:", data);
      setAttackData(data);
      setOpen(true);
    });

    return () => {
      socket.off("attack_detected");
    };
  }, []);

  const handleClose = () => {
    setOpen(false);
    setAttackData(null);
  };

  return (
    <BrowserRouter>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>🚨 Attack Detected!</DialogTitle>
        <DialogContent dividers>
          {attackData && (
            <div>
              <p>
                <strong>Type:</strong> {attackData?.type}
              </p>
              <p>
                <strong>Message:</strong> {attackData?.message}
              </p>
              <p>
                <strong>Source IP:</strong> {attackData?.source}
              </p>
              <p>
                <strong>Timestamp:</strong> {attackData?.timestamp}
              </p>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
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

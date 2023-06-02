import { BrowserRouter, Routes, Route } from "react-router-dom";

import { ChatRoom, Register, Login } from "../pages";
import ProtectedRoute from "../utils/ProtectedRoute";

const App = () => {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/chatRoom"
            element={
              <ProtectedRoute>
                <ChatRoom />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;

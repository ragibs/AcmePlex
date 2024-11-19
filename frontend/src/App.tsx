import { Home } from "./pages/Home";
import SearchByMovie from "./pages/SearchByMovie";
import SearchByTheatre from "./pages/SeachByTheatre";
import SeatSelection from "./pages/SeatSelection";
import ManageReservation from "./pages/ManageReservation";

import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/searchbymovie" element={<SearchByMovie />} />
      <Route path="/searchbytheatre" element={<SearchByTheatre />} />
      <Route path="/seatselection" element={<SeatSelection />} />
      <Route path="/managereservation" element={<ManageReservation />} />
    </Routes>
  );
}

export default App;

import { Home } from "./pages/Home";
import SearchByMovie from "./pages/SearchByMovie";
import SearchByTheatre from "./pages/SeachByTheatre";
import SeatSelection from "./pages/SeatSelection";
import GetReservation from "./pages/GetReservation";
import ManageReservation from "./pages/ManageReservation";
import Admin from "./pages/Admin";
import ConfirmTickets from "./pages/ConfirmTickets";
import Register from "./pages/Register";
import CheckBalance from "./pages/CheckBalance";
import SignedInPurchase from "./pages/SignedInPurchase";
import { Routes, Route } from "react-router-dom";
import { Check } from "lucide-react";
import BookingConfirmation from "./pages/BookingConfirmation";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/searchbymovie" element={<SearchByMovie />} />
      <Route path="/searchbytheatre" element={<SearchByTheatre />} />
      <Route path="/seatselection" element={<SeatSelection />} />
      <Route path="/getReservation" element={<GetReservation />} />
      <Route path="/managereservation" element={<ManageReservation />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/confirmtickets" element={<ConfirmTickets />} />
      <Route path="/register" element={<Register />} />
      <Route path="/checkbalance" element={<CheckBalance />} />
      <Route path="/confirmbooking" element={<BookingConfirmation />} />

      <Route path="/signedinpurchase" element={<SignedInPurchase />} />
    </Routes>
  );
}

export default App;

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
import BookingConfirmation from "./pages/BookingConfirmation";
import NotFound from "./pages/NotFound";
import CancelConfirmation from "./pages/CancelConfirmation";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/searchbymovie/:id/:date" element={<SearchByMovie />} />
      <Route path="/searchbytheatre/:id/:date" element={<SearchByTheatre />} />
      <Route path="/seatselection/:id" element={<SeatSelection />} />
      <Route path="/getReservation" element={<GetReservation />} />
      <Route
        path="/managereservation/:id/:email"
        element={<ManageReservation />}
      />
      <Route path="/admin" element={<Admin />} />
      <Route path="/confirmtickets" element={<ConfirmTickets />} />
      <Route path="/register" element={<Register />} />
      <Route path="/checkbalance" element={<CheckBalance />} />
      <Route
        path="/bookingconfirmation/:id/:email"
        element={<BookingConfirmation />}
      />
      <Route path="/signedinpurchase/:email" element={<SignedInPurchase />} />
      <Route
        path="/cancellation-confirmed/:email/:reservationId"
        element={<CancelConfirmation />}
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;

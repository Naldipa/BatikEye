import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PWAPrompt from "./components/PWAPrompt";

export default function App() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />{" "}
        {/* Ini akan menampilkan halaman seperti Home, Gallery, dll */}
      </main>
      <Footer />
      <PWAPrompt />
    </div>
  );
}

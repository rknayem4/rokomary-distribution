import Footer from "@/Components/Footer";
import Navbar from "@/Components/Navber";

export default function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
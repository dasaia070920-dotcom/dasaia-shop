import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Categories from "../components/Categories";
import Products from "../components/Products";
import Features from "../components/Features";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Categories />
      <Products />
      <Features />
      <Footer />
    </main>
  );
}
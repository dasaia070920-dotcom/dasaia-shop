import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Categories from "./components/Categories";
import Products from "./components/Products";
import Features from "./components/Features";
import Testimonials from "./components/Testimonials";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="bg-[#faf9f7]">
        <Hero />

        <div className="mx-auto max-w-7xl">
          <Categories />
          <Products />
          <Features />
          <Testimonials />
        </div>
      </main>

      <Footer />
    </>
  );
}
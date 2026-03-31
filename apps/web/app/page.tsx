import Image from 'next/image'
import Header from "./components/Header";
import Hero from "./components/Hero";

export default function Home() {
  return (
    <main className="relative min-h-screen ">
      <div className="absolute inset-0 z-0">
        <Image 
          src="/hero-chart.png"
          alt='home page background'
          fill 
          className='object-cover opacity-20 blur-[1px]'
          priority
           />

      </div>
      <div className='relative z-10'>
        <Header></Header>
        <Hero></Hero>
      </div>
      
    </main>
  );
}

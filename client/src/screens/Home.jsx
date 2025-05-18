import React from "react";
import Header from "../components/home/Header";
import { AuroraHero } from "../components/home/Hero";

const Home = () => {
  return (
    <>
      <div className="bg-[#000002] min-h-screen flex flex-col items-center justify-center">
        <Header />
        <AuroraHero />
      </div>
    </>
  );
};

export default Home;

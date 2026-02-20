import React from "react";
import Footer from "../components/Footer";

function Home() {
  return (
    <>
      <header
        className="hero min-h-screen w-full z-10"
        style={{
          backgroundImage:
            "url(https://img.daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.webp)",
        }}
      >
        <div className="hero-overlay backdrop-blur-xs"></div>
        <div className="hero-content text-left w-full">
          <div className="absolute left-15 max-w-2xl bg-black/30 rounded-2xl h-[60%] flex flex-col justify-center items-start p-10 bg-clip-padding backdrop-filter backdrop-blur-sm shadow-black shadow-[0px_0px_20px]">
            <h1 className="mb-5 text-[4em] font-bold">
              This is Open Church Management
            </h1>
            <p className="mb-5 text-2xl">
              Powered by Mavuno Church. <br />
              Manage your church members, leadership and various
              groups and communities.

            </p>
            <a className="btn bg-orange-600 hover:bg-[#fffffc] hover:text-orange-600 hover:border-2 hover:border-orange-600 btn-lg">Get Started</a>
          </div>
        </div>
      </header>
      <main className="h-screen bg-[#fffffc] flex flex-col justify-center items-center">
        <h2>

        </h2>
      </main>
      <Footer />
    </>
  );
}

export default Home;

import React from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

function Home() {
  return (
    <>
      <Navbar />
      <header
        className="relative hero min-h-screen w-full z-20"
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
              Manage your church members, leadership and various groups and
              communities.
            </p>
            <a className="btn bg-orange-600 hover:bg-[#fffffc] hover:text-orange-600 hover:border-2 hover:border-orange-600 btn-lg">
              Get Started
            </a>
          </div>
        </div>
      </header>
      <main className="h-screen bg-[#fffffc] flex flex-col text-black p-15">
        <h2 className="text-6xl font-semibold underline underline-offset-2">
          About Open Church Management
        </h2>
        <p className="w-[70vw] text-2xl my-5">
          Open Church Management is a free and open source software tool made to
          fit the management and communication needs of churches. It is built to
          be flexible and scalable for any church and the technologies used
          allow for bespoke customisation for particular church needs.
        </p>
        <div className="grid grid-cols-3 gap-5 w-full h-full">
          <div className="card card-border h-full bg-ivory col-span-1 shadow-xl">
            <div className="card-body">
              <h2 className="text-3xl m-5">Features:</h2>
              <p className="m-5">
                <span className="text-lg font-semibold">1. Role Based Access</span> <br />

Using role based access members of the church can use the application based on their views with pastors and leaders being able to manage the data of the members
<br />
<span className="text-lg font-semibold">2. Member Groups:</span> <br />

Members are organised into groups such as serving teams, discipleship groups and age groups and have linked data
<br />
<span className="text-lg font-semibold">3. Robust Dashboards</span> <br />

Robust Dashboards for data visualisation and control for every role
<br />
<span className="text-lg font-semibold"> 4. Messaging Board</span> <br />

A simple messaging board/forum for important communication
<br />
<span className="text-lg font-semibold">5. Comm Channels</span> <br />

A Page for individual groups to communicate


              </p>
              <div className="card-actions justify-end">
              </div>
            </div>
          </div>
          <div className="card card-border h-full bg-ivory col-span-1 shadow-xl">
            <div className="card-body">
              <h2 className="text-3xl m-5">Technologies used</h2>
              <p className="m-5">
                The project is built with Django and Python, using HTML and Tailwind CSS for the frontend, PostgreSQL for the database, and Cloudinary for media storage.
                <br />
                 Key dependencies include django-registration for user management, django-tailwind and django_browser_reload for frontend workflow, djangorestframework and django-filter for API handling, django-taggit for content tagging, and djangorestframework-simplejwt for JWT authentication, along with tools like psycopg2, python-decouple, and markdown to support database connectivity, configuration, and content formatting.
              </p>
              <div className="card-actions justify-end">
              </div>
            </div>
          </div>
          <div className="card card-border h-full bg-ivory col-span-1 shadow-xl">
            <div className="card-body">
              <h2 className="text-3xl m-5">Target denominations</h2>
              <p className="text-lg m-5">
               Open Church Management is currently designed to accommodate data for low church, non rigid, loose hierarchy churches such as baptist, other denominations can attempt to use it as well, however more bespoke updates may be necessary to fit the denomination's specific needs.

              </p>
              <div className="card-actions justify-end">
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Home;

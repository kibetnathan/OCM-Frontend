import React from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import useAuthStore from "../zustand/authStore";
function Home() {
  const user = useAuthStore((state) => state.user)
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
          <div className="absolute left-15 max-w-2xl bg-black/30 h-[60%] flex flex-col justify-center items-start p-10 bg-clip-padding backdrop-filter backdrop-blur-sm shadow-black shadow-[0px_0px_20px]">
            <span className="text-sm text-amber-600 font-coptic">
              --Powered by Mavuno Church
            </span>
            <h1 className="mb-5 text-[4em] font-cormorant font-light text-ivory">
              This is <span />
              <span className="text-amber-600 italic font-bold">
                 Open Church Management
              </span>
            </h1>
            <p className="mb-5 text-lg text-ivory font-coptic">
              <br />
              Manage your church members, leadership and various groups and
              communities.
            </p>
            <Link to={user ? "/feed" : "/login"} className="btn text-black rounded-none border-0 bg-amber-600 hover:bg-light hover:text-amber-600 hover:border-2 hover:border-amber-600 btn-lg font-medium tracking-widest">
              GET STARTED
            </Link>
          </div>
        </div>
      </header>
      <main className="min-h-screen bg-light flex flex-col text-black p-15 gap-y-15">
        <div className="flex flex-row w-full">
          <div className="flex flex-col gap-5 w-[70%]">
            <h4 className="text-lg font-semibold underline underline-offset-2 text-neutral-400 col-span-1 row-span-1">
              ABOUT OPEN CHURCH MANAGEMENT
            </h4>
            <h3 className="text-6xl font-cormorant w-[40vw] col-span-1 row-span-1">
              Free And Open Source For Churches
            </h3>
          </div>
          <p className="w-[70vw] text-xl my-5 font-coptic col-span-2 row-span-2">
            Built to be flexible and scalable for any church and the
            technologies used allow for bespoke customisation for particular
            church needs.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-5 w-full h-full">
          <div className="card h-full rounded-0 bg-ivory col-span-1 shadow-xl">
            <div className="card-body">
              <h2 className="text-4xl m-4 font-cormorant">Features:</h2>
              <p className="font-coptic">
                <span className="text-xl text-amber-600 font-cormorant font-light mb-3">
                  1. Role Based Access
                </span>
                <br />
                Using role based access members of the church can use the
                application based on their views with pastors and leaders being
                able to manage the data of the members
                <br />
              </p>
              <p className="font-coptic">
                <span className="text-xl text-amber-600 font-cormorant font-light my-3">
                  2. Member Groups:
                </span>
                <br />
                Members are organised into groups such as serving teams,
                discipleship groups and age groups and have linked data
                <br />
              </p>
              <p className="font-coptic">
                <span className="text-xl text-amber-600 font-cormorant font-light my-3">
                  3. Robust Dashboards
                </span>
                <br />
                Robust Dashboards for data visualisation and control for every
                role
                <br />
              </p>
              <p className="font-coptic">
                <span className="text-xl text-amber-600 font-cormorant font-light my-3">
                  4. Messaging Board
                </span>
                <br />
                A simple messaging board/forum for important communication
                <br />
              </p>
              <p className="font-coptic">
                <span className="text-xl text-amber-600 font-cormorant font-light my-3">
                  5. Communication Channels
                </span>
                <br />A Page for individual groups to communicate
              </p>
              <div className="card-actions justify-end"></div>
            </div>
          </div>
          <div className="card rounded-0 h-full bg-ivory col-span-1 shadow-xl">
            <div className="card-body flex flex-col">
              <h2 className="text-4xl m-4 font-cormorant">Technologies Used</h2>
              <p className="m-5 font-coptic space-y-3">
                <span className="text-xl text-amber-600 font-cormorant font-light">
                  Backend:
                </span>
                Django & Python for server-side logic and API handling.
                <br />
                <span className="text-xl text-amber-600 font-cormorant font-light">
                  Frontend:
                </span>
                HTML & Tailwind CSS for responsive design.
                <br />
                <span className="text-xl text-amber-600 font-cormorant font-light">
                  Database:
                </span>
                PostgreSQL for data persistence.
                <br />
                <span className="text-xl text-amber-600 font-cormorant font-light">
                  Media Storage:
                </span>
                Cloudinary.
                <br />
                <span className="text-xl text-amber-600 font-cormorant font-light">
                  Key Dependencies:
                </span>
              </p>
              <div className="flex flex-wrap m-5 gap-2 mt-auto">
                {[
                  "Django",
                  "Python",
                  "HTML",
                  "Tailwind CSS",
                  "PostgreSQL",
                  "Cloudinary",
                  "django-registration",
                  "django-tailwind",
                  "django_browser_reload",
                  "djangorestframework",
                  "django-filter",
                  "django-taggit",
                  "djangorestframework-simplejwt",
                  "psycopg2",
                  "python-decouple",
                  "markdown",
                ].map((tech) => (
                  <span
                    key={tech}
                    className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-cormorant"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="card rounded-0 h-full bg-ivory col-span-1 shadow-xl">
            <div className="card-body flex flex-col">
              <h2 className="text-4xl m-4 font-cormorant">
                Target Denominations
              </h2>
              <p className="m-5 font-coptic text-lg space-y-3">
                Open Church Management is primarily designed for <b className="font-semibold text-amber-800">low-church </b>,
                non-rigid, loosely hierarchical congregations, such as <b className="font-semibold text-amber-800">Baptist </b>
                churches.
                <br />
                Other denominations can use the platform, but additional
                customizations may be needed to fully adapt to their specific
                organizational structures and workflows.
              </p>
              <div className="flex flex-wrap m-5 gap-2 mt-auto">
                {[
                  "Low-Church",
                  "Baptist",
                  "Flexible Denominations",
                  "Customizable",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-cormorant"
                  >
                    {tag}
                  </span>
                ))}
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

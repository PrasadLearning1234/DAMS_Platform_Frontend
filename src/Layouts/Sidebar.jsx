import { useLocation, useNavigate, NavLink } from "react-router-dom";
import React, { useState, useEffect } from "react";
import "./css/sidebar.css";
import { HiOutlineUser } from "react-icons/hi";
import { MdHistory } from "react-icons/md";
import { FiBookmark } from "react-icons/fi";
import { BiBookOpen, BiFontFamily } from "react-icons/bi";
import { BiGridAlt } from "react-icons/bi";
import { BiListUl } from "react-icons/bi";
import { BiSearchAlt2 } from "react-icons/bi";
import { BiEdit } from "react-icons/bi";
import { IoMdSettings } from "react-icons/io";

import { BsDatabaseGear } from "react-icons/bs";

//Navbar
import "./navbar.css";
import Navbar from "./Navbar.jsx";

const Sidebar = () => {
  const [displayusername, displayusernameupdate] = useState("");
  const [showmenu, showmenuupdateupdate] = useState(false);
  const usenavigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(prev=> !prev);

  const [userrole, setUserrole] = useState();

  useEffect(() => {
    if (
      location.pathname === "/" ||
      location.pathname === "/Login" ||
      location.pathname === "/Idam" ||
      location.pathname === "/register" ||
      location.pathname === "/reset" ||
      location.pathname === "/Otp" ||
      location.pathname === "/ConfirmPassword" ||
      location.pathname === "/Navbar"
    ) {
      showmenuupdateupdate(false);
    } else {
      showmenuupdateupdate(true);
      let userrole = sessionStorage.getItem("userrole");
      if (userrole === "" || userrole === null) {
        usenavigate("/");
      } else {
        displayusernameupdate(userrole);
      }
    }
    setUserrole(sessionStorage.getItem("userrole"));
  }, [location]);

  //   this is for admin
  const menuItem = [
    {
      path: "/dashboardMain",
      name: "Document management",
      tooltip: "Document management",
      icon: <BiGridAlt />,
    },
    {
      path: "/financialDocument",
      name: "TOC view",
      tooltip: "Financial manuals",
      icon: <BiListUl />,
    },
    // {
    //   path: "/notesView",
    //   name: "Notes",
    //   tooltip: "Notes",
    //   icon: <BiEdit/>,
    // },
    {
      path: "/sectionSearch",
      name: "Search document",
      tooltip: "Search document",
      icon: <BiSearchAlt2 />,
    },
    {
      path: "/configMain",
      name: "Configuration",
      tooltip: "Configuration",
      icon: <BsDatabaseGear />,
      // icon: "src/Assets/icons/configurationsvgicon.svg",
      // icon: <IoMdSettings />,
    },
    {
      path: "/history",
      name: "Audit history",
      tooltip: "Audit history",
      icon: <MdHistory />,
    },

    {
      path: "/role",
      name: "User management",
      tooltip: "User management",
      icon: <HiOutlineUser />,
    },
  ];

  //   this is for reviewer
  const menuItem1 = [
    {
      path: "/reviewermain",
      name: "Review document",
      tooltip: "Review document",
      icon: <BiGridAlt />,
    },
    {
      path: "/financialDocument",
      name: "Financial manuals",
      tooltip: "Financial manuals",
      icon: <BiListUl />,
    },
    // {
    //   path: "/notesView",
    //   name: "Notes",
    //   tooltip: "Notes",
    //   icon: <BiEdit/>,
    // },

    {
      path: "/ReviewerSearch",
      name: "Search document",
      tooltip: "Search document",
      icon: <BiSearchAlt2 />,
    },

    {
      path: "/history",
      name: "Audit history",
      tooltip: "Audit history",
      icon: <MdHistory />,
    },
  ];

  //   this is for viewer
  const menuItem2 = [
    {
      path: "/bookmarkdoc",
      name: "Bookmark",
      tooltip: "Bookmark",
      icon: <FiBookmark />,
    },
    {
      path: "/financialDocument",
      name: "Financial manuals",
      tooltip: "Financial manuals",
      icon: <BiListUl />,
    },
    // {
    //   path: "/notesView",
    //   name: "Notes",
    //   tooltip: "Notes",
    //   icon: <BiEdit/>,
    // },

    {
      path: "/usersearch",
      name: "Search document",
      tooltip: "Search document",
      icon: <BiSearchAlt2 />,
    },
  ];

  if (userrole === "Admin") {
    return (
      <>
        <Navbar />
        <div>
          {showmenu && (
            <div
              style={{ width: isOpen ? "210px" : "50px" }}
              className="sidebar"
            >
              <div className="top_section">
                <div>
                  {isOpen ? (
                    // Render the icon for collapsing

                    <i
                      title="Collapse"
                      style={{
                        marginLeft: "90px",
                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                        top: "41rem",
                      }}
                      onClick={toggle}
                      id="bars"
                      className="pi pi-sign-in"
                    >
                      <span
                        style={{
                          marginTop:'0.2rem',
                          marginLeft: "1rem",
                          marginRight:'-1rem',
                          position: "fix",
                          transform: isOpen ? "rotate(-180deg)" : "rotate(0deg)",
                         
                        }}
                        className="collapseLable"
                      >
                        Collapse
                      </span>
                    </i>
                  ) : (
                    // <span style={{ marginLeft: "5px" }}>Collapse</span>
                    // Render the icon for expanding
                    <i
                      title="Expand"
                      style={{ marginLeft: "5px" }}
                      onClick={toggle}
                      className="pi pi-sign-out"
                      id="bars"
                    ></i>
                    // <span style={{ marginLeft: "5px" }}>Expand</span>
                  )}
                </div>
              </div>

              <div className="paths">
                <NavLink to={"/dashboardMain"} className="link">
                  <div  className="tooltip">
                    <div className="icons" activeclassName="active">
                      <svg
                        width="25px"
                        height="25px"
                        viewBox="-5 3 35 25"
                        className="highlight"
                      >
                        <g
                          id="Icon/Outline/grid-view-outline"
                          stroke="none"
                          stroke-width="1"
                          fill="none"
                          fill-rule="evenodd"
                        >
                          <g
                            id="Group"
                            transform="translate(-0.000000, -0.000000)"
                            fill="#474747"
                            fill-rule="nonzero"
                          >
                            <g id="grid-view">
                              <path
                                d="M0,10.5 L0,0 L10.5,0 L10.5,10.5 L0,10.5 Z M1.50000001,9.00000001 L9.00000001,9.00000001 L9.00000001,1.50000001 L1.50000001,1.50000001 L1.50000001,9.00000001 Z M13.5000001,10.5 L13.5000001,0 L24.0000001,0 L24.0000001,10.5 L13.5000001,10.5 Z M15.0000001,9.00000001 L22.5000001,9.00000001 L22.5000001,1.50000001 L15.0000001,1.50000001 L15.0000001,9.00000001 Z M0,24.0000001 L0,13.5000001 L10.5,13.5000001 L10.5,24.0000001 L0,24.0000001 Z M1.50000001,22.5000001 L9.00000001,22.5000001 L9.00000001,15.0000001 L1.50000001,15.0000001 L1.50000001,22.5000001 Z M13.5000001,24.0000001 L13.5000001,13.5000001 L24.0000001,13.5000001 L24.0000001,24.0000001 L13.5000001,24.0000001 Z M15.0000001,22.5000001 L22.5000001,22.5000001 L22.5000001,15.0000001 L15.0000001,15.0000001 L15.0000001,22.5000001 Z"
                                id="Combined-Shape"
                              ></path>
                            </g>
                          </g>
                        </g>
                      </svg>
                    </div>
                    <span className="tooltiptext">Document management</span>
                  </div>
                  <div
                    onClick={toggle}
                    style={{ display: isOpen ? "block" : "none" }}
                    className="link_text"
                  >
                    Document management
                  </div>
                </NavLink>
              </div>
              <div className="paths">
                <NavLink to={"/financialDocument"} className="link">
                  <div  className="tooltip">
                    <div className="icons" activeclassName="active">
                      <svg
                        width="25px"
                        height="25px"
                        viewBox="-5 3 35 25"
                        className="highlight"
                      >
                        <g
                          id="Icon/Outline/list-view-outline"
                          stroke="none"
                          stroke-width="1"
                          fill="none"
                          fill-rule="evenodd"
                        >
                          <g
                            id="Group"
                            transform="translate(-0.000000, 5.250000)"
                            fill="#474747"
                            fill-rule="nonzero"
                          >
                            <g id="list-view">
                              <path
                                d="M3.00000001,7.50000002 L3.00000001,6.00000002 L24,6.00000002 L24,7.50000002 L3.00000001,7.50000002 Z M3.00000001,1.5 L3.00000001,0 L24,0 L24,1.5 L3.00000001,1.5 Z M3.00000001,13.5000001 L3.00000001,12.0000001 L24,12.0000001 L24,13.5000001 L3.00000001,13.5000001 Z M0,7.50000002 L0,6.00000002 L1.5,6.00000002 L1.5,7.50000002 L0,7.50000002 Z M0,1.5 L0,0 L1.5,0 L1.5,1.5 L0,1.5 Z M0,13.5000001 L0,12.0000001 L1.5,12.0000001 L1.5,13.5000001 L0,13.5000001 Z"
                                id="Combined-Shape"
                              ></path>
                            </g>
                          </g>
                        </g>
                      </svg>
                    </div>
                    <span className="tooltiptext">Financial manuals</span>
                  </div>
                  <div
                    onClick={toggle}
                    style={{ display: isOpen ? "block" : "none" }}
                    className="link_text"
                  >
                    Financial manuals
                  </div>
                </NavLink>
              </div>
              <div className="paths">
                <NavLink to={"/search"} className="link">
                  <div className="tooltip">
                    <div className="icons" activeclassName="active">
                      <svg
                        width="25px"
                        height="25px"
                        viewBox="-5 3 35 25"
                        className="highlight"
                      >
                        <g
                          id="Icon/Outline/search-outline"
                          stroke="none"
                          stroke-width="1"
                          fill="none"
                          fill-rule="evenodd"
                        >
                          <g
                            id="Group"
                            transform="translate(-0.000000, -0.000000)"
                            fill="#474747"
                            fill-rule="nonzero"
                          >
                            <g
                              id="search"
                              transform="translate(0.000000, 0.000000)"
                            >
                              <path
                                d="M15.8767808,14.8063228 L24,22.9295421 L22.9295421,24 L14.8063228,15.8767808 C13.2390428,17.201437 11.2127786,18 9,18 C4.02943727,18 0,13.9705628 0,9 C0,4.02943727 4.02943727,0 9,0 C13.9705628,0 18,4.02943727 18,9 C18,11.2127786 17.201437,13.2390428 15.8767808,14.8063228 Z M9.0138562,16.5138562 C13.1559919,16.5138562 16.5138562,13.1559919 16.5138562,9.0138562 C16.5138562,4.87172059 13.1559919,1.5138562 9.0138562,1.5138562 C4.87172059,1.5138562 1.5138562,4.87172059 1.5138562,9.0138562 C1.5138562,13.1559919 4.87172059,16.5138562 9.0138562,16.5138562 Z"
                                id="Combined-Shape"
                              ></path>
                            </g>
                          </g>
                        </g>
                      </svg>
                    </div>
                    <span className="tooltiptext">Search document</span>
                  </div>
                  <div
                    onClick={toggle}
                    style={{ display: isOpen ? "block" : "none" }}
                    className="link_text"
                  >
                    Search document
                  </div>
                </NavLink>
              </div>
              <div className="paths">
                <NavLink to={"/configMain"} className="link">
                  <div  className="tooltip">
                    <div className="icons" activeclassName="active">
                      <svg
                        width="22"
                        height="22"
                        viewBox="-1 6 35 25"
                        className="highlight"
                      >
                        <g
                          id="Group"
                          stroke="none"
                          stroke-width="1"
                          fill="none"
                          fill-rule="evenodd"
                        >
                          <g
                            id="Outline"
                            transform="translate(-0.000000, -0.000000)"
                            fill="#474747"
                            fill-rule="nonzero"
                          >
                            <path
                              id="Shape"
                              d="M10.559,0V10.283a11.619,11.619,0,0,0-7.332,3.194A11,11,0,0,0,11,32.258a10.9,10.9,0,0,0,7.778-3.149,11.606,11.606,0,0,0,3.194-7.265h3.311L32.345,14l.05-.054V0ZM29.9,14.116l-4.377,5.353V14.116ZM30.73,1.673V12.879H23.848v7.3H21.958A11.314,11.314,0,0,0,18.9,13.432a11.466,11.466,0,0,0-6.685-3.1V1.673ZM17.55,27.827a9.2,9.2,0,1,1,2.74-6.552A9.271,9.271,0,0,1,17.55,27.827Z"
                            />
                            <path
                              id="Shape-2"
                              data-name="Shape"
                              d="M14.535,20.869c.085-.148.2-.265.279-.414s.14-.265.225-.409l1.732-.391.076-3.95-1.723-.45a7.379,7.379,0,0,0-.45-.832l.54-1.7L11.8,10.662l-1.278,1.282a5.21,5.21,0,0,0-.954,0l-1.224-1.35L4.882,12.5l.472,1.723c-.085.148-.2.27-.283.414l-.22.414-1.732.387-.081,3.95,1.754.468a6.954,6.954,0,0,0,.45.828l-.5,1.727L8.12,24.445,9.4,23.168a5.259,5.259,0,0,0,.958,0l1.219,1.35,3.468-1.912Zm-5.182.5-.639-.045-.9.9-1.03-.639.378-1.228-.36-.517a3.455,3.455,0,0,1-.486-.855L6.1,18.382l-1.26-.346.031-1.219,1.269-.27.279-.589a1.271,1.271,0,0,1,.247-.45c.085-.148.171-.234.283-.414l.423-.5-.333-1.264L8.1,12.749l.9.967.634-.076a4.042,4.042,0,0,1,1.017,0l.639.1.936-.922,1.03.643L12.889,14.7l.36.513a4.306,4.306,0,0,1,.486.859l.216.6,1.255.346-.027,1.219-1.39.265-.279.589a1.117,1.117,0,0,1-.247.45c-.059.117-.171.234-.283.414l-.423.5.333,1.264-1,.571-.9-.963-.643.09a2.935,2.935,0,0,1-.99-.05Zm-1.7-3.27a2.249,2.249,0,0,0,.666,1.147,1.987,1.987,0,0,0,.382.31,2.375,2.375,0,1,0,2.456-4.049,2.249,2.249,0,0,0-1.777-.274A2.523,2.523,0,0,0,7.9,16.317a2.438,2.438,0,0,0-.243,1.8m2.11-1.385a.733.733,0,0,1,.643.1l.117.112a.828.828,0,0,1,.144,1.039.818.818,0,0,1-.517.364.724.724,0,0,1-.639-.1.814.814,0,0,1-.288-1.125.9.9,0,0,1,.54-.391"
                              transform="translate(1.062 3.706)"
                            />
                          </g>
                        </g>
                      </svg>
                    </div>
                    <span className="tooltiptext">Configuration</span>
                  </div>
                  <div
                    onClick={toggle}
                    style={{ display: isOpen ? "block" : "none" }}
                    className="link_text"
                  >
                    Configuration
                  </div>
                </NavLink>
              </div>
              <div className="paths">
                <NavLink to={"/history"} className="link">
                  <div  className="tooltip">
                    <div className="icons" activeclassName="active">
                      <svg
                        width="25px"
                        height="25px"
                        viewBox="-5 3 35 25"
                        fill="#1b1b1b"
                        xmlns="http://www.w3.org/2000/svg"
                        className="highlight"
                      >
                        <g
                          transform="translate(-0.000000, -0.000000)"
                          fill="#474747"
                          fill-rule="nonzero"
                        >
                          <path d="M7.38902 9.39167H2.80569L6.69236 5.50168C10.2724 1.91834 16.0957 1.91834 19.6757 5.50168C23.2557 9.08501 23.2557 14.9183 19.6757 18.5017C16.0957 22.085 10.2724 22.085 6.69236 18.5017L5.52902 19.665C9.74902 23.8917 16.6157 23.8917 20.8357 19.665C25.0557 15.4383 25.0557 8.56167 20.8357 4.33501C16.6157 0.108342 9.74902 0.108342 5.52902 4.33501L1.64236 8.22501V3.63501C1.64236 3.18168 1.27569 2.81168 0.819023 2.81168C0.36569 2.81501 -0.000976562 3.18168 -0.000976562 3.63834V11.0383H7.38902C7.84236 11.0383 8.20902 10.6683 8.20902 10.215C8.20902 9.98834 8.11569 9.78167 7.96902 9.63167C7.81902 9.48167 7.61569 9.39167 7.38902 9.39167ZM13.2424 7.57834L13.209 12.5917L17.5857 15.0917L16.8424 16.395L11.7024 13.4583L11.7424 7.56501L13.2424 7.57501V7.57834Z" />
                        </g>
                        <defs>
                          <clipPath id="clip0_15805_64228">
                            <rect width="24" height="24" />
                          </clipPath>
                        </defs>
                      </svg>
                    </div>
                    <span className="tooltiptext">Audit history</span>
                  </div>
                  <div
                    onClick={toggle}
                    style={{ display: isOpen ? "block" : "none" }}
                    className="link_text"
                  >
                    Audit history
                  </div>
                </NavLink>
              </div>
              <div className="paths">
                <NavLink to={"/role"} className="link">
                  <div  className="tooltip">
                    <div className="icons" activeclassName="active">
                      <svg
                        width="20px"
                        height="20px"
                        viewBox="0 0 24 24"
                        className="highlight"
                      >
                        <g
                          id="Icon/Outline/person-outline"
                          stroke="none"
                          stroke-width="1"
                          fill="none"
                          fill-rule="evenodd"
                        >
                          <g
                            id="Group"
                            transform="translate(-0.000000, -0.000000)"
                            fill="#474747"
                            fill-rule="nonzero"
                          >
                            <g
                              id="person"
                              transform="translate(0.000000, 1.500000)"
                            >
                              <path
                                d="M12.000282,12 C17.1072262,12 21.515178,14.1059002 23.5661556,17.1501514 C24.627144,18.7239032 23.619155,21 21.8731741,21 L2.12638988,21 C0.380408953,21 -0.626580043,18.7239032 0.433408374,17.1501514 C2.48438596,14.1059002 6.89333778,12 12.000282,12 Z M12.000282,13.5 C7.4756231,13.5 3.47799925,15.3156787 1.67752176,17.9881143 C1.25631327,18.6134774 1.64704233,19.5 2.12638988,19.5 L21.8731741,19.5 C22.3528661,19.5 22.7437035,18.6135598 22.3221455,17.9882677 C20.5214453,15.3155014 16.5247121,13.5 12.000282,13.5 Z M11.6260549,9.00092328 C9.14062203,9.00092328 7.1260549,6.98635623 7.1260549,4.5 C7.1260549,2.01456709 9.14062203,0 11.6260549,0 C14.1114878,0 16.1260549,2.01456709 16.1260549,4.5 C16.1260549,6.98635623 14.1114878,9.00092328 11.6260549,9.00092328 Z M11.6260658,1.50001087 C9.97135324,1.50001087 8.62606578,2.84618751 8.62606578,4.50001087 C8.62606578,6.15472337 9.97135324,7.50090003 11.6260658,7.50090003 C13.2807783,7.50090003 14.6260658,6.15472337 14.6260658,4.50001087 C14.6260658,2.84618751 13.2807783,1.50001087 11.6260658,1.50001087 Z"
                                id="Combined-Shape"
                              ></path>
                            </g>
                          </g>
                        </g>
                      </svg>
                    </div>
                    <span className="tooltiptext">User management</span>
                  </div>
                  <div
                    onClick={toggle}
                    style={{ display: isOpen ? "block" : "none" }}
                    className="link_text"
                  >
                    User management
                  </div>
                </NavLink>
              </div>
            </div>
          )}
        </div>
      </>
    );
  }
  if (userrole === "Reviewer") {
    return (
      <>
        <Navbar />

        <div>
          {showmenu && (
            <div
              style={{ width: isOpen ? "200px" : "50px" }}
              className="sidebar"
            >
                <div className="top_section">
                <div>
                  {isOpen ? (
                    // Render the icon for collapsing

                    <i
                      title="Collapse"
                      style={{
                        marginLeft: "90px",
                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                        top: "41rem",
                      }}
                      onClick={toggle}
                      id="bars"
                      className="pi pi-sign-in"
                    >
                      <span
                        style={{
                          marginTop:'0.2rem',
                          marginLeft: "1rem",
                          marginRight:'-1rem',
                          position: "fix",
                          transform: isOpen ? "rotate(-180deg)" : "rotate(0deg)",
                         
                        }}
                        className="collapseLable"
                      >
                        Collapse
                      </span>
                    </i>
                  ) : (
                    // <span style={{ marginLeft: "5px" }}>Collapse</span>
                    // Render the icon for expanding
                    <i
                      title="Expand"
                      style={{ marginLeft: "5px" }}
                      onClick={toggle}
                      className="pi pi-sign-out"
                      id="bars"
                    ></i>
                    // <span style={{ marginLeft: "5px" }}>Expand</span>
                  )}
                </div>
              </div>
              <div>
                <div className="paths">
                  <NavLink to={"/reviewermain"} className="link">
                    <div  className="tooltip">
                      <div className="icons" activeclassName="active">
                        <svg
                          width="25px"
                          height="25px"
                          viewBox="-5 3 35 25"
                          className="highlight"
                        >
                          <g
                            id="Icon/Outline/grid-view-outline"
                            stroke="none"
                            stroke-width="1"
                            fill="none"
                            fill-rule="evenodd"
                          >
                            <g
                              id="Group"
                              transform="translate(-0.000000, -0.000000)"
                              fill="#474747"
                              fill-rule="nonzero"
                            >
                              <g id="grid-view">
                                <path
                                  d="M0,10.5 L0,0 L10.5,0 L10.5,10.5 L0,10.5 Z M1.50000001,9.00000001 L9.00000001,9.00000001 L9.00000001,1.50000001 L1.50000001,1.50000001 L1.50000001,9.00000001 Z M13.5000001,10.5 L13.5000001,0 L24.0000001,0 L24.0000001,10.5 L13.5000001,10.5 Z M15.0000001,9.00000001 L22.5000001,9.00000001 L22.5000001,1.50000001 L15.0000001,1.50000001 L15.0000001,9.00000001 Z M0,24.0000001 L0,13.5000001 L10.5,13.5000001 L10.5,24.0000001 L0,24.0000001 Z M1.50000001,22.5000001 L9.00000001,22.5000001 L9.00000001,15.0000001 L1.50000001,15.0000001 L1.50000001,22.5000001 Z M13.5000001,24.0000001 L13.5000001,13.5000001 L24.0000001,13.5000001 L24.0000001,24.0000001 L13.5000001,24.0000001 Z M15.0000001,22.5000001 L22.5000001,22.5000001 L22.5000001,15.0000001 L15.0000001,15.0000001 L15.0000001,22.5000001 Z"
                                  id="Combined-Shape"
                                ></path>
                              </g>
                            </g>
                          </g>
                        </svg>
                      </div>
                      <span className="tooltiptext">Review document</span>
                    </div>
                    <div
                      onClick={toggle}
                      style={{ display: isOpen ? "block" : "none" }}
                      className="link_text"
                    >
                      Review document
                    </div>
                  </NavLink>
                </div>
                <div className="paths">
                  <NavLink to={"/financialDocument"} className="link">
                    <div  className="tooltip">
                      <div className="icons" activeclassName="active">
                        <svg
                          width="25px"
                          height="25px"
                          viewBox="-5 3 35 25"
                          className="highlight"
                        >
                          <g
                            id="Icon/Outline/list-view-outline"
                            stroke="none"
                            stroke-width="1"
                            fill="none"
                            fill-rule="evenodd"
                          >
                            <g
                              id="Group"
                              transform="translate(-0.000000, 5.250000)"
                              fill="#474747"
                              fill-rule="nonzero"
                            >
                              <g id="list-view">
                                <path
                                  d="M3.00000001,7.50000002 L3.00000001,6.00000002 L24,6.00000002 L24,7.50000002 L3.00000001,7.50000002 Z M3.00000001,1.5 L3.00000001,0 L24,0 L24,1.5 L3.00000001,1.5 Z M3.00000001,13.5000001 L3.00000001,12.0000001 L24,12.0000001 L24,13.5000001 L3.00000001,13.5000001 Z M0,7.50000002 L0,6.00000002 L1.5,6.00000002 L1.5,7.50000002 L0,7.50000002 Z M0,1.5 L0,0 L1.5,0 L1.5,1.5 L0,1.5 Z M0,13.5000001 L0,12.0000001 L1.5,12.0000001 L1.5,13.5000001 L0,13.5000001 Z"
                                  id="Combined-Shape"
                                ></path>
                              </g>
                            </g>
                          </g>
                        </svg>
                      </div>
                      <span className="tooltiptext">Financial manuals</span>
                    </div>
                    <div
                      onClick={toggle}
                      style={{ display: isOpen ? "block" : "none" }}
                      className="link_text"
                    >
                      Financial manuals
                    </div>
                  </NavLink>
                </div>

                <div className="paths">
                  <NavLink to={"/search"} className="link">
                    <div  className="tooltip">
                      <div className="icons" activeclassName="active">
                        <svg
                          width="25px"
                          height="25px"
                          viewBox="-5 3 35 25"
                          className="highlight"
                        >
                          <g
                            id="Icon/Outline/search-outline"
                            stroke="none"
                            stroke-width="1"
                            fill="none"
                            fill-rule="evenodd"
                          >
                            <g
                              id="Group"
                              transform="translate(-0.000000, -0.000000)"
                              fill="#474747"
                              fill-rule="nonzero"
                            >
                              <g
                                id="search"
                                transform="translate(0.000000, 0.000000)"
                              >
                                <path
                                  d="M15.8767808,14.8063228 L24,22.9295421 L22.9295421,24 L14.8063228,15.8767808 C13.2390428,17.201437 11.2127786,18 9,18 C4.02943727,18 0,13.9705628 0,9 C0,4.02943727 4.02943727,0 9,0 C13.9705628,0 18,4.02943727 18,9 C18,11.2127786 17.201437,13.2390428 15.8767808,14.8063228 Z M9.0138562,16.5138562 C13.1559919,16.5138562 16.5138562,13.1559919 16.5138562,9.0138562 C16.5138562,4.87172059 13.1559919,1.5138562 9.0138562,1.5138562 C4.87172059,1.5138562 1.5138562,4.87172059 1.5138562,9.0138562 C1.5138562,13.1559919 4.87172059,16.5138562 9.0138562,16.5138562 Z"
                                  id="Combined-Shape"
                                ></path>
                              </g>
                            </g>
                          </g>
                        </svg>
                      </div>
                      <span className="tooltiptext">Search document</span>
                    </div>
                    <div
                      onClick={toggle}
                      style={{ display: isOpen ? "block" : "none" }}
                      className="link_text"
                    >
                      Search document
                    </div>
                  </NavLink>
                </div>

                <div className="paths">
                  <NavLink to={"/history"} className="link">
                    <div  className="tooltip">
                      <div className="icons" activeclassName="active">
                        <svg
                          width="25px"
                          height="25px"
                          viewBox="-5 3 35 25"
                          fill="#1b1b1b"
                          xmlns="http://www.w3.org/2000/svg"
                          className="highlight"
                        >
                          <g
                            transform="translate(-0.000000, -0.000000)"
                            fill="#474747"
                            fill-rule="nonzero"
                          >
                            <path d="M7.38902 9.39167H2.80569L6.69236 5.50168C10.2724 1.91834 16.0957 1.91834 19.6757 5.50168C23.2557 9.08501 23.2557 14.9183 19.6757 18.5017C16.0957 22.085 10.2724 22.085 6.69236 18.5017L5.52902 19.665C9.74902 23.8917 16.6157 23.8917 20.8357 19.665C25.0557 15.4383 25.0557 8.56167 20.8357 4.33501C16.6157 0.108342 9.74902 0.108342 5.52902 4.33501L1.64236 8.22501V3.63501C1.64236 3.18168 1.27569 2.81168 0.819023 2.81168C0.36569 2.81501 -0.000976562 3.18168 -0.000976562 3.63834V11.0383H7.38902C7.84236 11.0383 8.20902 10.6683 8.20902 10.215C8.20902 9.98834 8.11569 9.78167 7.96902 9.63167C7.81902 9.48167 7.61569 9.39167 7.38902 9.39167ZM13.2424 7.57834L13.209 12.5917L17.5857 15.0917L16.8424 16.395L11.7024 13.4583L11.7424 7.56501L13.2424 7.57501V7.57834Z" />
                          </g>
                          <defs>
                            <clipPath id="clip0_15805_64228">
                              <rect width="24" height="24" />
                            </clipPath>
                          </defs>
                        </svg>
                      </div>
                      <span className="tooltiptext">Audit history</span>
                    </div>
                    <div
                      onClick={toggle}
                      style={{ display: isOpen ? "block" : "none" }}
                      className="link_text"
                    >
                      Audit history
                    </div>
                  </NavLink>
                </div>
                {/* <div className="paths">
                  {menuItem1.map((item, index) => (
                    <NavLink to={item.path} key={index} className="link">
                      <div onClick={isOpen} className="tooltip">
                        <div className="icons" activeclassName="active">
                          {item.icon}
                        </div>

                        <span className="tooltiptext">{item.tooltip}</span>
                      </div>

                      <div
                        style={{ display: isOpen ? "block" : "none" }}
                        className="link_text"
                      >
                        {item.name}
                      </div>
                    </NavLink>
                  ))}
                </div> */}
              </div>
            </div>
          )}
        </div>
      </>
    );
  }

  if (userrole === "Viewer") {
    return (
      <>
        <Navbar />
        <div>
          {showmenu && (
            <div
              style={{ width: isOpen ? "200px" : "50px" }}
              className="sidebar"
            >
                <div className="top_section">
                <div>
                  {isOpen ? (
                    // Render the icon for collapsing

                    <i
                    
                      title="Collapse"
                      style={{
                        marginLeft: "90px",
                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                        top: "41rem",
                        transition:'all o.5s'
                      }}
                      onClick={toggle}
                      id="bars"
                      className="pi pi-sign-in"
                    >
                      <span
                    
                        style={{
                          marginTop:'0.2rem',
                          marginLeft: "1rem",
                          marginRight:'-1rem',
                          position: "fix",
                          transform: isOpen ? "rotate(-180deg)" : "rotate(0deg)",
                        }}
                        className="collapseLable"
                      >
                        Collapse
                      </span>
                    </i>
                  ) : (
                    // <span style={{ marginLeft: "5px" }}>Collapse</span>
                    // Render the icon for expanding
                    <i
                      title="Expand"
                      style={{ marginLeft: "5px" }}
                      onClick={toggle}
                      className="pi pi-sign-out"
                      id="bars"
                    ></i>
                    // <span style={{ marginLeft: "5px" }}>Expand</span>
                  )}
                </div>
              </div>

              <div className="paths">
                <NavLink to={"/bookmarkdoc"} className="link">
                  <div  className="tooltip">
                    <div className="icons" activeclassName="active">
                      <svg width="25px" height="25px" viewBox="-5 3 35 25">
                        <g
                          id="Icon/Outline/archive-alt-outline"
                          stroke="none"
                          stroke-width="1"
                          fill="none"
                          fill-rule="evenodd"
                          className="highlight"
                        >
                          <g
                            id="Group"
                            transform="translate(-0.000000, -0.000000)"
                            fill="#474747"
                            fill-rule="nonzero"
                          >
                            <g
                              id="archive"
                              transform="translate(3.000000, 0.000000)"
                            >
                              <path
                                d="M9,18.4186073 L0.600000002,24 C0.181242001,24 0,23.8604095 0,23.4418608 L0,1.67441783 C0,0.761162441 0.887901004,0 2.10000001,0 L15.9000001,0 C17.1121021,0 18,0.761162441 18,1.67441783 L18,23.4418608 C18,23.8604095 17.8187581,24 17.4000001,24 L9,18.4186073 Z M8.99999997,16.6176727 L16.5,21.6010591 L16.5,1.67441783 C16.5,1.64624026 16.3205968,1.50000001 15.9000001,1.50000001 L2.10000001,1.50000001 C1.67940495,1.50000001 1.49999997,1.64624152 1.49999997,1.67441783 L1.49999997,21.6010591 L8.99999997,16.6176727 Z"
                                id="Shape"
                              ></path>
                            </g>
                          </g>
                        </g>
                      </svg>
                    </div>
                    <span className="tooltiptext">Bookmark</span>
                  </div>
                  <div
                    onClick={toggle}
                    style={{ display: isOpen ? "block" : "none" }}
                    className="link_text"
                  >
                    Bookmark
                  </div>
                </NavLink>
              </div>

              <div className="paths">
                <NavLink to={"/financialDocument"} className="link">
                  <div  className="tooltip">
                    <div className="icons" activeclassName="active">
                      <svg
                        width="25px"
                        height="25px"
                        viewBox="-5 3 35 25"
                        className="highlight"
                      >
                        <g
                          id="Icon/Outline/list-view-outline"
                          stroke="none"
                          stroke-width="1"
                          fill="none"
                          fill-rule="evenodd"
                        >
                          <g
                            id="Group"
                            transform="translate(-0.000000, 5.250000)"
                            fill="#474747"
                            fill-rule="nonzero"
                          >
                            <g id="list-view">
                              <path
                                d="M3.00000001,7.50000002 L3.00000001,6.00000002 L24,6.00000002 L24,7.50000002 L3.00000001,7.50000002 Z M3.00000001,1.5 L3.00000001,0 L24,0 L24,1.5 L3.00000001,1.5 Z M3.00000001,13.5000001 L3.00000001,12.0000001 L24,12.0000001 L24,13.5000001 L3.00000001,13.5000001 Z M0,7.50000002 L0,6.00000002 L1.5,6.00000002 L1.5,7.50000002 L0,7.50000002 Z M0,1.5 L0,0 L1.5,0 L1.5,1.5 L0,1.5 Z M0,13.5000001 L0,12.0000001 L1.5,12.0000001 L1.5,13.5000001 L0,13.5000001 Z"
                                id="Combined-Shape"
                              ></path>
                            </g>
                          </g>
                        </g>
                      </svg>
                    </div>
                    <span className="tooltiptext">Financial manuals</span>
                  </div>
                  <div
                    onClick={toggle}
                    style={{ display: isOpen ? "block" : "none" }}
                    className="link_text"
                  >
                    Financial manuals
                  </div>
                </NavLink>
              </div>
              <div className="paths">
                <NavLink to={"/search"} className="link">
                  <div  className="tooltip">
                    <div className="icons" activeclassName="active">
                      <svg
                        width="25px"
                        height="25px"
                        viewBox="-5 3 35 25"
                        className="highlight"
                      >
                        <g
                          id="Icon/Outline/search-outline"
                          stroke="none"
                          stroke-width="1"
                          fill="none"
                          fill-rule="evenodd"
                        >
                          <g
                            id="Group"
                            transform="translate(-0.000000, -0.000000)"
                            fill="#474747"
                            fill-rule="nonzero"
                          >
                            <g
                              id="search"
                              transform="translate(0.000000, 0.000000)"
                            >
                              <path
                                d="M15.8767808,14.8063228 L24,22.9295421 L22.9295421,24 L14.8063228,15.8767808 C13.2390428,17.201437 11.2127786,18 9,18 C4.02943727,18 0,13.9705628 0,9 C0,4.02943727 4.02943727,0 9,0 C13.9705628,0 18,4.02943727 18,9 C18,11.2127786 17.201437,13.2390428 15.8767808,14.8063228 Z M9.0138562,16.5138562 C13.1559919,16.5138562 16.5138562,13.1559919 16.5138562,9.0138562 C16.5138562,4.87172059 13.1559919,1.5138562 9.0138562,1.5138562 C4.87172059,1.5138562 1.5138562,4.87172059 1.5138562,9.0138562 C1.5138562,13.1559919 4.87172059,16.5138562 9.0138562,16.5138562 Z"
                                id="Combined-Shape"
                              ></path>
                            </g>
                          </g>
                        </g>
                      </svg>
                    </div>
                    <span className="tooltiptext">Search document</span>
                  </div>
                  <div
                    onClick={toggle}
                    style={{ display: isOpen ? "block" : "none" }}
                    className="link_text"
                  >
                    Search document
                  </div>
                </NavLink>
              </div>
              {/* <div className="paths">
                {menuItem2.map((item, index) => (
                  <NavLink to={item.path} key={index} className="link">
                    <div onClick={isOpen} className="tooltip">
                      <div className="icons" activeclassName="active">
                        {item.icon}
                      </div>

                      <span className="tooltiptext">{item.tooltip}</span>
                    </div>

                    <div
                      style={{ display: isOpen ? "block" : "none" }}
                      className="link_text"
                    >
                      {item.name}
                    </div>
                  </NavLink>
                ))}
              </div> */}
            </div>
          )}
        </div>
      </>
    );
  }
};

export default Sidebar;

// import React, { useState } from 'react';
// import {
//     FaTh,
//     FaBars,
//     FaUserAlt,
//     FaRegChartBar,
//     FaCommentAlt,
//     FaShoppingBag,
//     FaThList
// }from "react-icons/fa";
// import { NavLink } from 'react-router-dom';

// const Sidebar = ({children}) => {
//     const[isOpen ,setIsOpen] = useState(false);
//     const toggle = () => setIsOpen (!isOpen);
//     const menuItem=[
//         {
//             path:"/",
//             name:"Dashboard",
//             icon:<FaTh/>
//         },
//         {
//             path:"/about",
//             name:"About",
//             icon:<FaUserAlt/>
//         },
//         {
//             path:"/analytics",
//             name:"Analytics",
//             icon:<FaRegChartBar/>
//         },
//         {
//             path:"/comment",
//             name:"Comment",
//             icon:<FaCommentAlt/>
//         },
//         {
//             path:"/product",
//             name:"Product",
//             icon:<FaShoppingBag/>
//         },
//         {
//             path:"/productList",
//             name:"Product List",
//             icon:<FaThList/>
//         }
//     ]
//     return (
//         <div className="container">
//            <div style={{width: isOpen ? "200px" : "50px"}} className="sidebar">
//                <div className="top_section">
//                    <h1 style={{display: isOpen ? "block" : "none"}} className="logo">Logo</h1>
//                    <div style={{marginLeft: isOpen ? "50px" : "0px"}} className="bars">
//                        <FaBars onClick={toggle}/>
//                    </div>
//                </div>
//                {
//                    menuItem.map((item, index)=>(
//                        <NavLink to={item.path} key={index} className="link" activeclassName="active">
//                            <div className="icon">{item.icon}</div>
//                            <div style={{display: isOpen ? "block" : "none"}} className="link_text">{item.name}</div>
//                        </NavLink>
//                    ))
//                }
//            </div>
//            <main>{children}</main>
//         </div>
//     );
// };

// export default Sidebar;

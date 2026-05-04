"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Cookies from "js-cookie";
import { usePathname, useRouter } from "next/navigation";

import logo from "@/assets/logo.png";
import chat from "@/assets/chat.png";
import admin from "@/assets/admin.png";
import expert from "@/assets/expert.png";
import logoutIcon from "@/assets/logout.png";
import session from "@/assets/session.png";
import reviews from "@/assets/reviews.png";
import dispute from "@/assets/dispute.png";
import content from "@/assets/content.png";
import settings from "@/assets/settings.png";
import dashboard from "@/assets/dashboard.png";
import jobSeeker from "@/assets/jobSeeker.png";
import withdrawals from "@/assets/withdrawals.png";
import subscription from "@/assets/subscription.png";
import { SlMenu } from "react-icons/sl";
import { IoClose } from "react-icons/io5";
import { GoDotFill } from "react-icons/go";
import { FaQuestion } from "react-icons/fa6";
import { MdOutlinePrivacyTip } from "react-icons/md";
import { TbAlignBoxCenterMiddle } from "react-icons/tb";
import { TfiAngleDown, TfiAngleUp } from "react-icons/tfi";
import { JWTDecodeToken } from "@/lib/jwtDecode";
import orderImage from "@/assets/image.png";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const NavbarSlider = ({ isOpen, toggleSidebar }: SidebarProps) => {
  const path = usePathname();
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);

  const { decoded }: any = JWTDecodeToken();

  const allNavigation = [
    { label: "Dashboard", route: "/", icon: dashboard },
    {
      label: "Job Seeker Management",
      route: "/job-seeker-management",
      icon: jobSeeker,
    },
    { label: "Expert Management", route: "/expert-management", icon: expert },
    {
      label: "Session Management",
      route: "/session-management",
      icon: session,
    },
    { label: "Order Management", route: "/order-management", icon: orderImage },
    { label: "Reviews & Feedback", route: "/reviews-feedback", icon: reviews },
    {
      label: "Dispute Management",
      route: "/dispute-management",
      icon: dispute,
    },
    { label: "Withdrawals", route: "/withdrawals", icon: withdrawals },
    { label: "Finance Overview", route: "/finance", icon: withdrawals },   
    {
      label: "Subscription plan",
      route: "/subscription-plan",
      icon: subscription,
    },
    { label: "Admin & Role", route: "/admin-roles", icon: admin },
    {
      label: "Content Management",
      route: "/terms-and-conditions",
      icon: content,
    },
    { label: "Chat History", route: "/chat-history", icon: chat },
    { label: "Settings", route: "/settings", icon: settings },
  ];

  const roleRoutes: Record<string, string[]> = {
    SuperAdmin: allNavigation.map((item) => item.route),
    FinanceAdmin: [
      "/subscription-plan",
      "/withdrawals",
      "/finance",
      "/settings",
    ],
    UserAdmin: [
      "/job-seeker-management",
      "/expert-management",
      "/session-management",
      "/order-management",
      "/settings",
    ],
    DisputeAdmin: [
      "/dispute-management",
      "/reviews-feedback",
      "/chat-history",
      "/settings",
    ],
    ContentAdmin: ["/terms-and-conditions", "/settings"],
  };

  const allowedRoutes = roleRoutes[decoded?.role] || [];
  const navigation = allNavigation.filter((item) =>
    allowedRoutes.includes(item.route),
  );

  const handleLogOut = () => {
    Cookies.remove("token");
    router.push("/login");
  };

  return (
    <div className="h-screen bg-white">
      {/* Sidebar Toggle */}
      <button
        onClick={toggleSidebar}
        className="m-4 p-2 text-black rounded-md bg-white shadow-md lg:hidden"
      >
        {isOpen ? <IoClose size={20} /> : <SlMenu size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`duration-300 flex flex-col justify-between h-[calc(100%-80px)] font-inter ${
          isOpen ? "w-[250px] xl:w-[286px]" : "w-20"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          {isOpen && (
            <Link
              href="/"
              className="hidden lg:flex justify-start items-center gap-1 mx-6 mt-6 pb-6"
            >
              <Image
                src={logo}
                height={100}
                width={250}
                alt="logo_image"
                className="w-10 h-10 rounded-md"
                priority
              />
              <p className="text-[#101010] text-[26px] font-bold">SEFR</p>
            </Link>
          )}

          {/* Navigation */}
          <div className={`flex flex-col mt-6 lg:mt-0`}>
            <ul className="m-4 lg:m-6">
              {navigation.map((item) => (
                <li key={item.route}>
                  <Link
                    href={item.route}
                    onClick={() => {
                      if (item.label === "Content Management")
                        setShowDropdown(!showDropdown);
                    }}
                    className={`group flex items-center gap-2 mb-2 rounded-lg hover:bg-[#FF6B00] hover:text-white transition-colors duration-300 ease-in-out ${
                      !isOpen
                        ? "justify-center py-2"
                        : "justify-start px-4 py-2"
                    } ${
                      path === item.route
                        ? "bg-[#FF6B00] text-white"
                        : "text-[#636F85]"
                    }`}
                  >
                    <div className="flex justify-center items-center">
                      <Image
                        src={item.icon}
                        height={50}
                        width={50}
                        alt={item.label}
                        className={`h-6 w-6 transition-all duration-300 filter ${
                          path === item.route
                            ? "brightness-0 invert"
                            : "brightness-0 invert-50"
                        } group-hover:invert`}
                        priority
                      />
                    </div>
                    {isOpen && (
                      <p className="text-sm xl:text-base">{item.label}</p>
                    )}
                    {item.label === "Content Management" &&
                      (showDropdown ? (
                        <TfiAngleUp className="w-2 lg:w-5 h-2 lg:h-5" />
                      ) : (
                        <TfiAngleDown className="w-2 lg:w-5 h-2 lg:h-5" />
                      ))}
                  </Link>

                  {/* Dropdown for Content Management */}
                  {showDropdown && item.label === "Content Management" && (
                    <div className="flex flex-col text-[#636F85] bg-[#FAD6D666] rounded-lg space-y-2">
                      {[
                        {
                          route: "/terms-and-conditions",
                          label: "Terms & Conditions",
                          icon: TbAlignBoxCenterMiddle,
                        },
                        {
                          route: "/privacy-policy",
                          label: "Privacy Policy",
                          icon: MdOutlinePrivacyTip,
                        },
                        { route: "/faq", label: "FAQ", icon: FaQuestion },
                      ].map((sub) => (
                        <Link
                          key={sub.route}
                          href={sub.route}
                          className={`font-medium p-3 ${isOpen && "pl-8"} ${
                            path === sub.route
                              ? "text-white bg-[#FF6B00] rounded-lg"
                              : "hover:bg-[#FF6B00] hover:text-white hover:rounded-lg"
                          }`}
                        >
                          {!isOpen ? (
                            <div className="text-[#CBD5E1]">
                              <sub.icon
                                color={path === sub.route ? "#FFF" : "#64748B"}
                                size={24}
                              />
                            </div>
                          ) : (
                            <div className="text-sm flex items-center gap-2">
                              <GoDotFill
                                color={path === sub.route ? "#FFF" : "#CBD5E1"}
                                size={16}
                              />
                              <span>{sub.label}</span>
                            </div>
                          )}
                        </Link>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Logout */}
          <div className="mt-auto p-6">
            <button
              onClick={handleLogOut}
              className="flex items-center justify-start gap-2 text-[#FF4D4F] bg-[#D00E111A] hover:text-[#FF4D4F] transition-colors duration-500 ease-in-out cursor-pointer rounded-md hover:bg-[#FF4D4F33] w-full p-1.5 lg:py-2 lg:px-4"
            >
              <Image
                src={logoutIcon}
                height={50}
                width={50}
                alt="Log out"
                className="h-5 w-5"
                priority
              />
              {isOpen && <span>Logout</span>}
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default NavbarSlider;

// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import Cookies from "js-cookie";
// // import { useDispatch } from "react-redux";
// // import { useSelector } from 'react-redux';
// // import { useAuth } from '@/redux/features/authSlice';
// // import { logout } from "@/redux/features/authSlice";
// import { usePathname, useRouter } from "next/navigation";

// import logo from "@/assets/logo.svg";
// import chat from "@/assets/chat.png";
// import admin from "@/assets/admin.png";
// import expert from "@/assets/expert.png";
// import logout from "@/assets/logout.png";
// import session from "@/assets/session.png";
// import reviews from "@/assets/reviews.png";
// import dispute from "@/assets/dispute.png";
// import content from "@/assets/content.png";
// import settings from "@/assets/settings.png";
// import dashboard from "@/assets/dashboard.png";
// import jobSeeker from "@/assets/jobSeeker.png";
// import withdrawals from "@/assets/withdrawals.png";
// import subscription from "@/assets/subscription.png";

// import { SlMenu } from "react-icons/sl";
// import { IoClose } from "react-icons/io5";
// import { GoDotFill } from "react-icons/go";
// import { FaQuestion } from "react-icons/fa6";
// import { MdOutlinePrivacyTip } from "react-icons/md";
// import { TbAlignBoxCenterMiddle } from "react-icons/tb";
// import { TfiAngleDown, TfiAngleUp } from "react-icons/tfi";
// import { JWTDecodeToken } from "@/lib/jwtDecode";

// interface SidebarProps {
//   isOpen: boolean;
//   toggleSidebar: () => void;
// }

// const NavbarSlider = ({ isOpen, toggleSidebar }: SidebarProps) => {
//   const path = usePathname();
//   const router = useRouter();
//   const [showDropdown, setShowDropdown] = useState(false);

//   // const dispatch = useDispatch();
//   // const authState = useSelector(useAuth);
//   const {decoded} = JWTDecodeToken()
//   console.log(decoded);

//   const navigation = [
//     {
//       label: "Dashboard",
//       route: "/",
//       iconPath: dashboard
//     },
//     {
//       label: "Job Seeker Management",
//       route: "/job-seeker-management",
//       iconPath: jobSeeker,
//     },
//     {
//       label: "Expert Management",
//       route: "/expert-management",
//       iconPath: expert,
//     },
//     {
//       label: "Session Management",
//       route: "/session-management",
//       iconPath: session,
//     },
//     {
//       label: "Reviews & Feedback",
//       route: "/reviews-feedback",
//       iconPath: reviews,
//     },
//     {
//       label: "Dispute Management",
//       route: "/dispute-management",
//       iconPath: dispute,
//     },
//     {
//       label: "Withdrawals",
//       route: "/withdrawals",
//       iconPath: withdrawals,
//     },
//     {
//       label: "Subscription plan",
//       route: "/subscription-plan",
//       iconPath: subscription,
//     },
//     {
//       label: "Admin & Role",
//       route: "/admin-roles",
//       iconPath: admin,
//     },
//     {
//       label: "Content Management",
//       route: "/terms-and-conditions",
//       iconPath: content,
//     },
//     {
//       label: "Chat History",
//       route: "/chat-history",
//       iconPath: chat,
//     },
//     {
//       label: "Settings",
//       route: "/settings",
//       iconPath: settings
//     }
//   ];

//   const handleLogOut = () => {
//     // dispatch(logout());
//     Cookies.remove("token");
//     router.push("/login");
//   };

//   return (
//     <div className="h-screen bg-white">
//       {/* Sidebar Toggle Button */}
//       <button
//         onClick={toggleSidebar}
//         className="m-4 p-2 text-black rounded-md bg-white shadow-md lg:hidden"
//       >
//         {isOpen ? <IoClose size={20} /> : <SlMenu size={20} />}
//       </button>

//       {/* Sidebar Content */}
//       <aside
//         className={`duration-300 flex flex-col justify-between h-[calc(100%-80px)] font-inter ${isOpen ? "w-[250px] xl:w-[286px]" : "w-20"}`}
//       >
//         <div className="flex flex-col h-full">
//           {/* Logo */}
//           {isOpen && (
//             <Link href="/" className="hidden lg:flex justify-start items-center gap-1 mx-6 mt-6 pb-6">
//               <Image
//                 src={logo}
//                 height={100}
//                 width={250}
//                 alt="logo_image"
//                 className="w-10 h-10"
//                 priority
//               />
//               <p className="text-[#101010] text-[26px] font-bold">LEARN  IT</p>
//             </Link>
//           )}

//           {/* Navigation */}
//           <div className={`flex flex-col ${isOpen ? "pt-0" : ""} mt-6 lg:mt-0`}>
//             <ul className="m-4 lg:m-6">
//               {navigation.map((item) => (
//                 <li key={item.route}>
//                   <Link
//                     href={item.route}
//                     onClick={() => {
//                       if (item.label === "Content Management")
//                         setShowDropdown(!showDropdown);
//                     }}
//                     className={`group flex items-center gap-2 mb-2 rounded-lg hover:bg-[#FF6B00] hover:text-white transition-colors duration-300 ease-in-out
//                       ${!isOpen ? "justify-center py-2" : "justify-start px-4 py-2"}
//                       ${path === item.route ? "bg-[#FF6B00] text-white" : "text-[#636F85]"}
//                       ${(item.label === "Content Management" && (path === "/terms-and-conditions" || path === "/privacy-policy" || path === "/faq")) ? "bg-[#FF6B00] text-white" : "text-[#636F85]"}`}
//                   >
//                     <div className="flex justify-center items-center">
//                       <Image
//                         src={item.iconPath}
//                         height={50}
//                         width={50}
//                         alt={item.label}
//                         className={`h-6 w-6 transition-all duration-300 filter
//                           ${path === item.route ? "brightness-0 invert" : "brightness-0 invert-50"} group-hover:invert`}
//                         priority
//                       />
//                     </div>

//                     {isOpen && <p className="text-sm xl:text-base flex items-center">{item.label}</p>}
//                     {
//                       item.label === "Content Management" ?
//                         (showDropdown ?
//                           <TfiAngleUp className="w-2 lg:w-5 h-2 lg:h-5" /> :
//                           <TfiAngleDown className="w-2 lg:w-5 h-2 lg:h-5" />) :
//                         <></>
//                     }
//                   </Link>
//                   {
//                     (showDropdown && item.label === "Content Management") ?
//                       (<div className="flex flex-col text-[#636F85] bg-[#FAD6D666] rounded-lg space-y-2">
//                         <Link
//                           href="/terms-and-conditions"
//                           className={`font-medium p-3 ${isOpen && "pl-8"} ${(path === "/terms-and-conditions") ? "text-white bg-[#FF6B00] rounded-lg" : "hover:bg-[#FF6B00] hover:text-white hover:rounded-lg"}`}
//                         >
//                           {
//                             !isOpen ?
//                               <div className="text-[#CBD5E1]"><TbAlignBoxCenterMiddle color={`${(path === "/terms-and-conditions") ? "#FFF" : "#64748B"}`} size={24} /></div> :
//                               <div className="text-sm flex items-center gap-2">
//                                 <GoDotFill color={`${(path === "/terms-and-conditions") ? "#FFF" : "#CBD5E1"}`} size={16} /><span>Terms & Conditions</span>
//                               </div>
//                           }
//                         </Link>
//                         <Link
//                           href="/privacy-policy"
//                           className={`font-medium p-3 ${isOpen && "pl-8"} ${(path === "/privacy-policy") ? "text-white bg-[#FF6B00] rounded-lg" : "hover:bg-[#FF6B00] hover:text-white hover:rounded-lg"}`}
//                         >
//                           {
//                             !isOpen ?
//                               <div className="text-[#CBD5E1]"><MdOutlinePrivacyTip color={`${(path === "/privacy-policy") ? "#FFF" : "#64748B"}`} size={24} /></div> :
//                               <div className="text-sm flex items-center gap-2">
//                                 <GoDotFill color={`${(path === "/privacy-policy") ? "#FFF" : "#CBD5E1"}`} size={16} /><span>Privacy Policy</span>
//                               </div>
//                           }
//                         </Link>
//                         <Link
//                           href="/faq"
//                           className={`font-medium p-3 ${isOpen && "pl-8"} ${(path === "/faq") ? "text-white bg-[#FF6B00] rounded-lg" : "hover:bg-[#FF6B00] hover:text-white hover:rounded-lg"}`}
//                         >
//                           {
//                             !isOpen ?
//                               <div className="text-[#CBD5E1]"><FaQuestion color={`${(path === "/faq") ? "#FFF" : "#64748B"}`} size={24} /></div> :
//                               <div className="text-sm flex items-center gap-2">
//                                 <GoDotFill color={`${(path === "/faq") ? "#FFF" : "#CBD5E1"}`} size={16} /><span>FAQ</span>
//                               </div>
//                           }
//                         </Link>
//                       </div>) :
//                       <></>
//                   }
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Spacer to push logout to bottom */}
//           <div className="grow"></div>

//           {/* Logout Button */}
//           <div className="mt-auto p-6">
//             <button
//               onClick={handleLogOut}
//               className="flex items-center justify-start gap-2 text-[#FF4D4F] bg-[#D00E111A] hover:text-[#FF4D4F] transition-colors duration-500 ease-in-out cursor-pointer rounded-md hover:bg-[#FF4D4F33] w-full p-1.5 lg:py-2 lg:px-4"
//             >
//               <Image
//                 src={logout}
//                 height={50}
//                 width={50}
//                 alt="Log out"
//                 className="h-5 w-5"
//                 priority
//               />
//               {isOpen && <span className="">Logout</span>}
//             </button>
//           </div>
//         </div>
//       </aside>
//     </div>
//   );
// };

// export default NavbarSlider;

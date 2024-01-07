import Link from "next/link";
import {
  Menu, MenuButton, MenuList, MenuItem, Button
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useContext, useState, useEffect } from "react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { UserContext } from "@/context/userContext";
import { useMutation } from "@/hooks/useMutation";
import { useQueries } from "@/hooks/useQueries";

export default function Header() {
  const [isMoreDropdownOpen, setIsMoreDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [hasNewNotification, setHasNewNotification] = useState(false);

  // const userData = useContext(UserContext)
  const router = useRouter();
  const { mutate } = useMutation();
  const { data } = useQueries({
    prefixUrl: "https://paace-f178cafcae7b.nevacloud.io/api/user/me",
    headers: {
      Authorization: `Bearer ${Cookies.get("user_token")}`,
    }
  });

  console.log("User data:", data);

  const { data: notification } = useQueries({
    prefixUrl: "https://paace-f178cafcae7b.nevacloud.io/api/notifications",
    headers: {
      Authorization: `Bearer ${Cookies.get("user_token")}`,
    }
  });

  useEffect(() => {
    // Check apakah terdapat notifikasi baru dan atur state hasNewNotification
    if (notification?.data?.length > 0) {
      setHasNewNotification(true);
    } else {
      setHasNewNotification(false);
    }
  }, [notification]);

  // console.log("Notifications:", notification)
  const toggleMoreDropdown = () => {
    setIsMoreDropdownOpen(!isMoreDropdownOpen);

    // Jika dropdown dibuka, atur hasNewNotification menjadi false
    if (!isMoreDropdownOpen) {
      setHasNewNotification(false);
    }
  };

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  const closeDropdowns = () => {
    setIsMoreDropdownOpen(false);
    setIsUserDropdownOpen(false);
  };

  const HandleLogout = async () => {
    const response = await mutate({
      url: "https://paace-f178cafcae7b.nevacloud.io/api/logout",
      method: "GET",
      headers: {
        Authorization: `Bearer ${Cookies.get("user_token")}`,
      }
    });
    console.log("res => ", response);
    if (!response?.success) {
      console.log("gagal logout");
    } else {
      Cookies.remove("user_token");
      router.push("/login");
    }
  };

  return (
    <header className="bg-white shadow-md p-4 flex items-center justify-between">
      <div className=" container flex items-center mx-auto ">
        <div className="flex items-center">
          <Image src="/social_media.png" width={35} height={35} />
          <div className="mx-4">
            {/* Kolom Search */}
            <input
              type="text"
              placeholder="Search"
              className="border p-2 rounded-full focus:outline-none focus:border-blue-500"
            />
          </div>
          {/* Menu Navigasi */}
          <ul className="flex space-x-4">
            <li className="hover:bg-gray-200 rounded-xl py-2 px-3"><Link href="/">Home</Link></li>
            <li className="hover:bg-gray-200 rounded-xl py-2 px-3"><Link href="/profile">Profile</Link></li>
            <li className="hover:bg-gray-200 rounded-xl py-2 px-3">
              {/* Dropdown Menu */}
              <div className="relative group">
                <button
                  onClick={toggleMoreDropdown}
                  className="text-gray-700 hover:text-gray-900 focus:outline-none"
                >
                  {hasNewNotification && <span className="text-red-500 font-bold">*</span>}Notification
                </button>
                <ul
                  className={`absolute min-w-96 overflow-y-auto max-h-56 ${isMoreDropdownOpen ? "block" : "hidden"} mt-2 py-2 space-y-2 bg-white shadow-lg rounded-md`}
                >
                  {notification?.data?.length > 0 ? (
                    notification.data.map((notif) => (
                      <li key={notif.id} className="px-2 pt-1 hover:bg-slate-200">
                        <span className="text-blue-400 font-semibold">{notif.user.name} </span>
                        {notif.remark} your post
                        <span className="text-gray-500 -m-1 ml-1 text-sm flex">{formatDistanceToNow(new Date(notif.created_at), { addSuffix: true })}</span>
                      </li>
                    ))
                  ) : (
                    <div className="h-24 flex items-center justify-center ">
                      <li className="text-gray-500">No notifications yet</li>
                    </div>
                  )}
                </ul>
              </div>
            </li>
          </ul>
        </div>
        {/* Nama Pengguna dan Logout */}
        <div className="items-center ml-auto">
          {/* Dropdown Menu untuk Nama Pengguna */}
          <div className="relative group hover:bg-slate-200 rounded-xl">
            <button
              onClick={toggleUserDropdown}
              className="text-gray-700 font-bold flex items-center hover:text-blue-600 py-1 px-3 rounded-full focus:outline-none"
            >
              <div className="bg-orange-400 h-9 w-9 rounded-full flex items-center justify-center text-gray-700 text-md font-bold mr-2">
                {data?.data?.name ? getInitials(data.data.name) : "-"}
              </div>
              {data?.data?.name}
              {/* {userData?.name} */}
            </button>
            <ul
              className={`absolute ${isUserDropdownOpen ? "block" : "hidden"} mt-2 space-y-2 bg-white shadow-lg rounded-md w-full`}
            >
              {/* Tambahkan item dropdown sesuai kebutuhan */}
              <li className="text-base font-normal px-2 py-1 hover:bg-slate-200"><Link href="/profile">Profile</Link></li>
              <li className="hover:bg-slate-200">
                <button
                  onClick={() => {
                    closeDropdowns();
                    HandleLogout();
                  }}
                  className="text-base font-normal px-2 py-1"
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}

function getInitials(name) {
  // Memisahkan kata dalam nama dan mengambil inisial maksimal 2 kata pertama
  const initials = name.split(" ").slice(0, 2).map((word) => word[0].toUpperCase()).join("");
  return initials;
}

import Link from "next/link";
import { Menu, MenuButton, MenuList, MenuItem, Button } from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useQueries } from "@/hooks/useQueries";
import Cookies from "js-cookie";
import { useMutation } from "@/hooks/useMutation";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { UserContext } from "@/context/userContext";

export default function Header() {
  const [isMoreDropdownOpen, setIsMoreDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  // const userData = useContext(UserContext)
  const router = useRouter()
  const { mutate } = useMutation()
  const { data } = useQueries({prefixUrl: 'https://paace-f178cafcae7b.nevacloud.io/api/user/me',
  headers:  {
    'Authorization': `Bearer ${Cookies.get('user_token')}`,
  }})

  const toggleMoreDropdown = () => {
    setIsMoreDropdownOpen(!isMoreDropdownOpen);
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
        'Authorization': `Bearer ${Cookies.get('user_token')}`,
      }
    })
    console.log("res => ", response)
    if (!response?.success) {
      console.log("gagal logout")
    } else {
      Cookies.remove("user_token")
      router.push("/login")
    }
  }

  

  return (
    <header className="bg-white shadow-md p-4 flex items-center justify-between">
      <div className=" container flex items-center mx-auto ">
        <div className="flex items-center">
          <h1>Icon</h1>
          <div className="mr-4">
            {/* Kolom Search */}
            <input
              type="text"
              placeholder="Search"
              className="border p-2 rounded-full focus:outline-none focus:border-blue-500"
            />
          </div>
          {/* Menu Navigasi */}
          <ul className="flex space-x-4">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/profile">Profile</Link></li>
            <li><Link href="/users">Users</Link></li>
            <li><Link href="/users/detail">Users Detail</Link></li>
            <li>
              {/* Dropdown Menu */}
              <div className="relative group">
                <button
                  onClick={toggleMoreDropdown}
                  className="text-gray-700 hover:text-gray-900 focus:outline-none"
                >
                  More
                </button>
                <ul
                  className={`absolute ${isMoreDropdownOpen ? 'block' : 'hidden'} mt-2 space-y-2 bg-white shadow-lg rounded-md`}
                >
                  {/* Tambahkan item dropdown sesuai kebutuhan */}
                  <li><Link href="/dropdown-item-1">Dropdown Item 1</Link></li>
                  <li><Link href="/dropdown-item-2">Dropdown Item 2</Link></li>
                </ul>
              </div>
            </li>
          </ul>
        </div>
        {/* Nama Pengguna dan Logout */}
        <div className="items-center ml-auto">
          {/* Dropdown Menu untuk Nama Pengguna */}
          <div className="relative group">
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
              className={`absolute ${isUserDropdownOpen ? 'block' : 'hidden'} mt-2 space-y-2 bg-white shadow-lg rounded-md w-full`}
            >
              {/* Tambahkan item dropdown sesuai kebutuhan */}
              <li className="font-semibold text-lg py-2 px-2 mx-1 border-b border-black">Profile</li>
              <li><Link href="/profile">Profile</Link></li>
              <li>
                <button
                  onClick={() => {
                    closeDropdowns();
                    HandleLogout();
                  }}
                  className="w-full text-left"
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
  const initials = name.split(' ').slice(0, 2).map(word => word[0].toUpperCase()).join('');
  return initials;
}
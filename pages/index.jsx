
import { Inter } from 'next/font/google'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { useQueries } from "@/hooks/useQueries";
import Cookies from "js-cookie";
import { useMutation } from "@/hooks/useMutation";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { UserContext } from "@/context/userContext";

const inter = Inter({ subsets: ['latin'] })
const LayoutComponent = dynamic(() => import("@/layout"))

export default function Main({ children }) {
   // const userData = useContext(UserContext)
   const router = useRouter()
   const { mutate } = useMutation()
   const { data } = useQueries({prefixUrl: 'https://paace-f178cafcae7b.nevacloud.io/api/user/me',
   headers:  {
     'Authorization': `Bearer ${Cookies.get('user_token')}`,
   }})

  return (
    <>
      <LayoutComponent metaTitle="Home">
        <div className="h-screen bg-gray-100">
          <div className="container mx-auto pt-8">
            <div className="flex flex-wrap">
              <div className="w-full px-4 lg:w-1/4">
                <div className="border rounded-2xl py-4 px-2 bg-white">
                  <div className="flex items-center border rounded-2xl p-4 mb-4">
                    <div className="bg-orange-400 h-16 w-16 rounded-full flex items-center justify-center text-gray-700 text-2xl font-bold">
                        {data?.data?.name ? getInitials(data.data.name) : "-"}
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold">{data?.data?.name}</h3>
                      <p className="text-sm font-normal">Palembang, Indonesia</p>
                    </div>
                  </div>
                  <div className="flex items-center border p-4 mb-4">
                    <img src="path/to/logo.png" alt="Logo" className="w-16 h-16 object-contain" />
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold">Nama</h3>
                      <p>Tempat</p>
                    </div>
                  </div>
                  <div className="flex items-center border p-4 mb-4">
                    <img src="path/to/logo.png" alt="Logo" className="w-16 h-16 object-contain" />
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold">Nama</h3>
                      <p>Tempat</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* konten post */}
              <div className="w-full r px-4 lg:w-2/4 ">
                <div className="border rounded-2xl py-4 px-4 bg-white">
                  <div className="flex items-center mb-4">
                    {/* Foto Profil User */}
                    <img
                      src="path/to/user-profile.jpg"
                      alt="Profil User"
                      className="w-12 h-12 rounded-full mr-4"
                    />

                    <div>
                      {/* Nama User */}
                      <h3 className="font-semibold text-lg">Nama User</h3>
                      {/* Email User */}
                      <p className="text-gray-500">user@example.com</p>
                      {/* Tanggal Postingan */}
                      <p className="text-gray-500">Tanggal Posting</p>
                    </div>
                  </div>

                  {/* Description/Teks Postingan */}
                  <p className="mb-4">Ini adalah teks postingan yang panjangnya bisa bervariasi sesuai dengan kontennya.</p>

                  {/* Action Buttons (Like dan Replies) */}
                  <div className="flex">
                    <button className="mr-4 p-2 bg-blue-500 text-white rounded">🤍❤️Like</button>
                    <button className="p-2 bg-green-500 text-white rounded">Replies</button>
                  </div>
                </div>
              </div>
              
              <div className="w-full px-4 lg:w-1/4">
                dfg
              </div>
              
            </div>
          </div>
        </div>
      </LayoutComponent>
    </>
  )
}

function getInitials(name) {
  // Memisahkan kata dalam nama dan mengambil inisial maksimal 2 kata pertama
  const initials = name.split(' ').slice(0, 2).map(word => word[0].toUpperCase()).join('');
  return initials;
}

{/* <p className='my-2'>Home</p> */}
          {/* <Image src="/next.png" width={400} height={400} alt="next img" />
          <img src="/next.png" style={{ width: 400, height: 400 }} alt="next img" /> */}

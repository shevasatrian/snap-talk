import dynamic from 'next/dynamic'
import Link from "next/link";
import { useQueries } from "@/hooks/useQueries";
import Cookies from "js-cookie";
import { useMutation } from "@/hooks/useMutation";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { UserContext } from "@/context/userContext";

const LayoutComponent = dynamic(() => import("@/layout"))

export default function Profile() {
  // const userData = useContext(UserContext)
  const router = useRouter()
  const { mutate } = useMutation()
  const { data } = useQueries({prefixUrl: 'https://paace-f178cafcae7b.nevacloud.io/api/user/me',
  headers:  {
    'Authorization': `Bearer ${Cookies.get('user_token')}`,
  }})



  return (
    <>
      <LayoutComponent metaTitle="Profile">
        <div className="container mx-auto p-8">

          <div className="max-w-4xl mx-auto bg-white rounded overflow-hidden shadow-lg p-6">

            {/* Foto Profil Lingkaran */}
            <div className="flex items-center justify-center mb-4">
                <div className="bg-orange-400 h-20 w-20 rounded-full flex items-center justify-center text-gray-700 text-2xl font-bold">
                  {data?.data?.name ? getInitials(data.data.name) : "-"}
                </div>
            </div>

              {/* Nama Pengguna */}
              <h2 className="text-2xl items-center justify-center flex font-bold mb-4">{data?.data?.name}</h2>

              {/* Informasi Profil */}
              <div className="grid grid-cols-4 gap-4">
                  <div className="mb-2">
                      <label className="block text-gray-600 text-sm font-semibold mb-1">Email:</label>
                      <p className="text-gray-800">{data?.data?.email || "-"}</p>
                  </div>
                  
                  <div className="mb-2">
                      <label className="block text-gray-600 text-sm font-semibold mb-1">Hobby:</label>
                      <p className="text-gray-800">{data?.data?.hobby || "-"}</p>
                  </div>

                  <div className="mb-2">
                      <label className="block text-gray-600 text-sm font-semibold mb-1">Date of Birth:</label>
                      <p className="text-gray-800">{data?.data?.dob || "-"}</p>
                  </div>

                  <div className="mb-2">
                      <label className="block text-gray-600 text-sm font-semibold mb-1">Phone:</label>
                      <p className="text-gray-800">{data?.data?.phone || "-"}</p>
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
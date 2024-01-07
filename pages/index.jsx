
import { Inter } from 'next/font/google'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { useQueries } from "@/hooks/useQueries";
import Cookies from "js-cookie";
import { useMutation } from "@/hooks/useMutation";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import Link from 'next/link';
import Footer from '@/components/footer';
import RepliesModal from './replies/[id]';

const inter = Inter({ subsets: ['latin'] })
const LayoutComponent = dynamic(() => import("@/layout"))

export default function Main({ children }) {
   // const userData = useContext(UserContext)
   const router = useRouter()
   const { mutate } = useMutation()
   const [payload, setPayload] = useState({
      description: "",
    })

   const [showModal, setShowModal] = useState(false)
   const [selectedPost, setSelectedPost] = useState(null)

   const { data } = useQueries({prefixUrl: 'https://paace-f178cafcae7b.nevacloud.io/api/user/me',
   headers:  {
     'Authorization': `Bearer ${Cookies.get('user_token')}`,
   }})
   const { data: dataPost, refetch } = useQueries({queryKey: ['posts', 'all'],
   prefixUrl: 'https://paace-f178cafcae7b.nevacloud.io/api/posts?type=all',
   headers:  {
     'Authorization': `Bearer ${Cookies.get('user_token')}`,
   }})

   const handleSubmit = async () => {
    const response = await mutate({ 
      url: 'https://paace-f178cafcae7b.nevacloud.io/api/post',
      payload,
      headers:  {
        'Authorization': `Bearer ${Cookies.get('user_token')}`,
      }
    })
    router.reload()
    // console.log('response => ', response)
  }

  const handleToggleLike = async (postId, is_like_post) => {
    const url = is_like_post
      ? `https://paace-f178cafcae7b.nevacloud.io/api/unlikes/post/${postId}`
      : `https://paace-f178cafcae7b.nevacloud.io/api/likes/post/${postId}`;
  
    const response = await mutate({
      url,
      payload,
      headers: {
        'Authorization': `Bearer ${Cookies.get('user_token')}`,
      }
    });
  
    // Lakukan sesuatu setelah tindakan like/unlike berhasil, seperti memuat ulang data atau mengupdate state
    // router.reload();
    console.log('response => ', response);
    refetch()
  };

  const handleRepliesClick = (post) => {
    setSelectedPost(post);
    setShowModal(true);
  };

   const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = new Date(dateString).toLocaleDateString('id-ID', options);
    return formattedDate;
  };

  return (
    <>
      <LayoutComponent metaTitle="Home">
        <div className=" bg-gray-100">
          <div className="container mx-auto pt-8">
            <div className="flex flex-wrap">

              <div className="w-full px-4 lg:w-1/4">
                <div className="border rounded-2xl py-4 px-2 bg-white">
                  <div className="flex items-center border-b p-4 mb-5">
                    <div className="bg-orange-400 h-16 w-16 rounded-full flex items-center justify-center text-gray-700 text-2xl font-bold">
                        {data?.data?.name ? getInitials(data.data.name) : "-"}
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold">{data?.data?.name}</h3>
                      <p className="text-sm font-normal">Palembang, Indonesia</p>
                    </div>
                  </div>

                  <h2 className="uppercase text-sm font-medium p-2 text-gray-500">Your Pages</h2>

                  <div className="flex items-center rounded-2xl border p-4 mb-4 hover:cursor-pointer hover:bg-gray-300">
                    <Image src="/x.png" width={50} height={50} />
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold">X</h3>
                      <p className="text-sm font-normal">Social Media Platform</p>
                    </div>
                  </div>
                  <div className="flex items-center rounded-2xl border p-4 mb-2 hover:cursor-pointer hover:bg-gray-300">
                    <Image src="/instagram.png" width={50} height={50} />
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold">Instagram</h3>
                      <p className="text-sm font-normal">Social Media Platform</p>
                    </div>
                  </div>

                  <Link href="/" className="text-sm font-medium px-2 py-1 text-gray-500 hover:text-blue-400">View All</Link>
                </div>

                <Footer/>
              </div>

              {/* konten post */}
              <div className="w-full px-4 lg:w-2/4 ">
                {/* membuat post */}
                <div className="flex p-4 border bg-white border-gray-200 rounded-2xl mb-10">
                  {/* Foto Profil di Kiri */}
                  <div className="bg-orange-400 h-16 w-16 rounded-full flex items-center justify-center text-gray-700 text-2xl font-bold mr-2">
                        {data?.data?.name ? getInitials(data.data.name) : "-"}
                  </div>
                  
                  {/* Kolom Teks di Kanan */}
                  <div className="flex-1">
                    <textarea
                      className="w-full p-2 border bg-gray-200 border-gray-300 rounded-xl"
                      rows="3"
                      value={payload?.description}
                      onChange={(event) => setPayload({ ...payload, description: event.target.value })}
                      placeholder="Write your post..."
                    ></textarea>
                    
                    {/* Tombol Submit */}
                    <button
                     onClick={() => handleSubmit()}
                     className="mt-2 px-6 bg-blue-500 text-white p-2 rounded-2xl hover:bg-blue-600" type="button">
                      Post
                    </button>
                    
                  </div>
                </div>

                <div className="border-b border-gray-400 mx-2 my-2">
                  <h2 className='font-normal text-base text-gray-600'>All Posts</h2>
                </div>

                {/* menampilkan post */}
                <div className="overflow-y-auto max-h-svh">
                  {dataPost?.data.map((post) => (
                  <div key={post.id} className="border rounded-2xl py-4 px-4 bg-white mb-3">
                    <div className="flex items-center mb-4">
                      {/* Foto Profil User */}
                      <div className="bg-orange-400 h-12 w-12 rounded-full flex items-center justify-center text-gray-700 text-2xl font-bold mr-3">
                          {post.user.name ? getInitials(post.user.name) : "-"}
                      </div>
                      
                      <div>
                        {/* Nama User */}
                        <h3 className="font-semibold text-lg">
                          {post.user.name}
                          {post.is_own_post && (
                            <span className="text-gray-500"> (You)</span>
                          )}
                        </h3>
                        {/* Email User */}
                        <p className="text-gray-500">{post.user.email}</p>
                        {/* Tanggal Postingan */}
                        <p className="text-gray-500">{formatDate(post.created_at)}</p>
                      </div>
                    </div>

                    {/* Description/Teks Postingan */}
                    <p className="mb-4">{post.description}</p>

                    {/* Action Buttons (Like dan Replies) */}
                    <div className="flex">
                      <button
                        className={`mr-2 p-2 border rounded-2xl hover:bg-gray-200 ${post.is_like_post ? 'bg-gray-300' : 'bg-white'}`}
                        onClick={() => handleToggleLike(post.id, post.is_like_post)}
                      >
                        {post.is_like_post ? '❤️' : '🤍'}{post.likes_count} Like
                      </button>
                      <button 
                      className="p-2 bg-transparent text-gray-800 border border-gray-300 hover:bg-gray-200 rounded-2xl" 
                      onClick={() => handleRepliesClick(post)}>💬{post.replies_count} Replies</button>
                    </div>
                  </div>
                  ))}
                </div>
              </div>
              
              <div className="w-full px-4 lg:w-1/4">
                <div className="border rounded-2xl py-4 px-2 mb-3 bg-white">
                  <h2 className="p-2 text-lg font-semibold text-gray-700 border-b my-2">Suggestion for you</h2>
                  <div className="flex items-center px-4 mb-1 hover:bg-gray-200 py-2 rounded-xl">
                    <Image src="/avatar-1.png" width={50} height={50} />
                    <div className="ml-4">
                      <h3 className="text-base font-semibold">Bintang Khd</h3>
                      <p>Palembang, Indonesia</p>
                    </div>
                  </div>
                  <div className="flex items-center px-4 mb-1 hover:bg-gray-200 py-2 rounded-xl">
                    <Image src="/avatar-2.png" width={50} height={50} />
                    <div className="ml-4">
                      <h3 className="text-base font-semibold">Farhan Ghifari</h3>
                      <p>Lubuk Linggau, Indonesia</p>
                    </div>
                  </div>
                  <div className="flex items-center px-4 mb-1 hover:bg-gray-200 py-2 rounded-xl">
                    <Image src="/avatar-3-1.png" width={50} height={50} />
                    <div className="ml-4">
                      <h3 className="text-base font-semibold">Nadya Andriani</h3>
                      <p>Seoul, South Korea</p>
                    </div>
                  </div>
                  <h2 className="p-2 text-base font-semibold text-blue-500 hover:text-blue-400 cursor-pointer mt-2 text-center">View More</h2>
                </div>

                <div className="border rounded-2xl py-4 px-2 mt-6 bg-white">
                  <h2 className="p-2 text-lg font-semibold text-gray-700 border-b my-2">Popular Pages</h2>
                  <div className="flex items-center px-4 mb-1 hover:bg-gray-200 py-2 rounded-xl">
                    <Image src="/tiktok.png" width={50} height={50} />
                    <div className="ml-4">
                      <h3 className="text-base font-semibold">Tik Tok</h3>
                      <p>Social Media</p>
                    </div>
                  </div>
                  <div className="flex items-center px-4 mb-1 hover:bg-gray-200 py-2 rounded-xl">
                    <Image src="/apple.png" width={50} height={50} />
                    <div className="ml-4">
                      <h3 className="text-base font-semibold">Apple</h3>
                      <p>Technology Company</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center px-4 mb-1 hover:bg-gray-200 py-2 rounded-xl">
                    <Image src="/github.png" width={50} height={50} />
                    <div className="ml-4">
                      <h3 className="text-base font-semibold">Github</h3>
                      <p>Coding Platform</p>
                    </div>
                  </div>
                  <h2 className="p-2 text-base font-semibold text-blue-500 hover:text-blue-400 cursor-pointer mt-2 text-center">View All Recomendation</h2>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </LayoutComponent>

      {showModal && selectedPost && (
          <RepliesModal
            isOpen={showModal}
            onClose={() => {setShowModal(false), refetch()}}
            postId={selectedPost.id}
          />
      )}
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

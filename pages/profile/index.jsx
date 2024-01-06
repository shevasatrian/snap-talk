import dynamic from 'next/dynamic'
import Link from "next/link";
import { useQueries } from "@/hooks/useQueries";
import Cookies from "js-cookie";
import { useMutation } from "@/hooks/useMutation";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { UserContext } from "@/context/userContext";
import EditPostModal from './edit/[id]';

const LayoutComponent = dynamic(() => import("@/layout"))

export default function Profile() {
  // const userData = useContext(UserContext)
  const router = useRouter()
  const { mutate } = useMutation()
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [isEditPostModalOpen, setEditPostModalOpen] = useState(false);
  const [isDeletePostModalOpen, setDeletePostModalOpen] = useState(false);
  const { data } = useQueries({prefixUrl: 'https://paace-f178cafcae7b.nevacloud.io/api/user/me',
  headers:  {
    'Authorization': `Bearer ${Cookies.get('user_token')}`,
  }})
  const { data: dataPost } = useQueries({queryKey: ['posts', 'me'],
  prefixUrl: 'https://paace-f178cafcae7b.nevacloud.io/api/posts?type=me',
   headers:  {
     'Authorization': `Bearer ${Cookies.get('user_token')}`,
   }})

   const handleDelete = async (id) => {
    // Set selectedNoteId to prompt confirmation modal
    setSelectedPostId(id);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`https://paace-f178cafcae7b.nevacloud.io/api/post/delete/${selectedPostId}`, 
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${Cookies.get('user_token')}`,
        },
      });

      const result = await response.json();
      if (result?.success) {
        // Reset selectedNoteId and reload
        setSelectedPostId(null);
        router.reload();
      }
      console.log('result => ', result);
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const cancelDelete = () => {
    // Reset selectedNoteId when cancel is clicked
    setSelectedPostId(null);
  };

  const openDeletePostModal = (id) => {
    // Set selectedNoteId to prompt confirmation modal
    setSelectedPostId(id);
    // Open the delete modal
    setDeletePostModalOpen(true);
  };

  const closeDeletePostModal = () => {
    // Reset selectedNoteId when the delete modal is closed
    setSelectedPostId(null);
    // Close the delete modal
    setDeletePostModalOpen(false);
  };

  const openEditPostModal = (id) => {
    // Set selectedNoteId to the id of the note to be edited
    setSelectedPostId(id);
    // Open the edit modal
    setEditPostModalOpen(true);
  };

  const closeEditPostModal = () => {
    // Reset selectedNoteId when the edit modal is closed
    setSelectedPostId(null);
    // Close the edit modal
    setEditPostModalOpen(false);
  };

   const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = new Date(dateString).toLocaleDateString('id-ID', options);
    return formattedDate;
  };

  return (
    <>
      <LayoutComponent metaTitle="Profile">
        <div className="container mx-auto p-8">

          <div className="max-w-4xl mx-auto bg-white rounded overflow-hidden shadow-lg p-6 mb-10">

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

          {/* menampilkan post */}
          {dataPost?.data.map((post) => (
                <div key={post.id} className="max-w-4xl mx-auto border rounded-2xl py-4 px-4 bg-white">
                  <div className="flex items-center mb-4">
                    {/* Foto Profil User */}
                    <div className="bg-orange-400 h-12 w-12 rounded-full flex items-center justify-center text-gray-700 text-2xl font-bold mr-3">
                        {post.user.name ? getInitials(post.user.name) : "-"}
                    </div>
                    
                    <div>
                      {/* Nama User */}
                      <h3 className="font-semibold text-lg">
                        {post.user.name} (You)
                      </h3>
                      {/* Email User */}
                      <p className="text-gray-500">{post.user.email}</p>
                      {/* Tanggal Postingan */}
                      <p className="text-gray-500">{formatDate(post.created_at)}</p>
                    </div>

                    <div className="ml-auto">
                      <button className="mr-2 px-4 py-1 bg-blue-500 text-gray-100 border border-gray-300 hover:bg-blue-400 rounded-2xl"
                      onClick={() => openEditPostModal(post.id)}>Edit</button>
                      <button className="p-2 px-4 py-1 bg-red-500 text-gray-100 border border-gray-300 hover:bg-red-400 rounded-2xl" 
                      onClick={() => openDeletePostModal(post.id)}>Delete</button>
                    </div>
                  </div>

                  {/* Description/Teks Postingan */}
                  <p className="mb-4">{post.description}</p>

                  {/* Action Buttons (Like dan Replies) */}
                  <div className="flex">
                    <button className="mr-4 p-2 bg-transparent text-gray-800 border border-gray-300 hover:bg-gray-200 rounded-2xl">🤍❤️{post.likes_count} Like</button>
                    <button className="p-2 bg-transparent text-gray-800 border border-gray-300 hover:bg-gray-200 rounded-2xl">💬{post.replies_count} Replies</button>
                  </div>
                </div>
                ))}

        </div>
      </LayoutComponent>

      {/* Modal for Confirmation */}
      {isDeletePostModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded shadow-md">
            <p className="mb-5">Are you sure you want to delete this post?</p>
            <div className="flex justify-end">
              <button className="bg-red-500 text-white py-2 px-4 rounded mr-2" onClick={confirmDelete}>
                Yes
              </button>
              <button className="bg-gray-500 text-white py-2 px-4 rounded" onClick={cancelDelete}>
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Post Modal */}
      {isEditPostModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <EditPostModal
            postId={selectedPostId}
            onClose={closeEditPostModal}
          />
        </div>
      )}
    </>
  )

}

function getInitials(name) {
  // Memisahkan kata dalam nama dan mengambil inisial maksimal 2 kata pertama
  const initials = name.split(' ').slice(0, 2).map(word => word[0].toUpperCase()).join('');
  return initials;
}
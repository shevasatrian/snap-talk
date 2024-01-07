// RepliesModal.js
import { useState, useEffect } from 'react';
import useSWR from 'swr';
import fetcher from '@/utils/fetcher';
import { useQueries } from "@/hooks/useQueries";
import Cookies from "js-cookie";
import { useMutation } from "@/hooks/useMutation";
import { useRouter } from "next/router";

function RepliesModal({ isOpen, onClose, postId }) {
  const [postData, setPostData] = useState(null);
  const [repliesData, setRepliesData] = useState([]);
  const router = useRouter()
   const { mutate } = useMutation()
   const [payload, setPayload] = useState({
      description: "",
    })

  const { data: postDetails, refetch } = useQueries({
    prefixUrl: `https://paace-f178cafcae7b.nevacloud.io/api/post/${postId}`,
    headers: {
      'Authorization': `Bearer ${Cookies.get('user_token')}`,
    },
  });

  const { data: replies } = useQueries({
    prefixUrl: `https://paace-f178cafcae7b.nevacloud.io/api/replies/post/${postId}`,
    headers: {
      'Authorization': `Bearer ${Cookies.get('user_token')}`,
    },
  });

  const HandleSubmit = async () => {
    const response = await mutate({ 
      url: `https://paace-f178cafcae7b.nevacloud.io/api/replies/post/${postId}`,
      payload,
      headers:  {
        'Authorization': `Bearer ${Cookies.get('user_token')}`,
      }
    })
    if (response?.success) {
      setRepliesData([...repliesData, response.data]); // Gunakan response.data sesuai dengan struktur data yang diterima
    }
    // Update postData.replies_count
    setPostData(prevPostData => ({
      ...prevPostData,
      replies_count: prevPostData.replies_count + 1
    }));
    // console.log('response => ', response)
  }

  const handleDeleteReply = async (replyId) => {
    // Implement the logic to delete the reply with the given replyId
    const response = await mutate({
      url: `https://paace-f178cafcae7b.nevacloud.io/api/replies/delete/${replyId}`,
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${Cookies.get('user_token')}`,
      },
    });

    if (response?.success) {
      // Remove the deleted reply from the state
      setRepliesData((prevReplies) => prevReplies.filter((reply) => reply.id !== replyId));
      
      // Update postData.replies_count
      setPostData((prevPostData) => ({
        ...prevPostData,
        replies_count: prevPostData.replies_count - 1,
      }));
    }
  }

  useEffect(() => {
    if (postDetails?.data) {
      setPostData(postDetails.data);
    }
    if (replies?.data) {
      setRepliesData(replies.data);
    }
  }, [postDetails, replies]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = new Date(dateString).toLocaleDateString('id-ID', options);
    return formattedDate;
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-auto bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg w-2/5">
            {postData && (
              <div>
                
                <div className="border rounded-2xl py-4 px-4 bg-white ">
                  <div className="flex items-center mb-4">
                    <div className="bg-orange-400 h-12 w-12 rounded-full flex items-center justify-center text-gray-700 text-2xl font-bold mr-3">
                        {postData.user.name ? getInitials(postData.user.name) : "-"}
                    </div>
                    
                    <div>
                      {/* Nama User */}
                      <h3 className="font-semibold text-lg">
                        {postData.user.name}
                        {postData.is_own_post && (
                          <span className="text-gray-500"> (You)</span>
                        )}
                      </h3>
                      {/* Email User */}
                      <p className="text-gray-500">{postData.user.email}</p>
                      {/* Tanggal Postingan */}
                      <p className="text-gray-500">{formatDate(postData.created_at)}</p>
                    </div>
                  </div>

                  {/* Description/Teks Postingan */}
                  <p className="mb-4">{postData.description}</p>

                </div>
                  <h3 className="text-base font-semibold mt-4 mb-2">{postData.replies_count} Replies</h3>
              </div>
            )}

            <div className="overflow-y-auto max-h-64">
              {repliesData.map((reply) => (
                <div key={reply.id} className="mb-2">
                  <p className="font-semibold">{reply.user.name}</p>
                  <p>{reply.description}</p>
                  <p className="text-gray-500">{formatDate(reply.created_at)}</p>
                  {reply.is_own_reply && (
                    <button
                      onClick={() => handleDeleteReply(reply.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  )}
                </div>
              ))}
            </div>

            <textarea
              className="w-full p-2 border bg-gray-200 border-gray-300 rounded-xl"
              rows="3"
              value={payload?.description}
              onChange={(event) => setPayload({ ...payload, description: event.target.value })}
              placeholder="Write your reply..."
            ></textarea>
            <button
              onClick={() => HandleSubmit()}
              className="mt-2 px-6 bg-blue-500 text-white p-2 rounded-2xl hover:bg-blue-600"
              type="button"
            >
              Reply
            </button>
            {/* Tombol untuk menutup modal */}
            <button
              className="mt-2 px-6 bg-red-500 text-white p-2 rounded-2xl hover:bg-red-600"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default RepliesModal;

function getInitials(name) {
  // Memisahkan kata dalam nama dan mengambil inisial maksimal 2 kata pertama
  const initials = name.split(' ').slice(0, 2).map(word => word[0].toUpperCase()).join('');
  return initials;
}

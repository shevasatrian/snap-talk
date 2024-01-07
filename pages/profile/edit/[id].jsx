/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/label-has-associated-control */
// edit.js
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

function EditPostModal({ postId, onClose }) {
  const router = useRouter();
  const [post, setPost] = useState({
    description: "",
  });

  useEffect(() => {
    // Fetch note details based on noteId when the component mounts
    async function fetchingData() {
      try {
        const res = await fetch(`https://paace-f178cafcae7b.nevacloud.io/api/post/${postId}`, {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${Cookies.get("user_token")}`,
          },
        });
        const listPost = await res.json();
        console.log("list posts => ", listPost?.data);
        setPost(listPost?.data);
      } catch (error) {
        console.error("Error fetching note details:", error);
      }
    }

    fetchingData();
  }, [postId]);

  const handleUpdate = async () => {
    try {
      const response = await fetch(`https://paace-f178cafcae7b.nevacloud.io/api/post/update/${postId}`, {
        method: "PATCH",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${Cookies.get("user_token")}`,
        },
        body: JSON.stringify({ description: post?.description }),
      });
      const result = await response.json();
      if (result?.success) {
        // Close the modal on successful update
        router.reload();
        onClose();
      }
      console.log("result => ", result);
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  return (
    <div className="bg-white p-5 rounded-2xl shadow-md w-2/5">
      <h1 className="text-2xl font-bold mb-5">Edit Post</h1>
      <div className="grid grid-cols-1 gap-3">
        <div>
          <label htmlFor="description" className="text-gray-600">Description</label>
          <textarea
            id="description"
            type="text"
            rows="4"
            className="border rounded-2xl border-gray-300 p-2 w-full"
            value={post?.description || ""}
            onChange={(event) => setPost({ ...post, description: event.target.value })}
          />
        </div>
        <div>
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded-2xl"
            onClick={() => handleUpdate()}
          >
            Submit
          </button>
          <button
            className="bg-gray-500 text-white py-2 px-4 rounded-2xl ml-2"
            onClick={() => onClose()}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditPostModal;

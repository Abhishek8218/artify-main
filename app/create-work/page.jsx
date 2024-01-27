"use client";

import React, { useState } from "react";
import Form from "@components/Form";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";

const CreateWork = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const [work, setWork] = useState({
    creator: "",
    category: "",
    title: "",
    description: "",
    price: "",
    workPhotos: [],
  });

  if (session) {
    work.creator = session?.user?._id;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const newWorkForm = new FormData();

      for (var key in work) {
        newWorkForm.append(key, work[key]);
      }

      work.workPhotos.forEach((photo) => {
        newWorkForm.append("workPhotos", photo);
      });

      // Display "Publishing your work..." notification
      const publishPromise = toast.promise(
        fetch("/api/work/new", {
          method: "POST",
          body: newWorkForm,
        }).then((response) => {
          if (response.ok) {
            router.push(`/shop?id=${session?.user?._id}`);
            return "Work published successfully!";
          } else {
            throw new Error("Failed to publish work.");
          }
        }),
        {
          loading: "Publishing your work...",
          success: <b>Work Published </b>,
          error: (err) => err.message,
        }
      );

      await publishPromise; // Wait for the toast.promise to resolve
    } catch (err) {
      console.log("Publish Work failed", err.message);
    }
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={true} />
      <Form
        type="Create"
        work={work}
        setWork={setWork}
        handleSubmit={handleSubmit}
      />
    </>
  );
};

export default CreateWork;

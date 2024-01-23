"use client"
import React, { useState } from 'react';
import Form from '@components/Form';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

// Replace the existing CreateWork component with the updated one
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
    work.creator = session?.user?._id
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

      const response = await fetch("/api/work/new", {
        method: "POST",
        body: newWorkForm,
      });

      if (response.ok) {
        router.push(`/shop?id=${session?.user?._id}`);
      }
    } catch (err) {
      console.log("Publish Work failed", err.message);
    }
  };

  return (
    <>
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

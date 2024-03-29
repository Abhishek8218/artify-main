"use client";

import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Loader from "@components/Loader";
import Form from "@components/Form";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast , Toaster} from 'react-hot-toast';

const UpdateWork = () => {
  const { data: session } = useSession();

  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();
  const workId = searchParams.get("id");

  const [work, setWork] = useState({
    category: "",
    title: "",
    description: "",
    price: "",
    workPhotos: [],
    
    
  });

   useEffect(() => {
    const getWorkDetails = async () => {
      const response = await fetch(`api/work/${workId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

    
      setWork({ category: data.category,
        title: data.title,
        description: data.description,
        price: data.price,
        workPhotos: data.workPhotos,});

      setLoading(false);
    };

    if (workId) {
      getWorkDetails();
    }
  }, [workId]);

  const router = useRouter();

  const handleSubmit = async (e) => {
    try {
      e.preventDefault(); // Prevent default form submission behavior
  
      const updateFormWork = new FormData();
  
      for (const key in work) {
        updateFormWork.append(key, work[key]);
      }
     
      
      work.workPhotos.forEach((photo) => {
        updateFormWork.append("workPhotos", photo);
      });
  
      // Pass photosToRemove to the form data
      
  
      const response = await fetch(`/api/work/${workId}`, {
        method: "PATCH",
        body: updateFormWork,
      });
  
      if (response.ok) {
        toast.success("Work Updated successfully!");
        router.push(`/shop?id=${session?.user?._id}`);
      }
    } catch (err) {
      console.log("Publish Work failed", err.message);
      toast.error("Failed to update Work");
    }
  };
  

  return loading ? (
  
    <Loader />
  
  ) : (
    <>
      <Toaster position="top-center" reverseOrder={true}/>
      <Form
        type="Edit"
        work={work}
        setWork={setWork}
        handleSubmit={handleSubmit}
      />
    </>
  );
};

export default UpdateWork;
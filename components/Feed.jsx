"use client";
import { categories } from "@data";
import { useEffect, useState } from "react";
import WorkList from "./WorkList";
import "@styles/Categories.scss";
import Loader from "./Loader";
import Banner from "./Banner";
import { useSession } from "next-auth/react";

const Feed = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [workList, setWorkList] = useState([]);
  
  const getWorkList = async () => {
    try {
      if (session) {
        const response = await fetch(`/api/work/list/${selectedCategory}`);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setWorkList(data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getWorkList();
  }, [selectedCategory, session]);

  return (
    <>
      {loading && session && <Loader />}
      {!loading && (
        <>
          {session && (
            <div className="categories">
              {categories?.map((item, index) => (
                <p
                  onClick={() => setSelectedCategory(item)}
                  className={`${item === selectedCategory ? "selected" : ""}`}
                  key={index}
                >
                  {item}
                </p>
              ))}
            </div>
          )}
          <WorkList data={workList} />
        </>
      )}
    </>
  );
};

export default Feed;

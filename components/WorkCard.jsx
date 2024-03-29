// Import necessary modules
import {
  ArrowBackIosNew,
  ArrowForwardIos,
  Delete,
} from "@mui/icons-material";
import "@styles/WorkCard.scss";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast, Toaster } from "react-hot-toast";
const WorkCard = ({ work }) => {
  /* SLIDER FOR PHOTOS */
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % work.workPhotos.length);
  };

  const goToPrevSlide = () => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + work.workPhotos.length) % work.workPhotos.length
    );
  };

  const router = useRouter();

  /* DELETE WORK */
  const handleDelete = async () => {
    const hasConfirmed = confirm("Are you sure you want to delete this work?");

    if (hasConfirmed) {
      try {
        await fetch(`api/work/${work._id}`, {
          method: "DELETE",
        });
        toast.success("Work Deleted Successfully")
        window.location.reload();
      } catch (err) {
        toast.error("Failed to Delete Work")
        console.log(err);
      }
    }
  };

  const { data: session } = useSession();
  const userId = session?.user?._id;

  return (
    <div
      className="work-card"
      onClick={() => {
        router.push(`/work-details?id=${work._id}`);
      }}
    >
    <Toaster position="top-center" reverseOrder={true} />
      <div className="slider-container">
        <div
          className="slider"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {work.workPhotos?.map((photo, index) => (
            <div className="slide" key={index}>
              <img src={`data:image/*;base64,${Buffer.from(photo).toString('base64')}`} alt="work" />
              <div
                className="prev-button"
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevSlide(e);
                }}
              >
                <ArrowBackIosNew sx={{ fontSize: "15px" }} />
              </div>
              <div
                className="next-button"
                onClick={(e) => {
                  e.stopPropagation();
                  goToNextSlide(e);
                }}
              >
                <ArrowForwardIos sx={{ fontSize: "15px" }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="info">
        <div>
          <h3>{work.title}</h3>
          <div className="creator">
            {work.creator && work.creator.profileImage ? (
              <img src={`data:image/*;base64,${Buffer.from(work.creator.profileImage.data).toString('base64')}`} alt="creator" />
            ) : (
              <span>No creator information available</span>
            )}
            <span>{work.creator && work.creator.username}</span> in <span>{work.category}</span>
          </div>
        </div>
        <div className="price">${work.price}</div>
      </div>

      {userId === work?.creator?._id && (
        <div
          className="icon"
          onClick={(e) => {
            e.stopPropagation();
            handleDelete();
          }}
        >
          <Delete
            sx={{
              borderRadius: "50%",
              backgroundColor: "white",
              padding: "5px",
              fontSize: "30px",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default WorkCard;

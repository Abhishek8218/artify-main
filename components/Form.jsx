import { categories } from "@data";
import { IoIosImages } from "react-icons/io";
import { BiTrash } from "react-icons/bi";

import "@styles/Form.scss";

const Form = ({ type, work, setWork, handleSubmit }) => {
  const handleUploadPhotos = (e) => {
    const newPhotos = e.target.files;
    setWork((prevWork) => {
      const updatedPhotos = prevWork.workPhotos
        ? [...prevWork.workPhotos, ...newPhotos]
        : [...newPhotos];
      return {
        ...prevWork,
        workPhotos: updatedPhotos,
      };
    });
  };

  const handleRemovePhoto = (indexToRemove) => {
    setWork((prevWork) => {
      return {
        ...prevWork,
        workPhotos: prevWork.workPhotos.filter(
          (_, index) => index !== indexToRemove
        ),
      };
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWork((prevWork) => {
      return {
        ...prevWork,
        [name]: value,
      };
    });
  };

  return (
    <div className="form" >
      <h1>{type} Your Work</h1>
      <form onSubmit={handleSubmit} >
        <h3>Which of these categories best describes your work?</h3>
        <div className="category-list">
          {categories?.map((item, index) => (
            <p
              key={index}
              className={`${work.category === item ? "selected" : ""}`}
              onClick={() => {
                setWork({ ...work, category: item });
              }}
            >
              {item}
            </p>
          ))}
        </div>

        <h3>Add some photos of your work</h3>
        {work && Array.isArray(work.workPhotos) && work.workPhotos.length < 1 && (
          <div className="photos">
            <input
              id="image"
              type="file"
              style={{ display: "none" }}
              accept="image/*"
              onChange={handleUploadPhotos}
              multiple
            />
            <label htmlFor="image" className="alone">
              <div className="icon">
                <IoIosImages />
              </div>
              <p>Upload from your device</p>
            </label>
          </div>
        )}

        {work && Array.isArray(work.workPhotos) && work.workPhotos.length > 0 && (
          <div className="photos">
            {work?.workPhotos?.map((photo, index) => {
              return (
                <div key={index} className="photo">
                   {photo && typeof photo === 'object' && photo instanceof File ? (
        <img
          src={URL.createObjectURL(photo)}
          alt={`work-photo-${index}`}
        />
      ) : (
        <img
          src={`data:image/*;base64,${Buffer.from(photo).toString('base64')}`}
          alt={`work-photo-${index}`}
        />
      )}
      <button
        type="button"
        onClick={() => handleRemovePhoto(index)}
      >
                    <BiTrash />
                  </button>
                </div>
              );
            })}
            <input
              id="image"
              type="file"
              style={{ display: "none" }}
              accept="image/*"
              onChange={handleUploadPhotos}
              multiple
            />
            <label htmlFor="image" className="together">
              <div className="icon">
                <IoIosImages />
              </div>
              <p>Upload from your device</p>
            </label>
          </div>
        )}

        <h3>What makes your Work attractive?</h3>
        <div className="description">
          <p>Title</p>
          <input
            type="text"
            placeholder="Title"
            onChange={handleChange}
            name="title"
            value={work.title}
            required
          />
          <p>Description</p>
          <textarea
            type="text"
            placeholder="Description"
            onChange={handleChange}
            name="description"
            value={work.description}
            required
          />
          <p>Now, set your PRICE</p>
          <span>₹</span>
          <input
            type="number"
            placeholder="Price"
            onChange={handleChange}
            name="price"
            value={work.price}
            required
            className="price"
          />
        </div>
        <button className="submit_btn" type="submit">
          PUBLISH YOUR WORK
        </button>
      </form>
    </div>
  );
};

export default Form;
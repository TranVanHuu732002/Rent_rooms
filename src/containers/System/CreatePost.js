import React, { useState } from "react";
import { Address, Button, Loading, Overview } from "../../components";
import { BsCameraFill } from "react-icons/bs";
import { apiCreatePost, apiUploadImages } from "../../services/post";
import { ImBin2 } from "react-icons/im";
import { useSelector } from "react-redux";
import { getCodesArea, getCodesPrice } from "../../utils/Common/getCodes";
import Swal from "sweetalert2";

const CreatePost = () => {
  const [payload, setPayload] = useState({
    categoryCode: "",
    title: "",
    priceNumber: 0,
    areaNumber: 0,
    images: "",
    address: "",
    priceCode: "",
    areaCode: "",
    description: "",
    target: "",
    province: "",
  });

  const [imagesPreview, setImagesPreview] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { prices, areas, categories, provinces } = useSelector(
    (state) => state.app
  );
  const { currentData } = useSelector((state) => state.user);

  const handleFiles = async (e) => {
    e.stopPropagation();
    setIsLoading(true);
    let files = e.target.files;
    let uploadPreset = process.env.REACT_APP_UPLOAD_ASSETS_NAME;

    if (!uploadPreset) {
      console.error("Upload preset is not defined");
      setIsLoading(false);
      return;
    }
    let images = [];
    let uploadPromises = [];

    for (let file of files) {
      let formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);

      uploadPromises.push(apiUploadImages(formData));
    }
    try {
      let responses = await Promise.all(uploadPromises);
      responses.forEach((response) => {
        if (response.status === 200) {
          images = [...images, response.data?.url];
        }
      });
      setImagesPreview((prev) => [...prev, ...images]);
      setPayload((prev) => ({
        ...prev,
        images: [...prev.images, ...images],
      }));
    } catch (error) {
      console.error("Error uploading images:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteImage = (image) => {
    setImagesPreview((prev) => prev?.filter((item) => item !== image));
    setPayload((prev) => ({
      ...prev,
      images: prev?.images?.filter((item) => item !== image),
    }));
  };

  const handleSubmit = async () => {
    let priceCodeArr = getCodesPrice(
      +payload.priceNumber / Math.pow(10, 6),
      prices,
      1,
      15
    );
    let priceCode = priceCodeArr[priceCodeArr.length - 1]?.code;
    let areaCodeArr = getCodesArea(+payload.areaNumber, areas, 0, 90);
    let areaCode = areaCodeArr[areaCodeArr.length - 1]?.code;

    let finalPayload = {
      ...payload,
      priceCode,
      areaCode,
      usedId: currentData.id,
      priceNumber: +payload.priceNumber / Math.pow(10, 6),
      areaNumber: +payload.areaNumber,
      target: payload.target || "Tất cả",
      label: `${
        categories?.find((item) => item.code === payload?.categoryCode)?.value
      } ${payload?.address?.split(", ")[1]}`,
      category: `${
        categories?.find((item) => item.code === payload?.categoryCode)?.value
      }`,
    };
    const response = await apiCreatePost(finalPayload);
    if (response?.data.err === 0) {
      Swal.fire("Thành công!", "Đã tạo bài đăng mới", "info").then(() => {
        setPayload({
          categoryCode: "",
          title: "",
          priceNumber: 0,
          areaNumber: 0,
          images: "",
          address: "",
          priceCode: "",
          areaCode: "",
          description: "",
          target: "",
          province: "",
        });
      });
    } else {
      Swal.fire("Thất bại!", "Tạo bài đăng bị lỗi", "error");
    }
  };

  return (
    <div className="px-6">
      <h1 className="text-3xl font-medium py-4 border-b border-gray-200">
        Đăng tin mới
      </h1>
      <div className="flex gap-4">
        <div className="py-4 flex-auto flex flex-col gap-8 ">
          <Address payload={payload} setPayload={setPayload} />
          <Overview payload={payload} setPayload={setPayload} />
          <div className="w-full mt-4 mb-10">
            <h2 className="font-bold mb-2">Hình ảnh </h2>
            <div className="w-full">
              <label
                className="w-full border-dashed border-2 h-[200px] my-4 flex flex-col items-center justify-center border-gray-400 rounded-md"
                htmlFor="file"
              >
                {isLoading ? (
                  <Loading />
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <BsCameraFill color="blue" size={30} />
                    <span>Thêm ảnh</span>
                  </div>
                )}
              </label>
              <input
                onChange={handleFiles}
                type="file"
                id="file"
                hidden
                multiple
              />
            </div>
            <div className="w-full">
              <h4 className="font-medium p-4">Ảnh tải lên</h4>
              <div className="flex gap-4 items-center">
                {imagesPreview?.map((item) => {
                  return (
                    <div key={item} className="w-1/3 h-1/3 relative">
                      <img
                        alt="preview"
                        src={item}
                        className="w-full h-full object-cover  rounded-md"
                      />
                      <span
                        title="Xoá"
                        className="absolute top-1 right-1 p-2 cursor-pointer bg-gray-300 hover:bg-gray-400 rounded-full"
                        onClick={() => handleDeleteImage(item)}
                      >
                        <ImBin2 />
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <Button
            onClick={handleSubmit}
            text="Tạo Mới"
            bgColor="bg-green-600"
            textColor="text-white"
          />
          <div className="h-[500px]"></div>
        </div>
        <div className="w-[30%] flex-none">
          maps
          <Loading />
        </div>
      </div>
    </div>
  );
};

export default CreatePost;

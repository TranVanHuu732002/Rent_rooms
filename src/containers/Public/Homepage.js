import React, { useEffect } from "react";
import { text } from "../../utils/constant";
import { ItemSidebar, Province, RelatedPost } from "../../components";
import { List, Pagination } from "./index";

import { useDispatch, useSelector } from "react-redux";
import * as actions from "../../store/actions";
const Homepage = () => {
  const { categories, prices, areas } = useSelector((state) => state.app);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.getPrices());
    dispatch(actions.getAreas());
  }, []);

  return (
    <div className=" w-full flex flex-col gap-3">
      <div>
        <h1 className="text-[28px] font-bold">{text.HOME_TITLE}</h1>
        <p className="text-base text-gray-700">{text.HOME_DESCRIPTION}</p>
      </div>
      <Province />
      <div className="w-full flex gap-4">
        <div className="w-[70%]">
          <List />
          <Pagination />
        </div>
        <div className="w-[30%]  flex flex-col gap-4 justify-start items-center">
          <ItemSidebar title={"Danh sách cho thuê"} content={categories} />
          <ItemSidebar
            isDouble={true}
            type="priceCode"
            title={"Xem theo giá"}
            content={prices}
          />
          <ItemSidebar
            isDouble={true}
            type="areaCode"
            title={"Xem theo diện tích"}
            content={areas}
          />
          <RelatedPost/>
        </div>
      </div>
    </div>
  );
};

export default Homepage;

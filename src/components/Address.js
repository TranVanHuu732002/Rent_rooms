import React, { memo, useEffect, useState } from "react";
import { InputReadOnly, Select } from "../components";
import {
  apiGetPublicDistricts,
  apiGetPublicProvinces,
  apiGetPublicWards,
} from "../services/app";
import { useSelector } from "react-redux";

const Address = ({ setPayload, invalidFields, setInvalidFields }) => {
  const { dataEdit } = useSelector((state) => state.post);

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [wards, setWards] = useState([]);
  const [ward, setWard] = useState("");
  const [reset, setReset] = useState(false);

  useEffect(() => {
    if (dataEdit?.address) {
      let addressArr = dataEdit?.address?.split(",");
      let foundProvince =
        provinces?.length > 0 &&
        provinces?.find(
          (item) =>
            item.province_name === addressArr[addressArr.length - 1]?.trim()
        );
      setProvince(foundProvince ? foundProvince.province_id : "");
    }
  }, [provinces, dataEdit]);

  useEffect(() => {
    if (dataEdit?.address) {
      let addressArr = dataEdit?.address?.split(",");
      let foundDistrict =
        districts?.length > 0 &&
        districts?.find(
          (item) =>
            item.district_name === addressArr[addressArr.length - 2]?.trim()
        );
      setDistrict(foundDistrict ? foundDistrict.district_id : "");
    }
  }, [districts, dataEdit]);

  useEffect(() => {
    if (dataEdit?.address) {
      let addressArr = dataEdit?.address?.split(",");
      let foundWard =
        wards?.length > 0 &&
        wards?.find(
          (item) => item.ward_name === addressArr[addressArr.length - 3]?.trim()
        );
      setWard(foundWard ? foundWard.ward_id : "");
    }
  }, [wards, dataEdit]);

  useEffect(() => {
    const fecthPublicProvince = async () => {
      const response = await apiGetPublicProvinces();
      if (response.status === 200) {
        setProvinces(response.data.results);
      }
    };
    fecthPublicProvince();
  }, []);

  useEffect(() => {
    setDistrict("");
    const fecthPublicDistrict = async () => {
      const response = await apiGetPublicDistricts(province);
      if (response.status === 200) {
        setDistricts(response.data.results);
      }
    };

    province && fecthPublicDistrict(province);
    !province ? setReset(true) : setReset(false);
    if (!province) {
      setDistricts([]);
      setWards([]);
    }
  }, [province]);

  useEffect(() => {
    setWard("");
    const fecthPublicWard = async () => {
      const response = await apiGetPublicWards(district);
      if (response.status === 200) {
        setWards(response.data.results);
      }
    };

    province && district && fecthPublicWard();
    !district ? setReset(true) : setReset(false);

    !district && setWards([]);
  }, [district]);

  const valueWard = ward
    ? wards?.find((item) => item.ward_id === ward)?.ward_name
    : "";
  const valueDistrict = district
    ? districts?.find((item) => item.district_id === district)?.district_name
    : "";
  const valueProvince = province
    ? provinces?.find((item) => item.province_id === province)?.province_name
    : "";

  useEffect(() => {
    setPayload((prev) => ({
      ...prev,
      address: `${[valueWard, valueDistrict, valueProvince]
        .filter(Boolean)
        .join(", ")}`,
      province: valueProvince,
    }));
  }, [province, district, ward]);

  return (
    <div>
      <h2 className="font-bold mb-2">Địa chỉ cho thuê</h2>
      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <Select
            setInvalidFields={setInvalidFields}
            invalidFields={invalidFields}
            type="province"
            value={province}
            setValue={setProvince}
            options={provinces}
            label="Tỉnh/TP"
          />
          <Select
            setInvalidFields={setInvalidFields}
            invalidFields={invalidFields}
            reset={reset}
            type="district"
            value={district}
            setValue={setDistrict}
            options={districts}
            label="Quận/Huyện"
          />
          <Select
            setInvalidFields={setInvalidFields}
            invalidFields={invalidFields}
            reset={reset}
            type="ward"
            value={ward}
            setValue={setWard}
            options={wards}
            label="Phường/Xã"
          />
        </div>
        <InputReadOnly
          label="Địa chỉ chính xác"
          value={`${[valueWard, valueDistrict, valueProvince]
            .filter(Boolean)
            .join(", ")}`}
        />
      </div>
    </div>
  );
};

export default memo(Address);

import { wards } from "../data/ward.js";
import { districts } from "../data/districts.js";
import { provinces } from "../data/provinces.js";

export const randomPhone = () => {
  const randomNum = Math.floor(Math.random() * 100000000);
  const phone = `09${randomNum.toString().padStart(8, "0")}`;
  return phone;
};

export const randomTaxCode = () => {
  const randomNum = Math.floor(Math.random() * 100000000000);
  const taxCode = randomNum.toString().padStart(12, "0");
  return taxCode;
};

export const getRandomIndex = (length) => {
  return Math.floor(Math.random() * length);
};

const getProvince = (exclude = 0) => {
  const randomIndex = Math.floor(Math.random() * provinces.length);
  if (exclude && provinces[randomIndex].code === exclude) {
    return getProvince(exclude);
  }
  return {
    name: provinces[randomIndex].name,
    code: provinces[randomIndex].code,
  };
};

const getDistrict = (provinceCode) => {
  const district = districts.find(
    (district) => district.province_code === provinceCode
  );
  return {
    name: district?.districtByProvince[0].name,
    code: district?.districtByProvince[0].code,
  };
};

const getWard = (districtCode) => {
  const ward = wards.find((ward) => ward.district_code === districtCode);
  return {
    name: ward?.names[0],
    code: ward?.district_code,
  };
};

export const getLocation = () => {
  const province = getProvince();
  const district = getDistrict(province.code);
  const ward = getWard(district.code);
  return {
    province,
    district,
    ward,
  };
};

export const getToday = () => {
  const today = new Date();
  const todayDate = today.getDate();
  const todayMonth = String(today.getMonth() + 1).padStart(2, "0");
  const todayYear = today.getFullYear();

  const formattedToday = `${todayDate}/${todayMonth}/${todayYear}`;
  return { formattedToday, todayDate, todayMonth, todayYear };
};

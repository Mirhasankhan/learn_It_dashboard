"use client";

import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

type phoneProp = {
  phone: string;
  setPhone: React.Dispatch<React.SetStateAction<string>>;
};

const PhoneNumberInput = ({ phone, setPhone }: phoneProp) => {
     const handleChange = (value: string) => {
    if (!value.startsWith("880")) {
      setPhone("880");
      return;
    }
    setPhone(value);
  };
  return (
    <div className="flex flex-col items-center">
      <PhoneInput
        country={"bd"}
        value={phone}
         disableDropdown
        countryCodeEditable={false}
          onChange={handleChange}
        inputClass="!w-full !h-16 !text-lg !border-[#FB933C]"
        buttonStyle={{ border: "1px solid #FB933C" }}
        // buttonClass="!rounded-md !w-[60px]"
      />
    </div>
  );
};

export default PhoneNumberInput;
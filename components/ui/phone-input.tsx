"use client";

import PhoneInput from "react-phone-number-input";
import fr from "react-phone-number-input/locale/fr.json";
import type { Value } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { inputClass } from "@/components/ui/form";
import { PhoneCountrySelect } from "@/components/ui/phone-country-select";

type MoerisPhoneInputProps = {
  value: Value | undefined;
  onChange: (value: Value | undefined) => void;
  id?: string;
  required?: boolean;
  placeholder?: string;
};

/** Sélecteur pays + numéro (libphonenumber-js). Togo (+228) par défaut. */
export function MoerisPhoneInput({
  value,
  onChange,
  id,
  required,
  placeholder = "90 12 34 56",
}: MoerisPhoneInputProps) {
  return (
    <PhoneInput
      id={id}
      labels={fr}
      defaultCountry="TG"
      international
      countryCallingCodeEditable={false}
      addInternationalOption={false}
      countrySelectComponent={PhoneCountrySelect}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      className="moeris-phone-input"
      numberInputProps={{
        className: inputClass,
      }}
    />
  );
}

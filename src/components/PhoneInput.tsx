import { InputMask } from "@react-input/mask";

type PhoneInputProps = {
  phone: string;
  setPhone: (value: string) => void;
};

const PhoneInput = ({ phone, setPhone }: PhoneInputProps) => {
  return (
    <InputMask
      className="input"
      mask="+7 (___) ___-__-__"
      replacement={{ _: /\d/ }}
      value={phone}
      onChange={(e: { target: { value: string } }) => setPhone(e.target.value)}
      placeholder="Телефон"
    />
  );
};

export default PhoneInput;

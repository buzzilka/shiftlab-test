import {InputMask} from '@react-input/mask';

interface PhoneInputProps {
    phone: string;
    setPhone: (value: string) => void;
}

const PhoneInput: React.FC<PhoneInputProps> = ({ phone, setPhone }) => {
    return (
    <InputMask
        className="input"
        mask="+7 (___) ___-__-__" 
        replacement={{ _: /\d/ }}
        value={phone}
        onChange={(e: { target: { value: string; }; }) => setPhone(e.target.value)}
        placeholder="Телефон"
    />
    );
};

export default PhoneInput;

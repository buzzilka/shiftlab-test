import "./App.css";
import PhoneInput from "./components/PhoneInput";
import CodeInput from "./components/CodeInput";
import { useState, useEffect } from "react";
import {
  handlePhoneSubmit,
  handleCodeSubmit,
  authorization,
} from "./scripts/requests";

const App = () => {
  const [phone, setPhone] = useState<string>("");
  const [phoneError, setPhoneError] = useState<string>("");
  const [, setIsPhoneValid] = useState<boolean>(false);
  const [code, setCode] = useState<string>("");
  const [codeError, setCodeError] = useState<string>("");
  const [showCodeInput, setShowCodeInput] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(40);
  const [isCodeResendAvailable, setIsCodeResendAvailable] =
    useState<boolean>(false);

  const startTimer = () => {
    setTimer(40);
    setIsCodeResendAvailable(false);
  };

  const newCode = () => {
    handlePhoneSubmit(
      phone,
      setIsPhoneValid,
      setShowCodeInput,
      startTimer,
      setPhoneError
    );
    startTimer();
  };

  useEffect(() => {
    let interval = null;
    if (showCodeInput && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsCodeResendAvailable(true);
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [showCodeInput, timer]);

  return (
    <div className="main">
      <h2 className="title">Вход</h2>
      <p className="text">
        Введите номер телефона для входа <br /> в личный кабинет
      </p>
      <PhoneInput phone={phone} setPhone={setPhone} />
      {phoneError && (
        <p className="text" style={{ color: "red" }}>
          {phoneError}
        </p>
      )}
      {!showCodeInput && (
        <button
          className="button"
          onClick={() =>
            handlePhoneSubmit(
              phone,
              setIsPhoneValid,
              setShowCodeInput,
              startTimer,
              setPhoneError
            )
          }
        >
          Продолжить
        </button>
      )}
      {showCodeInput && (
        <CodeInput
          code={code}
          setCode={setCode}
          codeError={codeError}
          handleCodeSubmit={() =>
            handleCodeSubmit(phone, code, setCodeError, authorization)
          }
          isCodeResendAvailable={isCodeResendAvailable}
          newCode={newCode}
          timer={timer}
        />
      )}
    </div>
  );
};

export default App;

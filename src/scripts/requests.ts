export const handlePhoneSubmit = async (
  phone: string,
  setIsPhoneValid: (valid: boolean) => void,
  setShowCodeInput: (show: boolean) => void,
  startTimer: () => void,
  setPhoneError: (error: string) => void
) => {
  const validatePhone = (phone: string) => {
    const cleanedPhone = phone.replace(/\D/g, "");
    if (cleanedPhone === "") {
      setPhoneError("Поле не должно быть пустым");
      return false;
    } else if (cleanedPhone.length !== 11) {
      setPhoneError("Введите корректный номер телефона");
      return false;
    }
    setPhoneError("");
    return true;
  };

  if (validatePhone(phone)) {
    setIsPhoneValid(true);
    setShowCodeInput(true);
    startTimer();

    try {
      const response = await fetch(
        "https://shift-backend.onrender.com/auth/otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ phone }),
        }
      );

      if (!response.ok) {
        throw new Error("Ошибка при отправке запроса");
      }

      const data = await response.json();
      console.log("OTP отправлен:", data);
    } catch (error) {
      console.error("Ошибка:", error);
    }
  }
};

export const handleCodeSubmit = async (
  phone: string,
  code: string,
  setCodeError: (error: string) => void,
  authorization: (token: string) => void
) => {
  const validateCode = (code: string) => {
    const cleanedCode = code.replace(/\D/g, "");
    if (cleanedCode === "") {
      setCodeError("Поле не должно быть пустым");
      return false;
    } else if (cleanedCode.length !== 6) {
      setCodeError("Код должен содержать 6 цифр");
      return false;
    }
    setCodeError("");
    return true;
  };

  if (validateCode(code)) {
    try {
      const response = await fetch(
        "https://shift-backend.onrender.com/users/signin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ phone, code }),
        }
      );

      if (!response.ok) {
        throw new Error("Ошибка при отправке запроса");
      }

      const data = await response.json();
      console.log("Токен:", data);
      authorization(data.token);
    } catch (error) {
      alert("Неверный код!");
      console.error("Ошибка:", error);
    }
  }
};

export const authorization = async (token: string | null) => {
  if (token !== null) {
    try {
      const response = await fetch(
        "https://shift-backend.onrender.com/users/session",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Ошибка при отправке запроса");
      }
      const data = await response.json();
      console.log("Данные сессии:", data);
      alert(
        `Авторизация успешна!\nТелефон: ${data.user.phone}\nId пользователя: ${data.user._id}`
      );
    } catch (error) {
      console.error("Ошибка:", error);
    }
  }
};

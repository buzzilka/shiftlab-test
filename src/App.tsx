import './App.css';
import PhoneInput from './components/PhoneInput';
import CodeInput from './components/CodeInput';
import { useState, useEffect } from 'react';

const App: React.FC = () => {
  const [phone, setPhone] = useState<string>('');
  const [phoneError, setPhoneError] = useState<string>('');
  const [  , setIsPhoneValid] = useState<boolean>(false);
  const [code, setCode] = useState<string>('');
  const [codeError, setCodeError] = useState<string>('');
  const [showCodeInput, setShowCodeInput] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(40);
  const [isCodeResendAvailable, setIsCodeResendAvailable] = useState<boolean>(false);

  const validatePhone = (phone: string) => {
    const cleanedPhone = phone.replace(/\D/g, ''); 
    if (cleanedPhone === '') {
      setPhoneError('Поле не должно быть пустым');
      return false;
    } else if (cleanedPhone.length !== 11) {
      setPhoneError('Введите корректный номер телефона');
      return false;
    }
    setPhoneError('');
    return true;
  };

  const validateCode = (code: string) => {
    const cleanedCode = code.replace(/\D/g,'');
    if (cleanedCode === '') {
      setCodeError('Поле не должно быть пустым');
      return false;
    } else if (cleanedCode.length !== 6) {
      setCodeError('Код должен содержать 6 цифр');
      return false;
    }
    setCodeError('');
    return true;
  };

  const handlePhoneSubmit = async () => {
    if (validatePhone(phone)) {
      setIsPhoneValid(true);
      setShowCodeInput(true);
      startTimer();

      try {
        const response = await fetch('https://shift-backend.onrender.com/auth/otp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ phone }), 
        });

        if (!response.ok) {
          throw new Error('Ошибка при отправке запроса');
        }

        const data = await response.json();
        console.log('OTP отправлен:', data);

      } catch (error) {
        console.error('Ошибка:', error);
      }
    }
  };

  const handleCodeSubmit = async () => {
    if (validateCode(code)) {
      try {
        const response = await fetch('https://shift-backend.onrender.com/users/signin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ phone, code }), 
        });

        if (!response.ok) {
          throw new Error('Ошибка при отправке запроса');
        }

        const data = await response.json();
        console.log('Токен:', data);
        authorization(data.token);

      } catch (error) {
        alert('Неверный код!')
        console.error('Ошибка:', error);
      }
    }
  };

  const authorization = async (token: null) => {
    if (token !== null) {
      try {
        const response = await fetch('https://shift-backend.onrender.com/users/session', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, 
          },
        });

        if (!response.ok) {
          throw new Error('Ошибка при отправке запроса');
        }
          const data = await response.json();
          console.log('Данные сессии:', data);
          alert(`Авторизация успешна!\nТелефон: ${data.user.phone}\nId пользователя: ${data.user._id}`)

      } catch (error) {
        console.error('Ошибка:', error);
      }
    }
  };

  const startTimer = () => {
    setTimer(40);
    setIsCodeResendAvailable(false);
  };

  const newCode = () => {
    handlePhoneSubmit();
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
    <div className='main'>
      <h2 className='title'>Вход</h2>
      <p className='text'>
        Введите номер телефона для входа <br/> в личный кабинет
      </p>
      <PhoneInput phone={phone} setPhone={setPhone} />
      {phoneError && <p className="text" style={{ color: 'red' }}>{phoneError}</p>}
      {!showCodeInput && (
        <button className='button' onClick={handlePhoneSubmit}>
          Продолжить
        </button>
      )}
      {showCodeInput && (
      <CodeInput
        code={code}
        setCode={setCode}
        codeError={codeError}
        handleCodeSubmit={handleCodeSubmit}
        isCodeResendAvailable={isCodeResendAvailable}
        newCode={newCode}
        timer={timer}
      />
      )}
    </div>
  );
};

export default App;

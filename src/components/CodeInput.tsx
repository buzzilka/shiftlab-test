import { InputMask } from "@react-input/mask";

type CodeInputProps = {
  code: string;
  setCode: (value: string) => void;
  codeError: string;
  handleCodeSubmit: () => void;
  isCodeResendAvailable: boolean;
  newCode: () => void;
  timer: number;
};

const CodeInput = ({
  code,
  setCode,
  codeError,
  handleCodeSubmit,
  isCodeResendAvailable,
  newCode,
  timer,
}: CodeInputProps) => {
  return (
    <>
      <InputMask
        className="input"
        mask="______"
        replacement={{ _: /\d/ }}
        type="text"
        placeholder="Проверочный код"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      {codeError && (
        <p className="text" style={{ color: "red" }}>
          {codeError}
        </p>
      )}
      <button className="button" onClick={handleCodeSubmit}>
        Войти
      </button>
      {isCodeResendAvailable ? (
        <p className="text timer-end" onClick={newCode}>
          Запросить код ещё раз
        </p>
      ) : (
        <p className="text timer-start">
          Запросить код повторно можно через {timer} секунд
        </p>
      )}
    </>
  );
};

export default CodeInput;

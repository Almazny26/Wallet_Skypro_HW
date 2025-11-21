import { useState } from "react";
import { authenticateUser } from "../utils/auth";
import "./Login.css";

function Login({ onSwitchToRegister, onLogin }) {
  // Состояния полей формы
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // Ошибки валидации для каждого поля
  const [fieldErrors, setFieldErrors] = useState({
    email: false,
    password: false,
  });
  // Отслеживаем, какие поля пользователь уже трогал (для показа ошибок)
  const [touchedFields, setTouchedFields] = useState({
    email: false,
    password: false,
  });
  // Показывать ли общее сообщение об ошибке
  const [showError, setShowError] = useState(false);

  // Валидация email - проверяем формат
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return email.trim().length > 0 && emailRegex.test(email);
  };

  // Валидация пароля - минимум 6 символов
  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const validateField = (field, value) => {
    let isValid = false;
    switch (field) {
      case "email":
        isValid = validateEmail(value);
        break;
      case "password":
        isValid = validatePassword(value);
        break;
      default:
        isValid = false;
    }
    setFieldErrors((prev) => ({
      ...prev,
      [field]: !isValid,
    }));
    return isValid;
  };

  // Когда пользователь уходит с поля - помечаем его как затронутое и валидируем
  const handleFieldBlur = (field) => {
    setTouchedFields((prev) => ({
      ...prev,
      [field]: true,
    }));
    // Валидируем поле при потере фокуса
    if (field === "email") {
      validateField("email", email);
    } else if (field === "password") {
      validateField("password", password);
    }
  };

  // Обработчик изменения полей - валидируем только если поле уже было затронуто
  const handleInputChange = (field, value) => {
    if (field === "email") {
      setEmail(value);
      // Валидируем только если пользователь уже трогал это поле
      if (touchedFields.email) {
        validateField("email", value);
      }
    } else if (field === "password") {
      setPassword(value);
      if (touchedFields.password) {
        validateField("password", value);
      }
    }
    // Скрываем общее сообщение об ошибке при вводе
    setShowError(false);
  };

  // Проверяем, валидна ли вся форма - для активации кнопки
  const isFormValid = () => {
    return validateEmail(email) && validatePassword(password);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Помечаем все поля как затронутые
    setTouchedFields({
      email: true,
      password: true,
    });

    // Валидируем все поля
    const isEmailValid = validateField("email", email);
    const isPasswordValid = validateField("password", password);

    if (isEmailValid && isPasswordValid) {
      // Проверяем, существует ли пользователь с такими данными
      const user = authenticateUser(email, password);

      if (user) {
        // Пользователь найден - успешный вход
        setShowError(false);
        if (onLogin) {
          onLogin(user); // Передаем объект пользователя
        }
      } else {
        // Пользователь не найден - показываем ошибку
        setShowError(true);
      }
    } else {
      setShowError(true);
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-content">
        <div className="auth-header">
          <h1 className="auth-title">Вход</h1>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              Эл. почта
              {touchedFields.email && fieldErrors.email && (
                <span className="error-asterisk"> *</span>
              )}
            </label>
            <input
              type="email"
              className={`form-input ${
                touchedFields.email && fieldErrors.email
                  ? "error"
                  : email && validateEmail(email)
                  ? "valid"
                  : ""
              }`}
              placeholder="Эл. почта"
              value={email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              onBlur={() => handleFieldBlur("email")}
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Пароль
              {touchedFields.password && fieldErrors.password && (
                <span className="error-asterisk"> *</span>
              )}
            </label>
            <input
              type="password"
              className={`form-input ${
                touchedFields.password && fieldErrors.password
                  ? "error"
                  : password && validatePassword(password)
                  ? "valid"
                  : ""
              }`}
              placeholder="Пароль"
              value={password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              onBlur={() => handleFieldBlur("password")}
            />
          </div>

          {/* Общее сообщение об ошибке при попытке отправки с невалидными данными */}
          {showError && (
            <div className="error-message">
              {touchedFields.email &&
              touchedFields.password &&
              validateEmail(email) &&
              validatePassword(password)
                ? "Неверный email или пароль. Проверьте данные и повторите попытку."
                : "Упс! Введенные вами данные некорректны. Введите данные корректно и повторите попытку."}
            </div>
          )}

          <button
            type="submit"
            className={`auth-button ${isFormValid() ? "active" : "inactive"}`}
            disabled={!isFormValid()}
          >
            Войти
          </button>
        </form>

        <div className="auth-footer">
          <div className="auth-footer-text">
            <span>Нужно зарегистрироваться?</span>
          </div>
          <button
            type="button"
            className="auth-link-button"
            onClick={onSwitchToRegister}
          >
            <span>Регистрируйтесь здесь</span>
            <div className="auth-link-underline"></div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;

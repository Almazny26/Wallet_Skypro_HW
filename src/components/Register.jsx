import { useState } from 'react'
import { saveUser, userExists } from '../utils/auth'
import './Register.css'

function Register({ onSwitchToLogin, onRegister }) {
  // Состояния полей формы
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  // Ошибки валидации для каждого поля
  const [fieldErrors, setFieldErrors] = useState({
    name: false,
    email: false,
    password: false,
  })
  // Отслеживаем, какие поля пользователь уже трогал
  const [touchedFields, setTouchedFields] = useState({
    name: false,
    email: false,
    password: false,
  })
  // Показывать ли общее сообщение об ошибке
  const [showError, setShowError] = useState(false)

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return email.trim().length > 0 && emailRegex.test(email)
  }

  const validatePassword = (password) => {
    return password.length >= 6
  }

  // Валидация имени - минимум 2 символа
  const validateName = (name) => {
    return name.trim().length >= 2
  }

  const validateField = (field, value) => {
    let isValid = false
    switch (field) {
      case 'name':
        isValid = validateName(value)
        break
      case 'email':
        isValid = validateEmail(value)
        break
      case 'password':
        isValid = validatePassword(value)
        break
      default:
        isValid = false
    }
    setFieldErrors((prev) => ({
      ...prev,
      [field]: !isValid,
    }))
    return isValid
  }

  const handleFieldBlur = (field) => {
    setTouchedFields((prev) => ({
      ...prev,
      [field]: true,
    }))
    if (field === 'name') {
      validateField('name', name)
    } else if (field === 'email') {
      validateField('email', email)
    } else if (field === 'password') {
      validateField('password', password)
    }
  }

  const handleInputChange = (field, value) => {
    if (field === 'name') {
      setName(value)
      if (touchedFields.name) {
        validateField('name', value)
      }
    } else if (field === 'email') {
      setEmail(value)
      if (touchedFields.email) {
        validateField('email', value)
      }
    } else if (field === 'password') {
      setPassword(value)
      if (touchedFields.password) {
        validateField('password', value)
      }
    }
    setShowError(false)
  }

  const isFormValid = () => {
    return validateName(name) && validateEmail(email) && validatePassword(password)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Помечаем все поля как затронутые
    setTouchedFields({
      name: true,
      email: true,
      password: true,
    })

    // Валидируем все поля
    const isNameValid = validateField('name', name)
    const isEmailValid = validateField('email', email)
    const isPasswordValid = validateField('password', password)

    if (isNameValid && isEmailValid && isPasswordValid) {
      // Проверяем, не существует ли уже пользователь с таким email
      if (userExists(email)) {
        setShowError(true)
        return
      }
      
      // Сохраняем нового пользователя
      const saved = saveUser({ name, email, password })
      
      if (saved) {
        // Пользователь успешно зарегистрирован
        setShowError(false)
        // Автоматически входим после регистрации
        if (onRegister) {
          onRegister()
        }
      } else {
        // Ошибка при сохранении (например, email уже существует)
        setShowError(true)
      }
    } else {
      setShowError(true)
    }
  }

  return (
    <div className="auth-card">
      <div className="auth-content">
        <div className="auth-header">
          <h1 className="auth-title">Регистрация</h1>
        </div>
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              Имя
              {touchedFields.name && fieldErrors.name && (
                <span className="error-asterisk"> *</span>
              )}
            </label>
            <input
              type="text"
              className={`form-input ${
                touchedFields.name && fieldErrors.name
                  ? 'error'
                  : name && validateName(name)
                  ? 'valid'
                  : ''
              }`}
              placeholder="Имя"
              value={name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              onBlur={() => handleFieldBlur('name')}
            />
          </div>
          
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
                  ? 'error'
                  : email && validateEmail(email)
                  ? 'valid'
                  : ''
              }`}
              placeholder="Эл. почта"
              value={email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              onBlur={() => handleFieldBlur('email')}
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
                  ? 'error'
                  : password && validatePassword(password)
                  ? 'valid'
                  : ''
              }`}
              placeholder="Пароль"
              value={password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              onBlur={() => handleFieldBlur('password')}
            />
          </div>

          {showError && (
            <div className="error-message">
              Упс! Введенные вами данные некорректны. Введите данные корректно и повторите попытку.
            </div>
          )}
          
          <button
            type="submit"
            className={`auth-button ${isFormValid() ? 'active' : 'inactive'}`}
            disabled={!isFormValid()}
          >
            Зарегистрироваться
          </button>
        </form>
        
        <div className="auth-footer">
          <div className="auth-footer-text">
            <span>Уже есть аккаунт?</span>
          </div>
          <button 
            type="button" 
            className="auth-link-button"
            onClick={onSwitchToLogin}
          >
            <span>Войдите здесь</span>
            <div className="auth-link-underline"></div>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Register


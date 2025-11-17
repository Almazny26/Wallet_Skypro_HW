import { useState } from "react";
import "./Expenses.css";
import trashIcon from "../assets/icons/trash.svg";
import foodIcon from "../assets/icons/category-food.svg";
import transportIcon from "../assets/icons/category-transport.svg";
import housingIcon from "../assets/icons/category-housing.svg";
import entertainmentIcon from "../assets/icons/category-entertainment.svg";
import educationIcon from "../assets/icons/category-education.svg";
import otherIcon from "../assets/icons/category-other.svg";

// Список категорий с иконками
const categories = [
  { name: "Еда", icon: foodIcon },
  { name: "Транспорт", icon: transportIcon },
  { name: "Жилье", icon: housingIcon },
  { name: "Развлечения", icon: entertainmentIcon },
  { name: "Образование", icon: educationIcon },
  { name: "Другое", icon: otherIcon },
];

function Expenses({ expenses, setExpenses }) {
  // Состояние нового расхода, который добавляем
  const [newExpense, setNewExpense] = useState({
    description: "",
    category: "",
    date: "",
    amount: "",
  });

  // Ошибки валидации для каждого поля
  const [fieldErrors, setFieldErrors] = useState({
    description: false,
    category: false,
    date: false,
    amount: false,
  });

  // Отслеживаем, какие поля пользователь уже трогал
  const [touchedFields, setTouchedFields] = useState({
    description: false,
    category: false,
    date: false,
    amount: false,
  });

  // Проверка валидности конкретного поля
  const isFieldValid = (field, value) => {
    switch (field) {
      case "description":
        return value.trim().length > 0; // Описание не должно быть пустым
      case "category":
        return value.length > 0; // Категория должна быть выбрана
      case "date":
        return value.length > 0; // Дата должна быть указана
      case "amount":
        // Сумма должна быть числом и больше 0
        const numValue = parseFloat(value);
        return (
          value.length > 0 &&
          !isNaN(numValue) &&
          isFinite(numValue) &&
          numValue > 0
        );
      default:
        return false;
    }
  };

  const validateField = (field, value) => {
    const isValid = isFieldValid(field, value);
    setFieldErrors((prev) => ({
      ...prev,
      [field]: !isValid,
    }));
    return isValid;
  };

  const handleFieldBlur = (field) => {
    setTouchedFields((prev) => ({
      ...prev,
      [field]: true,
    }));
    validateField(field, newExpense[field]);
  };

  const handleInputChange = (field, value) => {
    setNewExpense((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Валидация при изменении, если поле уже было затронуто
    if (touchedFields[field]) {
      validateField(field, value);
    }
  };

  // Форматируем дату в формат ДД.ММ.ГГГГ
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  // Обработчик добавления нового расхода
  const handleAddExpense = (e) => {
    e.preventDefault();

    // Валидируем все поля при отправке формы
    const isDescriptionValid = validateField(
      "description",
      newExpense.description
    );
    const isCategoryValid = validateField("category", newExpense.category);
    const isDateValid = validateField("date", newExpense.date);
    const isAmountValid = validateField("amount", newExpense.amount);

    // Помечаем все поля как затронутые, чтобы показать ошибки если есть
    setTouchedFields({
      description: true,
      category: true,
      date: true,
      amount: true,
    });

    if (isDescriptionValid && isCategoryValid && isDateValid && isAmountValid) {
      // Создаем новый расход и добавляем в начало списка
      const expense = {
        id: Date.now(), // Используем timestamp как ID
        description: newExpense.description,
        category: newExpense.category,
        date: formatDate(newExpense.date), // Форматируем дату
        amount: parseFloat(newExpense.amount),
      };
      setExpenses([expense, ...expenses]); // Добавляем новый расход в начало
      // Очищаем форму после успешного добавления
      setNewExpense({
        description: "",
        category: "",
        date: "",
        amount: "",
      });
      // Сбрасываем ошибки и состояния touched
      setFieldErrors({
        description: false,
        category: false,
        date: false,
        amount: false,
      });
      setTouchedFields({
        description: false,
        category: false,
        date: false,
        amount: false,
      });
    }
  };

  // Удаляем расход по ID
  const handleDeleteExpense = (id) => {
    if (!expenses || !Array.isArray(expenses)) {
      return;
    }
    setExpenses(expenses.filter((expense) => expense.id !== id));
  };

  // Форматируем сумму в формат с пробелами и рублями
  const formatAmount = (amount) => {
    // Проверяем, что amount является валидным числом
    if (amount == null || isNaN(amount) || !isFinite(amount)) {
      return "0 ₽";
    }
    return (
      new Intl.NumberFormat("ru-RU", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })
        .format(amount)
        .replace(/,/g, " ") + " ₽"
    );
  };

  return (
    <div className="expenses-page">
      <h1 className="page-title">Мои расходы</h1>
      <div className="expenses-container">
        <div className="expenses-content">
          <div className="expenses-table-card">
            <h2 className="table-title">Таблица расходов</h2>
            <div className="expenses-table">
              <div className="table-header">
                <div className="table-cell">Описание</div>
                <div className="table-cell">Категория</div>
                <div className="table-cell">Дата</div>
                <div className="table-cell">Сумма</div>
                <div className="table-cell"></div>
              </div>
              {expenses.map((expense) => (
                <div key={expense.id} className="table-row">
                  <div className="table-cell">{expense.description}</div>
                  <div className="table-cell">{expense.category}</div>
                  <div className="table-cell">{expense.date}</div>
                  <div className="table-cell">
                    {formatAmount(expense.amount)}
                  </div>
                  <div className="table-cell">
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteExpense(expense.id)}
                      aria-label="Удалить расход"
                    >
                      <img src={trashIcon} alt="Удалить" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="add-expense-card">
            <h2 className="form-title">Новый расход</h2>
            <form onSubmit={handleAddExpense} className="expense-form">
              <div className="form-field">
                <label>
                  Описание
                  {touchedFields.description && fieldErrors.description && (
                    <span className="error-asterisk"> *</span>
                  )}
                </label>
                <input
                  type="text"
                  placeholder="Введите описание"
                  value={newExpense.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  onBlur={() => handleFieldBlur("description")}
                  className={
                    touchedFields.description && fieldErrors.description
                      ? "error"
                      : newExpense.description &&
                        isFieldValid("description", newExpense.description)
                      ? "valid"
                      : ""
                  }
                />
              </div>

              <div className="form-field">
                <label>
                  Категория
                  {touchedFields.category && fieldErrors.category && (
                    <span className="error-asterisk"> *</span>
                  )}
                </label>
                <div className="category-buttons">
                  {categories.map((category) => (
                    <button
                      key={category.name}
                      type="button"
                      className={`category-button ${
                        newExpense.category === category.name ? "selected" : ""
                      }`}
                      onClick={() => {
                        const newValue = category.name;
                        // Обновляем состояние категории
                        setNewExpense((prev) => ({
                          ...prev,
                          category: newValue,
                        }));
                        // Помечаем поле как затронутое сразу при выборе
                        setTouchedFields((prev) => ({
                          ...prev,
                          category: true,
                        }));
                        // Валидируем категорию сразу, чтобы кнопка активировалась
                        validateField("category", newValue);
                      }}
                    >
                      <img src={category.icon} alt={category.name} />
                      <span>{category.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-field">
                <label>
                  Дата
                  {touchedFields.date && fieldErrors.date && (
                    <span className="error-asterisk"> *</span>
                  )}
                </label>
                <input
                  type="date"
                  placeholder="Введите дату"
                  value={newExpense.date}
                  onChange={(e) => handleInputChange("date", e.target.value)}
                  onBlur={() => handleFieldBlur("date")}
                  className={
                    touchedFields.date && fieldErrors.date
                      ? "error"
                      : newExpense.date && isFieldValid("date", newExpense.date)
                      ? "valid"
                      : ""
                  }
                />
              </div>

              <div className="form-field">
                <label>
                  Сумма
                  {touchedFields.amount && fieldErrors.amount && (
                    <span className="error-asterisk"> *</span>
                  )}
                </label>
                <input
                  type="number"
                  placeholder="Введите сумму"
                  value={newExpense.amount}
                  onChange={(e) => handleInputChange("amount", e.target.value)}
                  onBlur={() => handleFieldBlur("amount")}
                  min="0"
                  step="0.01"
                  className={
                    touchedFields.amount && fieldErrors.amount
                      ? "error"
                      : newExpense.amount &&
                        isFieldValid("amount", newExpense.amount)
                      ? "valid"
                      : ""
                  }
                />
              </div>

              <button
                type="submit"
                className={`add-button ${
                  newExpense.description &&
                  newExpense.category &&
                  newExpense.date &&
                  newExpense.amount &&
                  !fieldErrors.description &&
                  !fieldErrors.category &&
                  !fieldErrors.date &&
                  !fieldErrors.amount
                    ? "active"
                    : ""
                }`}
                disabled={
                  !newExpense.description ||
                  !newExpense.category ||
                  !newExpense.date ||
                  !newExpense.amount ||
                  fieldErrors.description ||
                  fieldErrors.category ||
                  fieldErrors.date ||
                  fieldErrors.amount
                }
              >
                Добавить новый расход
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Expenses;

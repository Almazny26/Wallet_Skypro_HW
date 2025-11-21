import { useState } from "react";
import CategorySelector from "./CategorySelector";
import "../components/Expenses.css";

/**
 * Компонент формы добавления нового расхода
 * Содержит все поля формы и логику валидации
 */
function AddExpenseForm({ onAddExpense }) {
  // Состояние нового расхода
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

  // Обработчик для поля суммы - фильтруем недопустимые символы
  const handleAmountInput = (e) => {
    let value = e.target.value;

    // Разрешаем только цифры, одну точку или запятую для десятичных чисел
    // Удаляем все символы, кроме цифр, точки и запятой (блокируем +, -, буквы и т.д.)
    value = value.replace(/[^\d.,]/g, "");

    // Заменяем запятую на точку для единообразия
    value = value.replace(",", ".");

    // Разрешаем только одну точку
    const parts = value.split(".");
    if (parts.length > 2) {
      value = parts[0] + "." + parts.slice(1).join("");
    }

    // Ограничиваем количество знаков после запятой до 2
    const finalParts = value.split(".");
    if (finalParts.length === 2 && finalParts[1].length > 2) {
      value = finalParts[0] + "." + finalParts[1].substring(0, 2);
    }

    handleInputChange("amount", value);
  };

  // Обработчик вставки для поля суммы
  const handleAmountPaste = (e) => {
    e.preventDefault();
    const pastedText = (e.clipboardData || window.clipboardData).getData("text");

    // Извлекаем только числа из вставленного текста (блокируем +, -, буквы и т.д.)
    let value = pastedText.replace(/[^\d.,]/g, "");

    // Заменяем запятую на точку
    value = value.replace(",", ".");

    // Разрешаем только одну точку
    const parts = value.split(".");
    if (parts.length > 2) {
      value = parts[0] + "." + parts.slice(1).join("");
    }

    // Ограничиваем количество знаков после запятой до 2
    const finalParts = value.split(".");
    if (finalParts.length === 2 && finalParts[1].length > 2) {
      value = finalParts[0] + "." + finalParts[1].substring(0, 2);
    }

    handleInputChange("amount", value);
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
  const handleSubmit = (e) => {
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
      // Создаем новый расход
      const expense = {
        id: Date.now(), // Используем timestamp как ID
        description: newExpense.description,
        category: newExpense.category,
        date: formatDate(newExpense.date), // Форматируем дату
        amount: parseFloat(newExpense.amount),
      };

      // Вызываем callback для добавления расхода
      onAddExpense(expense);

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

  // Обработчик выбора категории
  const handleCategoryChange = (categoryName) => {
    setNewExpense((prev) => ({
      ...prev,
      category: categoryName,
    }));
    // Помечаем поле как затронутое сразу при выборе
    setTouchedFields((prev) => ({
      ...prev,
      category: true,
    }));
    // Валидируем категорию сразу, чтобы кнопка активировалась
    validateField("category", categoryName);
  };

  return (
    <div className="add-expense-card">
      <h2 className="form-title">Новый расход</h2>
      <form onSubmit={handleSubmit} className="expense-form">
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

        <CategorySelector
          selectedCategory={newExpense.category}
          onCategoryChange={handleCategoryChange}
          error={fieldErrors.category}
          touched={touchedFields.category}
        />

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
            type="text"
            inputMode="decimal"
            placeholder="Введите сумму"
            value={newExpense.amount}
            onChange={handleAmountInput}
            onPaste={handleAmountPaste}
            onBlur={() => handleFieldBlur("amount")}
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
  );
}

export default AddExpenseForm;


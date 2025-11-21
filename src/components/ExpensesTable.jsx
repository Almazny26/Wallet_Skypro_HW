import trashIcon from "../assets/icons/trash.svg";
import "../components/Expenses.css";

/**
 * Компонент таблицы расходов
 * Отображает список всех расходов в виде таблицы
 */
function ExpensesTable({ expenses, onDeleteExpense }) {
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
            <div className="table-cell">{formatAmount(expense.amount)}</div>
            <div className="table-cell">
              <button
                className="delete-button"
                onClick={() => onDeleteExpense(expense.id)}
                aria-label="Удалить расход"
              >
                <img src={trashIcon} alt="Удалить" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ExpensesTable;


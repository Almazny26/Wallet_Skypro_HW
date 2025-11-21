import ExpensesTable from "../components/ExpensesTable";
import AddExpenseForm from "../components/AddExpenseForm";
import "../components/Expenses.css";

/**
 * Страница "Мои расходы"
 * Собирает компоненты таблицы расходов и формы добавления нового расхода
 */
function ExpensesPage({ expenses, setExpenses }) {
  // Обработчик добавления нового расхода
  const handleAddExpense = (expense) => {
    setExpenses([expense, ...expenses]);
  };

  // Обработчик удаления расхода
  const handleDeleteExpense = (id) => {
    if (!expenses || !Array.isArray(expenses)) {
      return;
    }
    setExpenses(expenses.filter((expense) => expense.id !== id));
  };

  return (
    <div className="expenses-page">
      <h1 className="page-title">Мои расходы</h1>
      <div className="expenses-container">
        <div className="expenses-content">
          <ExpensesTable
            expenses={expenses}
            onDeleteExpense={handleDeleteExpense}
          />
          <AddExpenseForm onAddExpense={handleAddExpense} />
        </div>
      </div>
    </div>
  );
}

export default ExpensesPage;

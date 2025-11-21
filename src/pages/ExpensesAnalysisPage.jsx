import { useState, useMemo } from "react";
import PeriodCalendar from "../components/PeriodCalendar";
import ExpenseChart from "../components/ExpenseChart";
import AnalysisSummary from "../components/AnalysisSummary";
import "../components/ExpensesAnalysis.css";

/**
 * Страница "Анализ расходов"
 * Собирает компоненты календаря выбора периода, диаграммы и сводки
 */
function ExpensesAnalysisPage({ expenses }) {
  const [dateRange, setDateRange] = useState(null);

  // Функция для нормализации даты
  const normalizeDate = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  // Парсим дату из формата ДД.ММ.ГГГГ
  const parseDate = (dateString) => {
    if (!dateString || typeof dateString !== "string") {
      return normalizeDate(new Date(0));
    }
    const parts = dateString.split(".");
    if (parts.length !== 3) {
      return normalizeDate(new Date(0));
    }
    const [day, month, year] = parts.map(Number);
    if (isNaN(day) || isNaN(month) || isNaN(year)) {
      return normalizeDate(new Date(0));
    }
    return normalizeDate(new Date(year, month - 1, day));
  };

  // Фильтруем расходы по выбранному периоду
  // По умолчанию показываем все расходы, если период не выбран
  const filteredExpenses = useMemo(() => {
    if (!expenses || !Array.isArray(expenses)) {
      return [];
    }
    // Если период не выбран, показываем все расходы
    if (!dateRange || !dateRange.start || !dateRange.end) {
      return expenses;
    }
    // Если период выбран, фильтруем по нему
    const { start, end } = dateRange;
    return expenses.filter((expense) => {
      if (!expense || !expense.date) {
        return false;
      }
      const expenseDate = parseDate(expense.date);
      return expenseDate >= start && expenseDate <= end;
    });
  }, [expenses, dateRange]);

  return (
    <div className="expenses-page">
      <h1 className="page-title">Анализ расходов</h1>
      <div className="expenses-container">
        <div className="analysis-content">
          <PeriodCalendar
            expenses={expenses}
            onDateRangeChange={setDateRange}
          />
          <div className="analysis-card">
            <h2 className="analysis-title">Анализ расходов</h2>
            <div className="analysis-stats">
              <AnalysisSummary
                filteredExpenses={filteredExpenses}
                dateRange={dateRange}
              />
              <ExpenseChart filteredExpenses={filteredExpenses} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExpensesAnalysisPage;


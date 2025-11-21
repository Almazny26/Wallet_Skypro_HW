import { useMemo } from "react";
import "../components/ExpensesAnalysis.css";

/**
 * Компонент сводки анализа расходов
 * Отображает общую сумму и период анализа
 */
function AnalysisSummary({ filteredExpenses, dateRange }) {
  // Общая сумма за период
  const totalAmount = useMemo(() => {
    if (!filteredExpenses || !Array.isArray(filteredExpenses)) {
      return 0;
    }
    return filteredExpenses.reduce((sum, expense) => {
      const amount = expense?.amount;
      if (amount != null && !isNaN(amount) && isFinite(amount)) {
        return sum + amount;
      }
      return sum;
    }, 0);
  }, [filteredExpenses]);

  const formatDateForDisplay = (date) => {
    const months = [
      "января",
      "февраля",
      "марта",
      "апреля",
      "мая",
      "июня",
      "июля",
      "августа",
      "сентября",
      "октября",
      "ноября",
      "декабря",
    ];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const getPeriodDisplayText = () => {
    if (!dateRange || !dateRange.start || !dateRange.end) {
      return "все время";
    }
    const startDate = dateRange.start;
    const endDate = dateRange.end;
    if (startDate.getTime() === endDate.getTime()) {
      return formatDateForDisplay(startDate);
    }
    return `${formatDateForDisplay(startDate)} - ${formatDateForDisplay(
      endDate
    )}`;
  };

  return (
    <div className="total-expenses">
      <div className="total-amount">
        {new Intl.NumberFormat("ru-RU", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })
          .format(totalAmount)
          .replace(/,/g, " ")}{" "}
        ₽
      </div>
      <div className="expenses-date">
        Расходы за <span>{getPeriodDisplayText()}</span>
      </div>
    </div>
  );
}

export default AnalysisSummary;


import { useMemo } from "react";
import "../components/ExpensesAnalysis.css";

const categoryColors = {
  Еда: "#D9B6FF",
  Транспорт: "#FFB53D",
  Жилье: "#6EE4FE",
  Развлечения: "#B0AEFF",
  Образование: "#BCEC30",
  Другое: "#FFB9B8",
};

/**
 * Компонент диаграммы расходов по категориям
 * Отображает столбчатую диаграмму с суммами по каждой категории
 */
function ExpenseChart({ filteredExpenses }) {
  // Подсчитываем суммы по категориям для диаграммы
  const categoryStats = useMemo(() => {
    const stats = {};
    if (!filteredExpenses || !Array.isArray(filteredExpenses)) {
      return stats;
    }
    filteredExpenses.forEach((expense) => {
      if (!expense || !expense.category) {
        return;
      }
      if (!stats[expense.category]) {
        stats[expense.category] = 0;
      }
      const amount = expense.amount;
      if (amount != null && !isNaN(amount) && isFinite(amount)) {
        stats[expense.category] += amount;
      }
    });
    return stats;
  }, [filteredExpenses]);

  // Максимальная сумма по категории - для расчета высоты столбцов
  const categoryValues = Object.values(categoryStats);
  const maxCategoryAmount =
    categoryValues.length > 0 ? Math.max(...categoryValues, 0) : 0;
  const maxBarHeight = 328; // Максимальная высота столбца в пикселях

  // Список всех категорий
  const allCategories = [
    "Еда",
    "Транспорт",
    "Жилье",
    "Развлечения",
    "Образование",
    "Другое",
  ];

  return (
    <div className="category-stats">
      {allCategories.map((category) => {
        const amount = categoryStats[category] || 0;
        const height =
          maxCategoryAmount > 0
            ? (amount / maxCategoryAmount) * maxBarHeight
            : 0;
        return (
          <div key={category} className="category-item">
            <div
              className="category-bar"
              style={{
                height: `${Math.max(height, 4)}px`,
                backgroundColor: categoryColors[category],
              }}
            ></div>
            <div className="category-info">
              <div className="category-amount">
                {new Intl.NumberFormat("ru-RU", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })
                  .format(amount)
                  .replace(/,/g, " ")}{" "}
                ₽
              </div>
              <div className="category-name">{category}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ExpenseChart;


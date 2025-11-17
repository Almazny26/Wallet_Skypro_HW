import { useState, useRef, useMemo } from "react";
import "./ExpensesAnalysis.css";

const categoryColors = {
  Еда: "#D9B6FF",
  Транспорт: "#FFB53D",
  Жилье: "#6EE4FE",
  Развлечения: "#B0AEFF",
  Образование: "#BCEC30",
  Другое: "#FFB9B8",
};

function ExpensesAnalysis({ expenses }) {
  // Начальная дата для календаря
  const initialDate = new Date(2024, 6, 10);
  // Выбранная дата (для одного дня)
  const [selectedDate, setSelectedDate] = useState(initialDate);
  // Диапазон дат (для периода)
  const [selectedDateRange, setSelectedDateRange] = useState(() => ({
    start: initialDate,
    end: initialDate,
  }));
  // Реф для прокрутки календаря (пока не используется, но может пригодиться для программной прокрутки)
  const calendarScrollRef = useRef(null);
  // Текущий месяц для отображения в календаре
  const [currentMonth, setCurrentMonth] = useState(new Date(2024, 6, 1));

  const weekDays = ["пн", "вт", "ср", "чт", "пт", "сб", "вс"];

  // Функция для нормализации даты (убираем время)
  const normalizeDate = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  // Парсим дату из формата ДД.ММ.ГГГГ
  const parseDate = (dateString) => {
    if (!dateString || typeof dateString !== "string") {
      return normalizeDate(new Date(0)); // Возвращаем минимальную дату при ошибке
    }
    const parts = dateString.split(".");
    if (parts.length !== 3) {
      return normalizeDate(new Date(0)); // Возвращаем минимальную дату при ошибке
    }
    const [day, month, year] = parts.map(Number);
    // Проверяем валидность даты
    if (isNaN(day) || isNaN(month) || isNaN(year)) {
      return normalizeDate(new Date(0));
    }
    return normalizeDate(new Date(year, month - 1, day));
  };

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

  // Вычисляем диапазон периода на основе выбранной даты или диапазона
  // Используем useMemo чтобы не пересчитывать при каждом рендере
  const getPeriodRange = useMemo(() => {
    if (selectedDateRange && selectedDateRange.start && selectedDateRange.end) {
      return {
        startDate: normalizeDate(selectedDateRange.start),
        endDate: normalizeDate(selectedDateRange.end),
      };
    }

    // Если диапазон не выбран, используем выбранную дату как один день
    const date = normalizeDate(selectedDate);
    return {
      startDate: date,
      endDate: date,
    };
  }, [selectedDate, selectedDateRange]);

  // Фильтруем расходы по выбранному периоду
  // useMemo чтобы не фильтровать при каждом рендере
  const filteredExpenses = useMemo(() => {
    if (!expenses || !Array.isArray(expenses)) {
      return [];
    }
    const { startDate, endDate } = getPeriodRange;
    return expenses.filter((expense) => {
      if (!expense || !expense.date) {
        return false;
      }
      const expenseDate = parseDate(expense.date);
      return expenseDate >= startDate && expenseDate <= endDate;
    });
  }, [expenses, getPeriodRange]);

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
      // Проверяем, что amount является валидным числом
      const amount = expense.amount;
      if (amount != null && !isNaN(amount) && isFinite(amount)) {
        stats[expense.category] += amount;
      }
    });
    return stats;
  }, [filteredExpenses]);

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

  // Максимальная сумма по категории - для расчета высоты столбцов
  const categoryValues = Object.values(categoryStats);
  const maxCategoryAmount =
    categoryValues.length > 0 ? Math.max(...categoryValues, 0) : 0;
  const maxBarHeight = 328; // Максимальная высота столбца в пикселях

  const getPeriodDisplayText = () => {
    const { startDate, endDate } = getPeriodRange;
    if (startDate.getTime() === endDate.getTime()) {
      return formatDateForDisplay(startDate);
    }
    return `${formatDateForDisplay(startDate)} - ${formatDateForDisplay(
      endDate
    )}`;
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    const adjustedStartingDay =
      startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1;

    const days = [];
    for (let i = 0; i < adjustedStartingDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const getMonthsForCalendar = () => {
    const months = [];
    const startDate = new Date(currentMonth);
    startDate.setMonth(startDate.getMonth() - 1);
    for (let i = 0; i < 6; i++) {
      const month = new Date(startDate);
      month.setMonth(startDate.getMonth() + i);
      months.push(month);
    }
    return months;
  };

  const formatMonthYear = (date) => {
    const months = [
      "Январь",
      "Февраль",
      "Март",
      "Апрель",
      "Май",
      "Июнь",
      "Июль",
      "Август",
      "Сентябрь",
      "Октябрь",
      "Ноябрь",
      "Декабрь",
    ];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const handleDateClick = (day, month, e) => {
    e.preventDefault();
    e.stopPropagation();

    if (day !== null) {
      const newDate = normalizeDate(
        new Date(month.getFullYear(), month.getMonth(), day)
      );

      if (!selectedDateRange || !selectedDateRange.start) {
        // Первый клик - устанавливаем начальную дату
        setSelectedDateRange({ start: newDate, end: null });
        setSelectedDate(newDate);
      } else if (!selectedDateRange.end) {
        // Второй клик - устанавливаем конечную дату
        const start = selectedDateRange.start;
        if (newDate < start) {
          setSelectedDateRange({ start: newDate, end: start });
          setSelectedDate(newDate);
        } else {
          setSelectedDateRange({ start, end: newDate });
          setSelectedDate(start);
        }
      } else {
        // Третий клик - начинаем новый выбор
        setSelectedDateRange({ start: newDate, end: null });
        setSelectedDate(newDate);
      }
    }
  };

  const months = getMonthsForCalendar();
  // Список всех категорий - выносим в константу, так как он не зависит от состояния
  const allCategories = [
    "Еда",
    "Транспорт",
    "Жилье",
    "Развлечения",
    "Образование",
    "Другое",
  ];
  const { startDate, endDate } = getPeriodRange;

  return (
    <div className="expenses-page">
      <h1 className="page-title">Анализ расходов</h1>
      <div className="expenses-container">
        <div className="analysis-content">
          <div className="period-selection-card">
            <div className="period-header">
              <h2 className="period-title">Период</h2>
            </div>
            <div className="calendar-container">
              <div className="calendar-header">
                <div className="month-year">
                  {formatMonthYear(currentMonth)}
                </div>
              </div>
              <div className="calendar-wrapper">
                <div className="week-days-fixed">
                  {weekDays.map((day) => (
                    <div key={day} className="week-day">
                      {day}
                    </div>
                  ))}
                </div>
                <div
                  className="calendar-days-scrollable"
                  ref={calendarScrollRef}
                >
                  {months.map((month, monthIndex) => {
                    const days = getDaysInMonth(month);
                    return (
                      <div key={monthIndex} className="calendar-month">
                        {monthIndex > 0 && (
                          <div className="month-separator">
                            <div className="month-year-inline">
                              {formatMonthYear(month)}
                            </div>
                          </div>
                        )}
                        <div className="calendar-days-grid">
                          {days.map((day, dayIndex) => {
                            if (day === null) {
                              return (
                                <button
                                  key={`${monthIndex}-${dayIndex}`}
                                  className="calendar-day empty"
                                  disabled
                                ></button>
                              );
                            }

                            const dayDate = normalizeDate(
                              new Date(
                                month.getFullYear(),
                                month.getMonth(),
                                day
                              )
                            );

                            // Проверяем, находится ли день в выбранном диапазоне
                            const isInRange =
                              dayDate >= startDate && dayDate <= endDate;

                            const isStartDate =
                              dayDate.getTime() === startDate.getTime();
                            const isEndDate =
                              dayDate.getTime() === endDate.getTime();

                            // Выбранный день (тот, на который кликнули)
                            const isSelectedDate =
                              dayDate.getTime() ===
                              normalizeDate(selectedDate).getTime();

                            return (
                              <button
                                key={`${monthIndex}-${dayIndex}`}
                                type="button"
                                className={`calendar-day ${
                                  isStartDate || isEndDate
                                    ? "range-boundary"
                                    : ""
                                } ${
                                  isInRange && !isStartDate && !isEndDate
                                    ? "in-range"
                                    : ""
                                } ${
                                  isSelectedDate && !isInRange
                                    ? "selected-date"
                                    : ""
                                }`}
                                onClick={(e) => handleDateClick(day, month, e)}
                              >
                                {day}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          <div className="analysis-card">
            <h2 className="analysis-title">Анализ расходов</h2>
            <div className="analysis-stats">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExpensesAnalysis;

import { useState, useRef, useEffect, useMemo } from "react";
import "../components/ExpensesAnalysis.css";

/**
 * Компонент календаря для выбора периода анализа расходов
 * Позволяет выбрать диапазон дат для фильтрации расходов
 */
function PeriodCalendar({ expenses, onDateRangeChange }) {
  const calendarScrollRef = useRef(null);
  const monthRefs = useRef({});
  const currentMonthRef = useRef(null); // Ref для отслеживания текущего месяца без перерисовок

  // Функция для нормализации даты (убираем время)
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

  // Вычисляем диапазон месяцев из расходов
  const getExpensesMonthRange = useMemo(() => {
    if (!expenses || !Array.isArray(expenses) || expenses.length === 0) {
      // Если расходов нет, используем текущий месяц
      const today = normalizeDate(new Date());
      const month = new Date(today);
      month.setDate(1);
      return { startMonth: month, endMonth: month };
    }

    let earliestDate = null;
    let latestDate = null;

    expenses.forEach((expense) => {
      if (expense && expense.date) {
        const expenseDate = parseDate(expense.date);
        if (!earliestDate || expenseDate < earliestDate) {
          earliestDate = expenseDate;
        }
        if (!latestDate || expenseDate > latestDate) {
          latestDate = expenseDate;
        }
      }
    });

    // Создаем объекты месяцев (первый день месяца)
    const startMonth = new Date(earliestDate);
    startMonth.setDate(1);
    const endMonth = new Date(latestDate);
    endMonth.setDate(1);

    return { startMonth, endMonth };
  }, [expenses]);

  // Вычисляем начальную дату - последняя дата из расходов
  const getInitialDate = () => {
    if (!expenses || !Array.isArray(expenses) || expenses.length === 0) {
      return normalizeDate(new Date());
    }
    return getExpensesMonthRange.endMonth;
  };

  const initialDate = getInitialDate();
  // По умолчанию ничего не выбрано - показываем все расходы
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [selectedDateRange, setSelectedDateRange] = useState(() => ({
    start: null,
    end: null,
  }));
  
  // Текущий месяц для отображения в заголовке - начинаем с последнего месяца расходов
  const [currentMonth, setCurrentMonth] = useState(() => {
    const date = new Date(getExpensesMonthRange.endMonth);
    currentMonthRef.current = date; // Инициализируем ref
    return date;
  });

  // Обновляем currentMonth и ref при изменении расходов
  useEffect(() => {
    const newMonth = new Date(getExpensesMonthRange.endMonth);
    currentMonthRef.current = newMonth;
    setCurrentMonth(newMonth);
  }, [getExpensesMonthRange]);

  const weekDays = ["пн", "вт", "ср", "чт", "пт", "сб", "вс"];

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

  // Генерируем все месяцы от самого раннего до самого позднего из расходов
  const getMonthsForCalendar = useMemo(() => {
    const months = [];
    const { startMonth, endMonth } = getExpensesMonthRange;
    
    // Начинаем с последнего месяца (endMonth) и идем назад к первому (startMonth)
    const current = new Date(endMonth);
    
    while (current >= startMonth) {
      months.push(new Date(current));
      // Переходим к предыдущему месяцу
      current.setMonth(current.getMonth() - 1);
    }
    
    // Разворачиваем массив, чтобы последний месяц был внизу (для прокрутки)
    return months.reverse();
  }, [getExpensesMonthRange]);

  // Вычисляем диапазон периода
  // Если выбрана дата (start), возвращаем диапазон (даже если это один день)
  const getPeriodRange = useMemo(() => {
    // Если выбрана дата (start), возвращаем диапазон
    if (selectedDateRange && selectedDateRange.start) {
      // Если end не выбран, значит выбран один день (start = end)
      const end = selectedDateRange.end || selectedDateRange.start;
      return {
        startDate: normalizeDate(selectedDateRange.start),
        endDate: normalizeDate(end),
      };
    }
    // Если ничего не выбрано, возвращаем null (показываем все расходы)
    return null;
  }, [selectedDate, selectedDateRange]);

  const handleDateClick = (day, month, e) => {
    e.preventDefault();
    e.stopPropagation();

    if (day !== null) {
      const newDate = normalizeDate(
        new Date(month.getFullYear(), month.getMonth(), day)
      );

      // Если ничего не выбрано - первый клик: выбираем один день
      if (!selectedDateRange || !selectedDateRange.start) {
        setSelectedDateRange({ start: newDate, end: newDate });
        setSelectedDate(newDate);
      } 
      // Если выбран один день (start = end) - второй клик: начинаем период
      else if (selectedDateRange.start.getTime() === selectedDateRange.end?.getTime()) {
        const start = selectedDateRange.start;
        if (newDate.getTime() === start.getTime()) {
          // Клик на ту же дату - сбрасываем выбор
          setSelectedDateRange({ start: null, end: null });
          setSelectedDate(newDate);
        } else if (newDate < start) {
          // Клик на более раннюю дату - делаем её началом периода
          setSelectedDateRange({ start: newDate, end: start });
          setSelectedDate(newDate);
        } else {
          // Клик на более позднюю дату - делаем её концом периода
          setSelectedDateRange({ start, end: newDate });
          setSelectedDate(start);
        }
      }
      // Если выбран период (start != end) - третий клик: начинаем новый выбор
      else {
        setSelectedDateRange({ start: newDate, end: newDate });
        setSelectedDate(newDate);
      }
    }
  };

  // Отслеживаем видимый месяц при прокрутке - только для обновления заголовка
  useEffect(() => {
    const scrollContainer = calendarScrollRef.current;
    if (!scrollContainer) return;

    const updateVisibleMonth = () => {
      const scrollTop = scrollContainer.scrollTop;
      const monthsForCheck = getMonthsForCalendar;

      let visibleMonth = null;
      let minDistance = Infinity;

      // Ищем месяц, который ближе всего к верху видимой области
      monthsForCheck.forEach((month, index) => {
        const monthElement = monthRefs.current[index];
        if (!monthElement) return;

        const monthOffsetTop = monthElement.offsetTop;
        const monthHeight = monthElement.offsetHeight;
        const monthCenter = monthOffsetTop + monthHeight / 2;
        const distance = Math.abs(monthCenter - (scrollTop + 100));

        if (monthOffsetTop <= scrollTop + 200 && distance < minDistance) {
          minDistance = distance;
          visibleMonth = month;
        }
      });

      // Если не нашли, берем первый видимый месяц
      if (!visibleMonth) {
        monthsForCheck.forEach((month, index) => {
          const monthElement = monthRefs.current[index];
          if (!monthElement) return;

          const monthOffsetTop = monthElement.offsetTop;
          if (monthOffsetTop > scrollTop && monthOffsetTop < scrollTop + 300) {
            visibleMonth = month;
          }
        });
      }

      // Обновляем заголовок, если нашли видимый месяц
      if (visibleMonth) {
        const newMonth = new Date(visibleMonth);
        newMonth.setDate(1);
        // Обновляем только если месяц действительно изменился
        setCurrentMonth((prevMonth) => {
          if (newMonth.getTime() !== prevMonth.getTime()) {
            currentMonthRef.current = newMonth;
            return newMonth;
          }
          return prevMonth;
        });
      }
    };

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateVisibleMonth();
          ticking = false;
        });
        ticking = true;
      }
    };

    scrollContainer.addEventListener("scroll", handleScroll, { passive: true });
    
    // Вызываем сразу для начального состояния
    updateVisibleMonth();

    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll);
    };
  }, [getMonthsForCalendar]);

  // Уведомляем родительский компонент об изменении диапазона дат
  useEffect(() => {
    if (onDateRangeChange) {
      if (getPeriodRange) {
        const { startDate, endDate } = getPeriodRange;
        onDateRangeChange({ start: startDate, end: endDate });
      } else {
        // Если диапазон не выбран, отправляем null, чтобы показать все расходы
        onDateRangeChange(null);
      }
    }
  }, [getPeriodRange, onDateRangeChange]);

  // Вычисляем расходы по датам для отображения в календаре
  const expensesByDate = useMemo(() => {
    const expensesMap = {};
    if (!expenses || !Array.isArray(expenses)) {
      return expensesMap;
    }
    expenses.forEach((expense) => {
      if (!expense || !expense.date) {
        return;
      }
      const expenseDate = parseDate(expense.date);
      // parseDate уже возвращает нормализованную дату, используем её напрямую
      const dateKey = expenseDate.getTime();
      if (!expensesMap[dateKey]) {
        expensesMap[dateKey] = {
          count: 0,
          total: 0
        };
      }
      expensesMap[dateKey].count += 1;
      const amount = expense.amount;
      if (amount != null && !isNaN(amount) && isFinite(amount)) {
        expensesMap[dateKey].total += amount;
      }
    });
    return expensesMap;
  }, [expenses]);

  // Получаем диапазон для отображения в календаре (для подсветки)
  const periodRange = getPeriodRange;
  const startDate = periodRange ? periodRange.startDate : null;
  const endDate = periodRange ? periodRange.endDate : null;

  // Функция для сброса выбранного периода
  const handleResetPeriod = () => {
    setSelectedDateRange({ start: null, end: null });
    const latestDate = getExpensesMonthRange.endMonth;
    setSelectedDate(latestDate);
  };

  // Прокручиваем к последнему месяцу при загрузке или изменении расходов
  useEffect(() => {
    const scrollContainer = calendarScrollRef.current;
    if (!scrollContainer || getMonthsForCalendar.length === 0) return;

    // Прокручиваем к последнему месяцу (он в конце массива)
    const lastMonthIndex = getMonthsForCalendar.length - 1;
    const lastMonthElement = monthRefs.current[lastMonthIndex];
    
    if (lastMonthElement) {
      // Небольшая задержка, чтобы элементы успели отрендериться
      setTimeout(() => {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }, 100);
    }
  }, [getMonthsForCalendar]);

  return (
    <div className="period-selection-card">
      <div className="period-header">
        <h2 className="period-title">Период</h2>
        {periodRange && (
          <button
            type="button"
            onClick={handleResetPeriod}
            className="reset-period-button"
            title="Сбросить фильтр"
          >
            Сбросить
          </button>
        )}
      </div>
      <div className="calendar-container">
        <div className="calendar-header">
          <div className="month-year">{formatMonthYear(currentMonth)}</div>
        </div>
        <div className="calendar-wrapper">
          <div className="week-days-fixed">
            {weekDays.map((day) => (
              <div key={day} className="week-day">
                {day}
              </div>
            ))}
          </div>
          <div className="calendar-days-scrollable" ref={calendarScrollRef}>
            {getMonthsForCalendar.map((month, monthIndex) => {
              const days = getDaysInMonth(month);
              return (
                <div
                  key={monthIndex}
                  className="calendar-month"
                  ref={(el) => {
                    if (el) {
                      monthRefs.current[monthIndex] = el;
                    }
                  }}
                >
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
                        new Date(month.getFullYear(), month.getMonth(), day)
                      );

                      // Проверяем, находится ли день в выбранном диапазоне (если он выбран)
                      const isInRange = startDate && endDate
                        ? dayDate >= startDate && dayDate <= endDate
                        : false;
                      const isStartDate = startDate
                        ? dayDate.getTime() === startDate.getTime()
                        : false;
                      const isEndDate = endDate
                        ? dayDate.getTime() === endDate.getTime()
                        : false;
                      const isSelectedDate =
                        dayDate.getTime() === normalizeDate(selectedDate).getTime();

                      // Проверяем, есть ли расходы на эту дату
                      // dayDate уже нормализован, используем его напрямую
                      const dateKey = dayDate.getTime();
                      const dayExpenses = expensesByDate[dateKey];
                      const hasExpenses = dayExpenses && dayExpenses.count > 0;

                      return (
                        <button
                          key={`${monthIndex}-${dayIndex}`}
                          type="button"
                          className={`calendar-day ${
                            isStartDate || isEndDate ? "range-boundary" : ""
                          } ${
                            isInRange && !isStartDate && !isEndDate
                              ? "in-range"
                              : ""
                          } ${
                            isSelectedDate && !isInRange ? "selected-date" : ""
                          } ${hasExpenses ? "has-expenses" : ""}`}
                          onClick={(e) => handleDateClick(day, month, e)}
                          title={hasExpenses ? `Расходов: ${dayExpenses.count}, Сумма: ${dayExpenses.total.toLocaleString('ru-RU')} ₽` : undefined}
                        >
                          <span className="calendar-day-number">{day}</span>
                          {hasExpenses && (
                            <span className="calendar-day-expense-indicator">
                              {dayExpenses.count > 1 ? dayExpenses.count : '•'}
                            </span>
                          )}
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
  );
}

export default PeriodCalendar;


import { useState } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import Expenses from "./components/Expenses";
import ExpensesAnalysis from "./components/ExpensesAnalysis";
import logo from "./assets/logo.svg";
import "./App.css";

// Начальные данные для тестирования - потом будут приходить с бэкенда
const initialExpenses = [
  {
    id: 1,
    description: "Пятерочка",
    category: "Еда",
    date: "03.07.2024",
    amount: 3500,
  },
  {
    id: 2,
    description: "Яндекс Такси",
    category: "Транспорт",
    date: "03.07.2024",
    amount: 730,
  },
  {
    id: 3,
    description: "Аптека Вита",
    category: "Другое",
    date: "03.07.2024",
    amount: 1200,
  },
  {
    id: 4,
    description: "Бургер Кинг",
    category: "Еда",
    date: "03.07.2024",
    amount: 950,
  },
  {
    id: 5,
    description: "Деливери",
    category: "Еда",
    date: "02.07.2024",
    amount: 1320,
  },
  {
    id: 6,
    description: "Кофейня №1",
    category: "Еда",
    date: "02.07.2024",
    amount: 400,
  },
  {
    id: 7,
    description: "Бильярд",
    category: "Развлечения",
    date: "29.06.2024",
    amount: 600,
  },
  {
    id: 8,
    description: "Перекресток",
    category: "Еда",
    date: "29.06.2024",
    amount: 2360,
  },
  {
    id: 9,
    description: "Лукойл",
    category: "Транспорт",
    date: "29.06.2024",
    amount: 1000,
  },
  {
    id: 10,
    description: "Летуаль",
    category: "Другое",
    date: "29.06.2024",
    amount: 4300,
  },
  {
    id: 11,
    description: "Яндекс Такси",
    category: "Транспорт",
    date: "28.06.2024",
    amount: 320,
  },
  {
    id: 12,
    description: "Перекресток",
    category: "Еда",
    date: "28.06.2024",
    amount: 1360,
  },
  {
    id: 13,
    description: "Деливери",
    category: "Еда",
    date: "28.06.2024",
    amount: 2320,
  },
  {
    id: 14,
    description: "Вкусвилл",
    category: "Еда",
    date: "27.06.2024",
    amount: 1220,
  },
  {
    id: 15,
    description: "Кофейня №1",
    category: "Еда",
    date: "27.06.2024",
    amount: 920,
  },
  {
    id: 16,
    description: "Вкусвилл",
    category: "Еда",
    date: "26.06.2024",
    amount: 840,
  },
  {
    id: 17,
    description: "Кофейня №1",
    category: "Еда",
    date: "26.06.2024",
    amount: 920,
  },
];

function App() {
  // Состояние аутентификации - показываем форму входа или основной интерфейс
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // Переключатель между формой входа и регистрации
  const [isLogin, setIsLogin] = useState(true);
  // Текущая страница в авторизованном режиме
  const [currentPage, setCurrentPage] = useState("expenses");
  // Список всех расходов - поднимаем состояние наверх, чтобы делиться между компонентами
  const [expenses, setExpenses] = useState(initialExpenses);

  const switchToRegister = () => {
    setIsLogin(false);
  };

  const switchToLogin = () => {
    setIsLogin(true);
  };

  // Обработчик успешного входа
  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentPage("expenses"); // После входа сразу показываем страницу расходов
  };

  // Обработчик выхода - сбрасываем все состояния
  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsLogin(true); // Возвращаемся к форме входа
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  // Если не авторизован - показываем форму входа/регистрации
  if (!isAuthenticated) {
    return (
      <div className="app">
        <header className="header">
          <div className="header-content">
            <div className="logo">
              <img src={logo} alt="Skypro Wallet" />
            </div>
          </div>
        </header>
        <main className="main">
          {/* Переключаемся между формой входа и регистрации */}
          {isLogin ? (
            <Login
              onSwitchToRegister={switchToRegister}
              onLogin={handleLogin}
            />
          ) : (
            <Register onSwitchToLogin={switchToLogin} />
          )}
        </main>
      </div>
    );
  }

  // Основной интерфейс после авторизации
  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <img src={logo} alt="Skypro Wallet" />
          </div>
          {/* Навигация по страницам - центрирована */}
          <div className="header-nav">
            <button
              className={`nav-button ${
                currentPage === "expenses" ? "active" : ""
              }`}
              onClick={() => handleNavigate("expenses")}
            >
              Мои расходы
              {/* Подчеркивание для активной страницы */}
              {currentPage === "expenses" && (
                <div className="nav-underline"></div>
              )}
            </button>
            <button
              className={`nav-button ${
                currentPage === "analysis" ? "active" : ""
              }`}
              onClick={() => handleNavigate("analysis")}
            >
              Анализ расходов
              {currentPage === "analysis" && (
                <div className="nav-underline"></div>
              )}
            </button>
          </div>
          <button className="logout-button" onClick={handleLogout}>
            Выйти
          </button>
        </div>
      </header>
      <main className="main-expenses">
        {/* Переключаемся между страницами расходов и анализа */}
        {currentPage === "expenses" ? (
          <Expenses expenses={expenses} setExpenses={setExpenses} />
        ) : (
          <ExpensesAnalysis expenses={expenses} />
        )}
      </main>
    </div>
  );
}

export default App;

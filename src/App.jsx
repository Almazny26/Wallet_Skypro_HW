import { useState, useEffect } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import ExpensesPage from "./pages/ExpensesPage";
import ExpensesAnalysisPage from "./pages/ExpensesAnalysisPage";
import { getSession, saveSession, clearSession } from "./utils/auth";
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
  // Восстанавливаем состояние аутентификации из localStorage при загрузке
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const session = getSession();
    return session !== null;
  });
  // Переключатель между формой входа и регистрации
  const [isLogin, setIsLogin] = useState(true);
  // Текущая страница в авторизованном режиме
  const [currentPage, setCurrentPage] = useState("expenses");
  // Список всех расходов - поднимаем состояние наверх, чтобы делиться между компонентами
  const [expenses, setExpenses] = useState(initialExpenses);

  // Восстанавливаем сессию при загрузке приложения
  useEffect(() => {
    const session = getSession();
    if (session) {
      setIsAuthenticated(true);
      console.log('Сессия восстановлена для пользователя:', session.email);
    }
  }, []);

  const switchToRegister = () => {
    setIsLogin(false);
  };

  const switchToLogin = () => {
    setIsLogin(true);
  };

  // Обработчик успешного входа
  const handleLogin = (user) => {
    // Сохраняем сессию пользователя
    saveSession(user);
    setIsAuthenticated(true);
    setCurrentPage("expenses"); // После входа сразу показываем страницу расходов
  };

  // Обработчик успешной регистрации - автоматически входим
  const handleRegister = (user) => {
    // Сохраняем сессию пользователя
    saveSession(user);
    setIsAuthenticated(true);
    setIsLogin(true); // Переключаемся обратно на форму входа (на случай выхода)
    setCurrentPage("expenses"); // После регистрации сразу показываем страницу расходов
  };

  // Обработчик выхода - сбрасываем все состояния
  const handleLogout = () => {
    // Очищаем сессию
    clearSession();
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
            <Register 
              onSwitchToLogin={switchToLogin}
              onRegister={handleRegister}
            />
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
          <ExpensesPage expenses={expenses} setExpenses={setExpenses} />
        ) : (
          <ExpensesAnalysisPage expenses={expenses} />
        )}
      </main>
    </div>
  );
}

export default App;

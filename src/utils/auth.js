// Утилиты для работы с аутентификацией и хранением пользователей

// Ключ для хранения пользователей в localStorage
const USERS_STORAGE_KEY = 'skypro_wallet_users';
// Ключ для хранения текущей сессии пользователя
const CURRENT_SESSION_KEY = 'skypro_wallet_current_session';

// Учетные данные разработчика для быстрого входа (не требуют регистрации)
const DEVELOPER_EMAIL = 'developer@dev.com';
const DEVELOPER_PASSWORD = 'developer';

/**
 * Проверить, являются ли введенные данные учетными данными разработчика
 * @param {string} email - Email для проверки
 * @param {string} password - Пароль для проверки
 * @returns {boolean} true если это учетные данные разработчика
 */
const isDeveloperCredentials = (email, password) => {
  const normalizedEmail = email.trim().toLowerCase();
  return normalizedEmail === DEVELOPER_EMAIL.toLowerCase() && password === DEVELOPER_PASSWORD;
};

/**
 * Получить всех зарегистрированных пользователей из localStorage
 * @returns {Array} Массив пользователей
 */
export const getUsers = () => {
  try {
    const usersJson = localStorage.getItem(USERS_STORAGE_KEY);
    return usersJson ? JSON.parse(usersJson) : [];
  } catch (error) {
    console.error('Ошибка при чтении пользователей из localStorage:', error);
    return [];
  }
};

/**
 * Сохранить пользователя в localStorage
 * @param {Object} user - Объект пользователя { name, email, password }
 * @returns {boolean} true если пользователь успешно сохранен, false если email уже существует
 */
export const saveUser = (user) => {
  try {
    const users = getUsers();
    
    // Нормализуем email (приводим к нижнему регистру и убираем пробелы)
    const normalizedEmail = user.email.trim().toLowerCase();
    
    // Проверяем, не существует ли уже пользователь с таким email
    const existingUser = users.find(u => u.email.trim().toLowerCase() === normalizedEmail);
    if (existingUser) {
      console.warn('Пользователь с таким email уже существует:', normalizedEmail);
      return false; // Пользователь с таким email уже существует
    }
    
    // Добавляем нового пользователя (сохраняем email в нормализованном виде)
    users.push({
      id: Date.now(), // Простой ID на основе времени
      name: user.name.trim(),
      email: normalizedEmail,
      password: user.password, // В реальном приложении пароль должен быть захеширован!
    });
    
    // Сохраняем обновленный список пользователей
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    console.log('Пользователь успешно сохранен:', normalizedEmail);
    return true;
  } catch (error) {
    console.error('Ошибка при сохранении пользователя в localStorage:', error);
    return false;
  }
};

/**
 * Проверить, существует ли пользователь с указанными email и паролем
 * @param {string} email - Email пользователя
 * @param {string} password - Пароль пользователя
 * @returns {Object|null} Объект пользователя если найден, null если не найден
 */
export const authenticateUser = (email, password) => {
  try {
    // Проверяем, являются ли это учетные данные разработчика
    if (isDeveloperCredentials(email, password)) {
      console.log('Вход как разработчик');
      return {
        id: 'developer',
        name: 'Разработчик',
        email: DEVELOPER_EMAIL,
        password: DEVELOPER_PASSWORD
      };
    }

    const users = getUsers();
    // Нормализуем email для сравнения (приводим к нижнему регистру и убираем пробелы)
    const normalizedEmail = email.trim().toLowerCase();
    
    const user = users.find(
      u => u.email.trim().toLowerCase() === normalizedEmail && u.password === password
    );
    
    if (user) {
      console.log('Пользователь найден:', normalizedEmail);
    } else {
      console.log('Пользователь не найден. Email:', normalizedEmail, 'Всего пользователей:', users.length);
      console.log('Зарегистрированные email:', users.map(u => u.email));
    }
    
    return user || null;
  } catch (error) {
    console.error('Ошибка при аутентификации пользователя:', error);
    return null;
  }
};

/**
 * Проверить, существует ли пользователь с указанным email
 * @param {string} email - Email пользователя
 * @returns {boolean} true если пользователь существует, false если нет
 */
export const userExists = (email) => {
  try {
    const users = getUsers();
    // Нормализуем email для сравнения
    const normalizedEmail = email.trim().toLowerCase();
    return users.some(u => u.email.trim().toLowerCase() === normalizedEmail);
  } catch (error) {
    console.error('Ошибка при проверке существования пользователя:', error);
    return false;
  }
};

/**
 * Сохранить текущую сессию пользователя в localStorage
 * @param {Object} user - Объект пользователя
 */
export const saveSession = (user) => {
  try {
    // Сохраняем только необходимую информацию (без пароля)
    const sessionData = {
      id: user.id,
      name: user.name,
      email: user.email
    };
    localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(sessionData));
    console.log('Сессия сохранена:', sessionData.email);
  } catch (error) {
    console.error('Ошибка при сохранении сессии:', error);
  }
};

/**
 * Получить текущую сессию пользователя из localStorage
 * @returns {Object|null} Объект пользователя если сессия существует, null если нет
 */
export const getSession = () => {
  try {
    const sessionJson = localStorage.getItem(CURRENT_SESSION_KEY);
    if (!sessionJson) {
      return null;
    }
    return JSON.parse(sessionJson);
  } catch (error) {
    console.error('Ошибка при чтении сессии:', error);
    return null;
  }
};

/**
 * Очистить текущую сессию пользователя
 */
export const clearSession = () => {
  try {
    localStorage.removeItem(CURRENT_SESSION_KEY);
    console.log('Сессия очищена');
  } catch (error) {
    console.error('Ошибка при очистке сессии:', error);
  }
};


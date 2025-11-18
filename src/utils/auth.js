// Утилиты для работы с аутентификацией и хранением пользователей

// Ключ для хранения пользователей в localStorage
const USERS_STORAGE_KEY = 'skypro_wallet_users';

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
    
    // Проверяем, не существует ли уже пользователь с таким email
    const existingUser = users.find(u => u.email === user.email);
    if (existingUser) {
      return false; // Пользователь с таким email уже существует
    }
    
    // Добавляем нового пользователя
    users.push({
      id: Date.now(), // Простой ID на основе времени
      name: user.name,
      email: user.email,
      password: user.password, // В реальном приложении пароль должен быть захеширован!
    });
    
    // Сохраняем обновленный список пользователей
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
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
    const users = getUsers();
    const user = users.find(
      u => u.email === email && u.password === password
    );
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
    return users.some(u => u.email === email);
  } catch (error) {
    console.error('Ошибка при проверке существования пользователя:', error);
    return false;
  }
};


import foodIcon from "../assets/icons/category-food.svg";
import transportIcon from "../assets/icons/category-transport.svg";
import housingIcon from "../assets/icons/category-housing.svg";
import entertainmentIcon from "../assets/icons/category-entertainment.svg";
import educationIcon from "../assets/icons/category-education.svg";
import otherIcon from "../assets/icons/category-other.svg";
import "../components/Expenses.css";

// Список категорий с иконками
const categories = [
  { name: "Еда", icon: foodIcon },
  { name: "Транспорт", icon: transportIcon },
  { name: "Жилье", icon: housingIcon },
  { name: "Развлечения", icon: entertainmentIcon },
  { name: "Образование", icon: educationIcon },
  { name: "Другое", icon: otherIcon },
];

/**
 * Компонент выбора категории расхода
 * Отображает кнопки с иконками для выбора категории
 */
function CategorySelector({ selectedCategory, onCategoryChange, error, touched }) {
  return (
    <div className="form-field">
      <label>
        Категория
        {touched && error && <span className="error-asterisk"> *</span>}
      </label>
      <div className="category-buttons">
        {categories.map((category) => (
          <button
            key={category.name}
            type="button"
            className={`category-button ${
              selectedCategory === category.name ? "selected" : ""
            }`}
            onClick={() => onCategoryChange(category.name)}
          >
            <img src={category.icon} alt={category.name} />
            <span>{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default CategorySelector;


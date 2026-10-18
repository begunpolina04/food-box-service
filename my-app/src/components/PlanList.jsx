import { useState, useEffect } from "react";
import "./PlanList.css";

const initialPlans = [
  { id: 1, title: "Семейный бокс", price: 150, persons: 4, isActive: true },
  { id: 2, title: "Фитнес & Протеин", price: 127, persons: 1, isActive: true },
];

export default function PlanList() {
  const [isLoading, setIsLoading] = useState(true);

  const [plans, setPlans] = useState(() => {
    const saved = localStorage.getItem("plans");
    return saved ? JSON.parse(saved) : initialPlans;
  });

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [persons, setPersons] = useState("1");

  const [sortBy, setSortBy] = useState("default");

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const timeoutId = setTimeout(() => {
      localStorage.setItem("plans", JSON.stringify(plans));
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [plans, isLoading]);

  useEffect(() => {
    document.title = `Планы подписки (${plans.length})`;
  }, [plans]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !price) return;

    if (editingId !== null) {
      setPlans(
        plans.map((p) =>
          p.id === editingId
            ? {
                ...p,
                title: title.trim(),
                price: Number(price),
                persons: Number(persons),
              }
            : p,
        ),
      );
      setEditingId(null);
    } else {
      setPlans([
        ...plans,
        {
          id: Date.now(),
          title: title.trim(),
          price: Number(price),
          persons: Number(persons),
          isActive: true,
        },
      ]);
    }
    setTitle("");
    setPrice("");
    setPersons("1");
  };

  const handleDelete = (id) => setPlans(plans.filter((p) => p.id !== id));
  const handleEdit = (plan) => {
    setEditingId(plan.id);
    setTitle(plan.title);
    setPrice(plan.price);
    setPersons(plan.persons.toString());
  };
  const handleCancel = () => {
    setEditingId(null);
    setTitle("");
    setPrice("");
    setPersons("1");
  };
  const toggleActive = (id) =>
    setPlans(
      plans.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p)),
    );

  const sortedPlans = [...plans].sort((a, b) => {
    if (sortBy === "priceAsc") return a.price - b.price;
    if (sortBy === "priceDesc") return b.price - a.price;
    if (sortBy === "name") return a.title.localeCompare(b.title);
    return 0;
  });

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Загрузка планов подписки...</p>
      </div>
    );
  }

  return (
    <div className="plan-container">
      <h1 className="plan-title">Планы подписки</h1>

      {/* Форма добавления */}
      <form onSubmit={handleSubmit} className="plan-form">
        <input
          type="text"
          placeholder="Название плана"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="plan-input"
        />
        <input
          type="number"
          placeholder="Цена (BYN)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="plan-input"
          style={{ flex: "0 0 100px" }}
        />
        <select
          value={persons}
          onChange={(e) => setPersons(e.target.value)}
          className="plan-input"
          style={{ flex: "0 0 120px" }}
        >
          <option value="1">1 чел.</option>
          <option value="2">2 чел.</option>
          <option value="4">4 чел.</option>
        </select>
        <button type="submit" className="btn btn-add">
          {editingId ? "Сохранить" : "Добавить"}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={handleCancel}
            className="btn btn-cancel"
          >
            Отмена
          </button>
        )}
      </form>

      {/* Панель инструментов: Сортировка + Статистика */}
      <div className="toolbar">
        <div className="sort-group">
          <span className="sort-label">Сортировка:</span>
          <button
            onClick={() => setSortBy("default")}
            className={`btn btn-sort ${sortBy === "default" ? "active" : ""}`}
          >
            По умолчанию
          </button>
          <button
            onClick={() => setSortBy("priceAsc")}
            className={`btn btn-sort ${sortBy === "priceAsc" ? "active" : ""}`}
          >
            Сначала дешевле
          </button>
          <button
            onClick={() => setSortBy("priceDesc")}
            className={`btn btn-sort ${sortBy === "priceDesc" ? "active" : ""}`}
          >
            Сначала дороже
          </button>
          <button
            onClick={() => setSortBy("name")}
            className={`btn btn-sort ${sortBy === "name" ? "active" : ""}`}
          >
            По алфавиту
          </button>
        </div>
        <div className="stats-inline">
          Всего: <strong>{plans.length}</strong> | Активных:{" "}
          <strong>{plans.filter((p) => p.isActive).length}</strong>
        </div>
      </div>

      {/* Список планов */}
      {sortedPlans.length === 0 ? (
        <p className="empty-text">Планов пока нет. Добавьте первый!</p>
      ) : (
        <ul className="plans-list">
          {sortedPlans.map((plan) => (
            <li
              key={plan.id}
              className={`plan-card ${!plan.isActive ? "inactive" : ""}`}
            >
              <div className="plan-info">
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <span className="plan-name">{plan.title}</span>
                  <span
                    className={`status-badge ${plan.isActive ? "status-active" : "status-inactive"}`}
                  >
                    {plan.isActive ? "Активен" : "Скрыт"}
                  </span>
                </div>
                <span className="plan-price">
                  {plan.price} BYN / нед. • на {plan.persons} чел.
                </span>
              </div>
              <div className="plan-actions">
                <button
                  onClick={() => toggleActive(plan.id)}
                  className="btn btn-icon"
                >
                  {plan.isActive ? "Скрыть" : "Включить"}
                </button>
                <button
                  onClick={() => handleEdit(plan)}
                  className="btn btn-icon"
                >
                  Изменить
                </button>
                <button
                  onClick={() => handleDelete(plan.id)}
                  className="btn btn-icon btn-danger"
                >
                  Удалить
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

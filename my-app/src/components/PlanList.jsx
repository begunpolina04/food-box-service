import { useState, useEffect } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import PlanForm from "./PlanForm";
import PlanCard from "./PlanCard";
import "./PlanList.css";

const initialPlans = [
  { id: 1, title: "Семейный бокс", price: 150, persons: 4, isActive: true },
  { id: 2, title: "Фитнес & Протеин", price: 127, persons: 1, isActive: true },
];

export default function PlanList() {
  const [isLoading, setIsLoading] = useState(true);
  const [plans, setPlans] = useLocalStorage("plans", initialPlans);
  const [sortBy, setSortBy] = useState("default");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.title = `Планы подписки (${plans.length})`;
  }, [plans]);

  const handleSave = (formData) => {
    if (editingId !== null) {
      setPlans(
        plans.map((p) => (p.id === editingId ? { ...p, ...formData } : p)),
      );
      setEditingId(null);
    } else {
      setPlans([...plans, { id: Date.now(), ...formData, isActive: true }]);
    }
    setIsFormOpen(false);
  };

  const handleDelete = (id) => setPlans(plans.filter((p) => p.id !== id));

  const handleEdit = (plan) => {
    setEditingId(plan.id);
    setIsFormOpen(true);
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsFormOpen(false);
  };

  const toggleActive = (id) =>
    setPlans(
      plans.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p)),
    );

  const processedPlans = [...plans]
    .filter((p) => p.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "priceAsc") return a.price - b.price;
      if (sortBy === "priceDesc") return b.price - a.price;
      if (sortBy === "name") return a.title.localeCompare(b.title);
      return 0;
    });

  const editingPlan = plans.find((p) => p.id === editingId) || null;

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

      <button
        className="btn btn-add"
        onClick={() => {
          setEditingId(null);
          setIsFormOpen(true);
        }}
        style={{
          width: "100%",
          marginBottom: "20px",
          padding: "15px",
          fontSize: "16px",
        }}
      >
        + Добавить новый план
      </button>

      <div className="toolbar">
        <div className="sort-group">
          <input
            type="text"
            placeholder="Поиск по названию..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="plan-input"
            style={{ flex: "1", minWidth: "200px", padding: "8px 12px" }}
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="plan-input"
            style={{
              flex: "0 0 180px",
              padding: "8px 12px",
              cursor: "pointer",
            }}
          >
            <option value="default">По умолчанию</option>
            <option value="priceAsc">Сначала дешевле</option>
            <option value="priceDesc">Сначала дороже</option>
            <option value="name">По алфавиту</option>
          </select>
        </div>
        <div className="stats-inline">
          Всего: <strong>{plans.length}</strong> | Активных:{" "}
          <strong>{plans.filter((p) => p.isActive).length}</strong>
        </div>
      </div>

      {processedPlans.length === 0 ? (
        <p className="empty-text">
          Планов не найдено. Попробуйте изменить запрос.
        </p>
      ) : (
        <ul className="plans-list">
          {processedPlans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              onToggle={toggleActive}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </ul>
      )}

      {isFormOpen && (
        <PlanForm
          onSave={handleSave}
          editingPlan={editingPlan}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}

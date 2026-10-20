import { useState, useEffect } from "react";

export default function PlanForm({ onSave, editingPlan, onCancel }) {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [persons, setPersons] = useState("1");

  useEffect(() => {
    if (editingPlan) {
      setTitle(editingPlan.title);
      setPrice(editingPlan.price);
      setPersons(editingPlan.persons.toString());
    } else {
      setTitle("");
      setPrice("");
      setPersons("1");
    }
  }, [editingPlan]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !price) return;

    onSave({
      title: title.trim(),
      price: Number(price),
      persons: Number(persons),
    });
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{editingPlan ? "Редактировать план" : "Новый план подписки"}</h2>
          <button className="btn-close" onClick={onCancel}>
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Название плана</label>
            <input
              type="text"
              placeholder="Например, Витаминный"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="plan-input"
              required
            />
          </div>

          <div className="form-group">
            <label>Цена за неделю (BYN)</label>
            <input
              type="number"
              placeholder="150"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="plan-input"
              required
            />
          </div>

          <div className="form-group">
            <label>Количество человек</label>
            <select
              value={persons}
              onChange={(e) => setPersons(e.target.value)}
              className="plan-input"
            >
              <option value="1">1 чел.</option>
              <option value="2">2 чел.</option>
              <option value="4">4 чел.</option>
            </select>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onCancel} className="btn btn-cancel">
              Отмена
            </button>
            <button type="submit" className="btn btn-add">
              {editingPlan ? "Сохранить" : "Добавить"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

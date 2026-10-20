export default function PlanCard({ plan, onToggle, onEdit, onDelete }) {
  return (
    <li className={`plan-card ${!plan.isActive ? "inactive" : ""}`}>
      <div className="plan-info">
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
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
        <button onClick={() => onToggle(plan.id)} className="btn btn-icon">
          {plan.isActive ? "Скрыть" : "Включить"}
        </button>
        <button onClick={() => onEdit(plan)} className="btn btn-icon">
          Изменить
        </button>
        <button
          onClick={() => onDelete(plan.id)}
          className="btn btn-icon btn-danger"
        >
          Удалить
        </button>
      </div>
    </li>
  );
}

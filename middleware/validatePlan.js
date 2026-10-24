module.exports = (req, res, next) => {
  const { title, price, persons, description, composition } = req.body;
  const errors = [];

  if (!title || title.trim() === "") {
    errors.push("Название не может быть пустым.");
  } else if (title.trim().length < 3) {
    errors.push("Название должно содержать минимум 3 символа.");
  } else if (title.trim().length > 50) {
    errors.push("Название не должно превышать 50 символов.");
  }

  // Проверка цены (допускаются копейки, но не больше 2 знаков после точки/запятой)
  const parsedPrice = Number(price);
  if (!price || isNaN(parsedPrice) || parsedPrice <= 0) {
    errors.push("Цена должна быть больше нуля.");
  } else if (parsedPrice > 1000000) {
    errors.push("Цена не может быть больше 1 000 000.");
  } else {
    // Регулярное выражение: цифры, возможно точка/запятая и 1-2 цифры после
    const priceRegex = /^\d+([.,]\d{1,2})?$/;
    if (!priceRegex.test(price.toString())) {
      errors.push("Цена должна содержать не более 2 знаков после запятой.");
    }
  }

  const parsedPersons = Number(persons);
  if (!persons || isNaN(parsedPersons) || parsedPersons <= 0) {
    errors.push("Количество человек должно быть больше нуля.");
  } else if (!Number.isInteger(parsedPersons)) {
    errors.push("Количество человек должно быть целым числом.");
  }

  if (description && description.length > 500) {
    errors.push("Описание не должно превышать 500 символов.");
  }

  if (composition && composition.length > 500) {
    errors.push("Состав не должен превышать 500 символов.");
  }

  if (errors.length > 0) {
    return res.status(400).send(`
      <div style="font-family: sans-serif; padding: 40px; text-align: center; background: #FFF5EE; color: #4A3B32; height: 100vh;">
        <h2 style="color: #CD5C5C;">Ошибка валидации данных</h2>
        <ul style="list-style: none; padding: 0; font-size: 18px;">
          ${errors.map((err) => `<li>❌ ${err}</li>`).join("")}
        </ul>
        <a href="javascript:history.back()" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background: #FF7F50; color: white; text-decoration: none; border-radius: 8px;">Вернуться назад</a>
      </div>
    `);
  }

  next();
};

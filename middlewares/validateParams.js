const validateNumberParam = (req, res, next) => {
  const { number } = req.params;
  if (isNaN(number) || number <= 0 || number > 826) {
    return res
      .status(400)
      .json({ error: "The param must be a number between 1 and 826" });
  }
  next();
};

module.exports = {
  validateNumberParam,
};

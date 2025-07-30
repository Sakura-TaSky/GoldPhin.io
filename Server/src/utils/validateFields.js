export const validateFields = (res, fields) => {
  for (const [key, value] of Object.entries(fields)) {
    if (!value) {
      res.status(400).json({
        success: false,
        message: `${key} is required.`,
      });
      return false;
    }
  }
  return true;
};

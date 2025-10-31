export function errorHandler(err, req, res, next) {
  console.error('Error:', err);
  const status = err.statusCode || 500;
  const message = err.message || 'Server error';
  res.status(status).json({ ok: false, message });
}

export const asyncWrap = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
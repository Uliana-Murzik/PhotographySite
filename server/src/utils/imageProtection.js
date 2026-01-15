const crypto = require('crypto');

const SECRET = process.env.IMAGE_SECRET || process.env.JWT_SECRET || 'default-secret-key';
const TOKEN_EXPIRY = 60 * 60 * 1000; // 1 час

/**
 * Генерирует подписанный токен для доступа к изображению
 */
function generateImageToken(imageId) {
  const payload = {
    id: imageId,
    exp: Date.now() + TOKEN_EXPIRY,
  };

  const signature = crypto
    .createHmac('sha256', SECRET)
    .update(JSON.stringify(payload))
    .digest('hex');

  return Buffer.from(JSON.stringify({ ...payload, sig: signature })).toString('base64url');
}

/**
 * Проверяет валидность токена
 */
function verifyImageToken(token) {
  try {
    const decoded = Buffer.from(token, 'base64url').toString('utf-8');
    const payload = JSON.parse(decoded);

    // Проверка истечения
    if (payload.exp < Date.now()) {
      return null;
    }

    // Проверка подписи
    const { sig, ...data } = payload;
    const expectedSig = crypto
      .createHmac('sha256', SECRET)
      .update(JSON.stringify(data))
      .digest('hex');

    if (sig !== expectedSig) {
      return null;
    }

    return payload.id;
  } catch (error) {
    return null;
  }
}

/**
 * Middleware для проверки доступа к изображению
 */
function protectImageAccess(req, res, next) {
  const { id } = req.params;
  const token = req.query.token;
  const referer = req.get('referer') || req.get('referrer');

  // Разрешаем доступ если:
  // 1. Есть валидный токен
  // 2. Или referer с нашего домена
  const allowedReferers = [
    'http://localhost:5173',
    'http://localhost:4173',
    'http://localhost:3000',
  ];

  const isAllowedReferer = referer && allowedReferers.some((allowed) => referer.startsWith(allowed));

  if (token) {
    const imageId = verifyImageToken(token);
    if (imageId === id) {
      return next();
    }
  }

  if (isAllowedReferer) {
    return next();
  }

  // Блокируем прямой доступ
  res.status(403).json({ error: 'Direct access to images is not allowed' });
}

module.exports = {
  generateImageToken,
  verifyImageToken,
  protectImageAccess,
};


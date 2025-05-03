const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Access token required' });
  try{
      jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid or expired token' });
    
        req.user = user; 
        next();
      });
  }catch(err){
    console.error('Invalid token', err);
    return res.status(401).json({ message: 'Invalid token.' });
  }
};

module.exports = verifyToken;

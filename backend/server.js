require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const signupRoute = require('./routes/signup');
const userRoute = require('./routes/users');
const loginRoute = require('./routes/login');
const TokenRoute = require('./routes/token');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/signup', signupRoute);
app.use('/api/users', userRoute);
app.use('/api/login', loginRoute);
app.use('/api/verifyToken', TokenRoute);

app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});

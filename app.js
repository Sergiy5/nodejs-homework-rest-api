const express = require('express')
const morgan = require('morgan')
const dotenv = require('dotenv');
const cors = require('cors')
const mongoose = require('mongoose')
const app = express()

const envPath =
  process.env.NODE_ENV === "production"
    ? "./environments/production.env"
    : "./environments/development.env";

dotenv.config({ path: envPath })

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

if (process.env.NODE_ENV === 'development') app.use(morgan(formatsLogger));

const contactsRoutes = require('./routes/api/contacts')
const authRoutes = require('./routes/api/authRoutes');

/**
 * MONGODB CONNECTION=============================
 */

mongoose.connect(process.env.MONGO_URL).then((conn) =>
  console.log('Mongo DB successfully connection'))
  .catch((error) => {
  console.log(error);
// "1" Це статус код
  process.exit(1);
  })

/**
 *  MIDDLEWARES============================
 */
app.use(cors())
app.use(express.json())
app.use('/api/contacts', contactsRoutes)
app.use("/api/users", authRoutes);
/**
 * Not found request handler.
 */
app.all('*', (req, res) => {
  res.status(404).json({ msg: 'Resource not found' })
});
/**
 * Globalerror handler. Four arguments REQUIRED!!
 */
app.use((err, req, res, next) => {
  console.log('ERROR'.blue, err)
  res.status(err.status || 500).json({ msg: err.message });
})

module.exports = app

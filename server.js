const app = require('./app')
require("colors");


app.listen(3000, () => {
  console.log("Server running. Use our API on port: 3000".blue)
})

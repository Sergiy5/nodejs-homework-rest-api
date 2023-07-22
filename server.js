const app = require('./app')
require("colors");
const port = process.env.PORT;

app.listen(port, () => {
  console.log("Server running. Use our API on port: 3000".blue);
});

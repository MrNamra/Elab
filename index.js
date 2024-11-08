const app = require("express")();
require('dotenv').config()
require('./database/db')
const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.set('view engine', 'ejs')
app.set('views', './views');

const PORT = process.env.PORT || 3001

app.get('/', (req, res) => {
  res.render('index', { title: 'Hello World!' });

});
app.listen(PORT, () => {
    console.log("Server Running on PORT: ",PORT)
})
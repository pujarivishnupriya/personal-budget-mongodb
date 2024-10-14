const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express()
const port = 3000;

const budgetModel = require("./budgetData")
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
let url = 'mongodb://127.0.0.1:27017/bugdetCharts';
app.use('/', express.static('public'));

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(()=>{
            console.log("Connected to Database")
        })
        .catch((connectionError)=>{
            console.log(connectionError)
        })

app.get('/hello',(req, res) =>{
    res.send('Hello World!');
});

app.get('/budget', async (req, res) => {
    try {
        const budgetData = await budgetModel.find({});
        const formattedBudgetData = budgetData.map(item => ({
            title: item.title,
            budget: item.budget,
            color: item.color
        }));
        res.json({ myBudget: formattedBudgetData });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/addBudget', async (req, res) => {
    try {
      const { title, budget, color } = req.body;
      const newBudget = new budgetModel({ title, budget, color });
      const savedBudget = await newBudget.save();
      res.json(savedBudget);
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: 'Invalid Data' });
    }
  });

app.listen(port, () => {
    console.log('Example app listening at http://localhost:'+port);
});
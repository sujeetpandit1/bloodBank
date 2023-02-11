const express = require('express');
const app = express();
const mongoose = require('mongoose');
const route  = require('./routes/route');


mongoose.set('strictQuery', true);

mongoose.connect('mongodb+srv://isuzu:xxxxxxxxxxxxx@cluster0.rs68oil.mongodb.net/bloodbank1', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {console.log('MongoDB is Connected')})
.catch((err) => {console.log(err.message)});

app.use(express.json());


app.use('/', route)

app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
  });
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const path = require("path")

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI || process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true }
);
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
});

const eventsRouter = require('./routes/events');
const usersRouter = require('./routes/users');

app.use('/events', eventsRouter);
app.use('/users', usersRouter);

const confirmationRouter = require('./routes/confirmation');
const resendRouter = require('./routes/resend');

app.use('/confirmation', confirmationRouter);
app.use('/resend', resendRouter);


app.use(express.static(path.join(__dirname, "client", "build")))


app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

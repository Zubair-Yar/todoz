const express = require('express');
const app = express();
const cors = require('cors');

//=========
// routes
//=========
const tasksRoutes   = require('./routes/tasks');
const doneRoutes   = require('./routes/done');
//=========
//=========

app.use(cors());


app.use('/api/tasks', tasksRoutes);
app.use('/api/done', doneRoutes);



app.listen(80, () => {
    console.log(`Server started-----------------`);
});




const express = require('express');
const router = express.Router();
const db = require('../db');
const bodyParser = require('body-parser');


router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));







router.get('/', async (req, res) => {

    let result = await db.query('SELECT * FROM tasks ORDER BY ID DESC');
    res.send(result);

});




router.get('/:id', async (req, res) => {

    let result = await db.query('SELECT * FROM tasks WHERE id = ?', [req.params.id]);
    res.send(result);

});



router.post('/',  async (req, res) => {
    
    let result = await db.query(`INSERT INTO tasks(task, description) VALUES(?, ?)`,[req.body.task, req.body.description]);
    res.send(result);

});




router.put('/:id', async (req, res) => {

    let result = await db.query('UPDATE tasks SET task = ?, description = ? WHERE id = ? ',[req.body.task, req.body.description, req.params.id]);
    res.send(result);

});




router.delete('/:id', async (req, res) => {

    let result = await db.query(`DELETE FROM tasks WHERE id = ?`,[req.params.id]);
    res.send(result);

});



module.exports = router;
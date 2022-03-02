const express = require('express');
const axios = require('axios').default;
const mysql = require('mysql');

const app = express();
const PORT = 3000;

const config = {
    host: 'db',
    user: 'root',
    database: 'nodedb',
    password: 'root',
};

app.get('/', async (req, res) => {
    const connection = mysql.createConnection(config);

    const createTable = `CREATE TABLE IF NOT EXISTS people (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255) NOT NULL);`
    connection.query(createTable);

    // await addMultiplePeople();
    await addPeople();

    const getUsersQuery = `SELECT id, name FROM people`;
    connection.query(getUsersQuery, (error, results, fields) => {
        if (error) {
            throw error
        };

        let list = '<ul>';
        for (let people of results) {
            list += `<li>${people.name}</li>`;
        }

        list += '</ul>';
        res.send('<h1>Full Cycle Rocks!</h1>' + list);
    });
    connection.end();

    async function addPeople() {
        const RANDOM = Math.floor(Math.random() * 10);
        const response = await axios.get('https://swapi.dev/api/people');
        const personName = response.data.results[RANDOM].name;
        console.log('Insert People : ' + personName)
        const insertQuery = `INSERT INTO people(name) values('${personName}')`;
        connection.query(insertQuery);
    }

    async function addMultiplePeople() {

        const deleteQuery = `DELETE FROM people WHERE name is not null`;
            connection.query(deleteQuery);

        for (let i = 0; i < Math.floor(Math.random() * 20); i++) {
            const RANDOM = Math.floor(Math.random() * 10);
            const response = await axios.get('https://swapi.dev/api/people');
            const personName = response.data.results[RANDOM].name;
            console.log('Insert People : ' + personName)
            const insertQuery = `INSERT INTO people(name) values('${personName}')`;
            connection.query(insertQuery);
        }
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
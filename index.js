const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

const { Pool } = require('pg');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});


express()
.use(express.static(path.join(__dirname, 'public')))
.get('/link/:name', async (req, res) => {
    try {
        const client = await pool.connect();
        console.log(req.params.name.toLocaleLowerCase());
        const result = await client.query('SELECT * FROM linkings WHERE name = $1', [
            req.params.name.toLocaleLowerCase()
        ]);
        if(!result) {
            res.status(404);
        } else {
            const obj = result.rows[0];
            if(!obj) {
                res.status(404);
            } else {
                if(obj.read) {
                    res.send({
                        read: true
                    });
                } else {
                    res.send({
                        link: obj.link
                    });

                    // Set as already read
                    await client.query('UPDATE linkings SET read = true WHERE name = $1', [
                        req.params.name.toLocaleLowerCase()
                    ]);
                }
            }
        }

        client.release();
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
})
.listen(PORT, () => console.log(`Listening on ${ PORT }`))

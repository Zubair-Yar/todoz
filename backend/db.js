const mariadb = require('mariadb');

const pool = mariadb.createPool({
    
    host: 'localhost',
    database: 'todoz',
    user: 'root',
    password: 'class123',
    connectionLimit: 1
    
});




 query = async(...args) => {

    let conn;
    try {
        conn = await pool.getConnection();
        let result = await conn.query(...args);

        return result;
    } catch (error) {
        
        console.log(error);
    }finally{
        if(conn)
            conn.end();
    }

}

exports.query = query;

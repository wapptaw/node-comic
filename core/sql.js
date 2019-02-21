const mysql = require('mysql')

class ComicSql {
  constructor ({host, user, password, database}) {
    this.connection = mysql.createConnection({
      host,
      user,
      password,
      database
    })
  }

  connect () { // 开始连接
    this.connection.connect(err => {
      if (err) {
        console.error('error: ' + err.message)
      } else {
        console.log('Connected to the MySql server')
      }
    })
  }

  end () {
    this.connection.end(err => { // 断开连接
      if (err) {
        console.error('error: ' + err.message)
      } else {
        console.log('Close the database connection')
      }
    })
  }

  createTable (table_name, option) { // 创建表
    let sql = `CREATE TABLE IF NOT EXISTS ${table_name} (
      ${option}
    )`
    this.connection.query(sql, err => {
      if (err) {
        console.error(err.message)
      } else {
        console.log(`数据表${table_name}创建成功`)
      }
    })
  }

  insertInto (table_name, ...key, ...value) {
    let sql = `INSERT INTO ${table_name} ()`
  }
}

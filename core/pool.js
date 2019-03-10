const mysql = require('mysql')

class Pool {
  constructor ({connectionLimit, host, user, password, database}) {
    this.pool = mysql.createPool({
      connectionLimit,
      host,
      user,
      password,
      database
    })
  }

  getConnection () { // 连接
    return new Promise((resolve, reject) => {
      this.pool.getConnection((err, connection) => {
        if (err) {
          console.log('连接失败：' + err)
          reject(err)
        } else {
          console.log('连接成功')
          resolve(connection)
        }
      })
    })
  }

  query (connection, sql, values = null, closeable = false) { // 查询
    try {
      return new Promise((resolve, reject) => {
        connection.query(sql, values, (err, rows) => {
          if (err) {
            reject(err)
            console.log('操作失败: ' + err)
            if (closeable) connection.release()
          } else {
            resolve(rows)
            console.log('操作成功')
            if (closeable) connection.release()
          }
        })
      })
    } catch (err) {
      throw new Error(err)
    }
  }

  release (connection) { // 释放
    console.log('释放连接')
    connection.release()
  }

  end () { // 关闭连接池
    try {
      return new Promise((resolve, reject) => {
        this.pool.end(err => {
          if (err) {
            reject(err)
          } else {
            console.log('连接池关闭')
            resolve()
          }
        })
      })
    } catch (e) {
      throw new Error(e)
    }
  }
}

module.exports = Pool

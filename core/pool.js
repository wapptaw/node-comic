const mysql = require('mysql')

class Pool {
  constructor (option) {
    this.pool = mysql.createPool(option)
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

  async query (connection, sql, values = null, closeable = false) { // 查询
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

  end () { // 关闭
    this.pool.end(err => {
      if (err) {
        console.log('关闭连接池出错：' + err.message)
      }
      console.log('关闭连接池成功')
    })
  }
}

module.exports = Pool

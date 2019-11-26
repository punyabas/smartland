const USER_AUTH_SECRET = process.env.USER_AUTH_SECRET || 'asfdaskdjcruasfjasd';

// const DATABASE = {
//     host: 'localhost',
//     port: '3306',
//     user: 'root',
//     password: 'babas',
//     database: 'smartland'
//   }

  const DATABASE = {
    host: 'remotemysql.com',
    port: '3306',
    user: 'eokgLtzYEt',
    password: 'GKSHK2Gix7',
    database: 'eokgLtzYEt'
  }

  module.exports={DATABASE, USER_AUTH_SECRET}
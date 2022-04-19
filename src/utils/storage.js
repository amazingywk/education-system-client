/**
 * 进行local数据存储管理的工具模块
 */

 const USER_KEY = 'user_key'
 
 const storage = {
     /**
      * store user
      * read user
      * delete user
      */
     saveUser(user){
         localStorage.setItem(USER_KEY,JSON.stringify(user))
     },
 
     getUser(){
         return JSON.parse(localStorage.getItem(USER_KEY)||'{}')
     },
 
     removeUser(){
         localStorage.removeItem(USER_KEY)
     },
 
    //  saveToken(token){
    //      localStorage.setItem(TOKEN_KEY,token)
    //  },
 
    //  getToken(){
    //      return localStorage.getItem(TOKEN_KEY||'')
    //  },
 
    //  removeToken(){
    //      localStorage.removeItem(TOKEN_KEY)
    //  }
 }
 
 export default storage
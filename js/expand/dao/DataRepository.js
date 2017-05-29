/**
 * Created by huozhenwei on 2017/5/29.
 */

//数据操作
export default class DataRepository{

    //发起网络请求,返回数据
    fetchNetRepository(url){
        //需要向调用者返回Promise对象, 把服务器返回的信息告诉调用者
        return new Promise((resolve,reject)=> {
            //向服务器发起请求
            fetch(url)
                .then(response=>response.json())
                .then(result=>{
                    //请求成功, 把返回信息告诉调用者
                    resolve(result);
                })
                .catch(error=>{
                    //请求失败,捕捉到信息告诉调用者
                    reject(error);
                })
        })
    }

}
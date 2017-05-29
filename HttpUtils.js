/**
 * Created by huozhenwei on 2017/5/28.
 */

export default class HttpUtils{
    //封装get请求
    static get(url){
        //需要向调用者返回Promise对象, 把服务器返回的信息告诉调用者
        return new Promise((resolve,reject)=>{
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

    //封装post请求
    static post(url, params){
        return new Promise((resolve,reject)=>{
            fetch(url,{
                method:'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(params)
            })
                .then(response=>response.json())
                .then(result => {
                    resolve(result);
                })
                .catch(error=> {
                    reject(error);
                })
        })
    }

}
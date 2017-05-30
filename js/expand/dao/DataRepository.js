/**
 * Created by huozhenwei on 2017/5/29.
 */
import {
    AsyncStorage
} from 'react-native';
//数据操作
export default class DataRepository{

    //获取数据->缓存数据or网络数据
    fetchRepository(url){
        return new Promise((resolve,reject)=>{
            //获取本地数据
            this.fetchLocalRepository(url)
                .then(result=>{
                    if(result){
                        resolve(result);
                    }
                    else{
                        //本地没有数据,发起网络请求
                        this.fetchNetRepository(url)
                            .then(result=>{
                                resolve(result);
                            })
                            .catch(e=>{
                                reject(e);
                            })
                    }
                })
                .catch(e=>{
                    this.fetchNetRepository(url)
                        .then(result=>{
                            resolve(result);
                        })
                        .catch(e=>{
                            reject(e);
                        })
                })
        })
    }

    /**
     * 获取本地数据
     * @param url
     * @returns {Promise}
     */
    fetchLocalRepository(url){
        return new Promise((resolve,reject)=>{
            AsyncStorage.getItem(url,(error,result)=>{
                if(!error){
                    try {
                        resolve(JSON.parse(result));
                    }
                    catch (e){
                        reject(e);
                    }
                }
                else{
                    reject(e);
                }
            });
        })
    }

    /**
     * 发起网络请求,返回数据
     * @param url
     * @returns {Promise}
     */
    fetchNetRepository(url){
        //需要向调用者返回Promise对象, 把服务器返回的信息告诉调用者
        return new Promise((resolve,reject)=> {
            //向服务器发起请求
            fetch(url)
                .then(response=>response.json())
                .then(result=>{
                    if(!result){
                        reject(new Error('responseData is null'));
                        return;
                    }
                    //请求成功, 把返回信息告诉调用者
                    resolve(result.items);
                    //保存数据
                    this.saveRepository(url,result.items);
                })
                .catch(error=>{
                    //请求失败,捕捉到信息告诉调用者
                    reject(error);
                })
        })
    }

    /**
     *
     * @param url  作为key
     * @param items
     * @param callBack
     */
    saveRepository(url, items,callBack){
        if(!url || !items) return;
        //加个时间戳,用于校验数据是否过期
        let wrapData = {items:items, update_date:new Date().getTime()};
        AsyncStorage.setItem(url, JSON.stringify(wrapData), callBack);
    }

    /**
     * 判断数据是否过时
     * @param longTime 数据的时间戳(保存在数据库的时间)
     * @returns {boolean}
     */
    checkData(longTime){
        return false;
        let cDate = new Date();
        let tDate = new Date(); //目标日期
        tDate.setTime(longTime); //以毫秒设置 Date 对象
        if(cDate.getMonth() !== tDate.getMonth()) return false;
        if(cDate.getDay() !== tDate.getDay()) return false;
        //超过4个小时
        if(cDate.getHours() - tDate.getHours() > 4) return false;
        return true;
    }

}
/**
 * Created by huozhenwei on 2017/5/29.
 */
import {
    AsyncStorage
} from 'react-native';
import GitHubTrending from 'GitHubTrending';
/**
 * 数据操作(本地读取,网络请求,缓存)
 */
//用于标识Popular模块还是Trending模块使用
export var FLAG_STORAGE ={flag_popular:'popular',flag_trending:'trending',flag_my:'my'};
export default class DataRepository{
    //flag调用者传入
    constructor(flag){
        this.flag = flag;
        if(flag === FLAG_STORAGE.flag_trending){
            this.trending = new GitHubTrending();
        }
    }

    //获取数据->缓存数据or网络数据
    fetchRepository(url){
        return new Promise((resolve,reject)=>{
            //获取本地数据
            this.fetchLocalRepository(url)
                .then((result)=>{
                    if(result){
                        resolve(result);
                    }
                    else{
                        //本地没有数据,发起网络请求
                        this.fetchNetRepository(url)
                            .then((data)=>{
                                resolve(data);
                            })
                            .catch((e)=>{
                                reject(e);
                            })
                    }
                })
                .catch((e)=>{
                    this.fetchNetRepository(url)
                        .then((data)=>{
                            resolve(data);
                        })
                        .catch((e)=>{
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
                    reject(error);
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
            if(this.flag !== FLAG_STORAGE.flag_trending){
                //向服务器发起请求
                fetch(url)
                    .then((response)=>response.json())
                    .then((result)=>{
                        if(this.flag === FLAG_STORAGE.flag_my && result){
                            this.saveRepository(url,result);
                            resolve(result);
                        }
                        else if(result && result.items){
                            //请求成功, 把返回信息告诉调用者
                            resolve(result.items);
                            //保存数据
                            this.saveRepository(url,result.items);
                        }
                        else {
                            reject(new Error('responseData is null'));
                        }
                    })
                    .catch((error)=>{
                        //请求失败,捕捉到信息告诉调用者
                        reject(error);
                    })
            }
            else {
                this.trending.fetchTrending(url)
                    .then((result)=>{
                        if(!result){
                            reject(new Error('responseData is null'));
                            return;
                        }
                        resolve(result);
                        this.saveRepository(url,result);
                    })
                    .catch((error)=>{
                        reject(error);
                    })
            }
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
        let wrapData;
        //加个时间戳,用于校验数据是否过期
        if(this.flag === FLAG_STORAGE.flag_my){
            wrapData = {item:items, update_date:new Date().getTime()};
        }
        else{
            wrapData = {items:items, update_date:new Date().getTime()};
        }
        AsyncStorage.setItem(url, JSON.stringify(wrapData), callBack);
    }

}
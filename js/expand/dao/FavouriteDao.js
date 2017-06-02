/**
 * Created by huozhenwei on 2017/6/2.
 */
import {
    AsyncStorage
} from 'react-native';
/**
 *  最热,趋势,收藏模块公用
 */
const FAVOURITE_KEY_PREFIX = 'favourite_';
export default class FavouriteDao{

    constructor(flag){
        this.flag = flag;
        this.favouriteKey = FAVOURITE_KEY_PREFIX + flag;
    }

    /**
     * 获取所有本应用可以访问到的数据
     * @returns {Promise}
     */
    getAllData(){
        return new Promise((resolve,reject)=>{
            AsyncStorage.getAllKeys((error,result)=>{
                if(!error){
                    try{
                        resolve(result);
                    }
                    catch (e) {
                        reject(e);
                    }
                }
                else{
                    reject(error);
                }
            })
        })
    }


    /**
     * 收藏项目,保存收藏的项目
     * @param key 项目ID或名称
     * @param value 收藏的项目
     * @param callBack
     */
    saveFavouriteItem(key,value,callBack){
        AsyncStorage.setItem(key,value,(error)=>{
            if(!error){
                this.updateFavouriteKeys(key,true);
            }
        })
    }

    /**
     * 取消收藏,移除已经收藏的项目
     * @param key
     */
    removeFavouriteItem(key){
        AsyncStorage.removeItem(key,(error)=>{
            if(!error){
                this.updateFavouriteKeys(key,false);
            }
        })
    }

    /**
     * 获取收藏的项目对应的key
     * @returns {Promise}
     */
    getFavouriteKeys(){
        return new Promise((resolve,reject)=>{
            AsyncStorage.getItem(this.favouriteKey,(error,result)=>{
                if(!error){
                    try{
                        resolve(JSON.parse(result));
                    }
                    catch (e) {
                        reject(e);
                    }
                }
                else{
                    reject(error);
                }
            })
        })
    }

    /**
     * 更新 Favourite Key 集合
     * @param key
     * @param isAdd  true 收藏/添加, false 取消收藏/删除
     */
    updateFavouriteKeys(key,isAdd){
        //取出所有已保存项目key
        AsyncStorage.getItem(this.favouriteKey,(error,result)=>{
            if(!error){
                var favouriteKeys = [];
                if(result){
                    favouriteKeys = JSON.parse(result);
                }
                var index = favouriteKeys.indexOf(key);
                //收藏
                if(isAdd){
                    //在集合中没有才添加
                    if(index === -1){
                        favouriteKeys.push(key);
                    }
                }
                else{
                    //取消收藏
                    if(index !== -1){
                        favouriteKeys.splice(index,1);
                    }
                }
                //重新保存,覆盖?
                AsyncStorage.setItem(this.favouriteKey,JSON.stringify(favouriteKeys));
            }
        })
    }

}
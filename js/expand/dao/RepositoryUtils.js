/**
 * Created by huozhenwei on 2017/6/4.
 */
import {
    AsyncStorage
}from 'react-native';
import DataRepository,{FLAG_STORAGE} from './DataRepository';
import Utils from '../../util/Utils';

export default class RepositoryUtils{
    constructor(aboutCommon){
        this.aboutCommon = aboutCommon;
        this.dataRepository = new DataRepository(FLAG_STORAGE.flag_my);
        this.itemMap = new Map();
    }

    /**
     * 更新数据
     * @param k
     * @param v
     */
    updateData(k,v){
        this.itemMap.set(k,v);
        var arr = [];
        for(var value of this.itemMap.values()){
            arr.push(value);
        }
        this.aboutCommon.onNotifyDataChanged(arr);
    }
    /**
     * 获取指定URL下的数据
     * @param url
     */
    fetchRepository(url){
        this.dataRepository.fetchRepository(url)
            .then(result=>{
                if(result){
                    this.updateData(url,result);
                    //数据过时,重新获取
                    if(result.update_date && !Utils.checkData(result.update_date)){
                        return this.dataRepository.fetchNetRepository(url);
                    }
                }
            })
            .then((item)=>{
                //此链用于接收数据过时,重新发起的网络请求返回的Promise
                if(item){
                    this.updateData(url,item);
                }
            })
            .catch(e=>{

            })
    }

    /**
     * 批量获取urls对应的数据
     * @param urls
     */
    fetchRepositorys(urls){
        for(let i=0,len=urls.length;i<len;i++){
            var url = urls[i];
            this.fetchRepository(url);
        }
    }

}
/**
 * Created by huozhenwei on 2017/5/29.
 */

import React,{Component} from 'react';
import {
    AsyncStorage
} from 'react-native';
import keys from '../../../res/data/keys.json'; //json文件导入进来后是对象

export var FLAG_LANGUAGE = {flag_language: 'flag_language_language', flag_key: 'flag_language_key'};
export default class LanguageDao {

    constructor(flag) {
        //标记哪个模块调用
        this.flag = flag;
    }

    //从数据库读取自定义标签
    fetch(){
        return new Promise((resolve, reject)=>{
            //第二个参数 result 即为对应内容
            AsyncStorage.getItem(this.flag,(error,result)=>{
                if(error){
                    reject(error);
                }
                else{
                    if(result){
                        try {
                            resolve(JSON.parse(result));
                        }
                        catch (e){
                            reject(e);
                        }
                    }
                    else{
                        /**
                         * 用户第一次启动,从数据库中肯定读取不到this.flag对应的语言标签内容;
                         * 需要把keys.json默认数据存到数据库中;
                         */
                        var data = this.flag === FLAG_LANGUAGE.flag_key ? keys: null;
                        this.save(data); //保存数据
                        resolve(data);
                    }
                }
            })
        })
    }

    save(data){
        AsyncStorage.setItem(this.flag, JSON.stringify(data), (error)=>{
            if(error){
                
            }
            else{

            }
        })
    }

}
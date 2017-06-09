/**
 * Created by huozhenwei on 2017/6/9.
 */
import {
    AsyncStorage
} from 'react-native';
import ThemeFactory,{ThemeFlags} from '../../../res/styles/ThemeFactory';
const THEME_KEY = 'theme_key'; //主题保存在数据库的标识
export default class ThemeDao {

    /**
     * 获取当前的主题
     * @returns {Promise}
     */
    getTheme(){
        return new Promise((resolve, reject)=>{
            AsyncStorage.getItem(THEME_KEY,(error,result)=>{
                if(error){
                    reject(error);
                    return;
                }
                if(!result){
                    //app第一次启动主题是空的,设置默认主题
                    this.save(ThemeFlags.Default);
                    result = ThemeFlags.Default;
                }
                resolve(ThemeFactory.createTheme(result));
            })
        })
    }

    /**
     * 保存主题标识
     * @param themeFlag
     */
    save(themeFlag){
        AsyncStorage.setItem(THEME_KEY,themeFlag,(error=>{}))
    }

}
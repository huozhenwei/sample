/**
 * Created by huozhenwei on 2017/6/5.
 */

import RepositoryDetail from '../pages/RepositoryDetail';
import {FLAG_STORAGE} from '../expand/dao/DataRepository';
export default class ActionUtils{

    /**
     * 跳转到详情页
     * @param params 要传递的一些参数
     */
    static onSelectRepository(params){
        var {navigator} = params;
        navigator.push({
            component:RepositoryDetail,
            params:{
                ...params
            }
        });
    }

    /**
     * favouriteIcon的单击回调函数
     * @param item
     * @param isFavourite
     */
    static onFavourite(favouriteDao,item,isFavourite, flag){
        var key = flag===FLAG_STORAGE.flag_trending ? item.fullName : item.id.toString();
        if(isFavourite){
            favouriteDao.saveFavouriteItem(key,JSON.stringify(item));
        }
        else {
            favouriteDao.removeFavouriteItem(key);
        }
    }
}
/**
 * Created by huozhenwei on 2017/6/5.
 */

import RepositoryDetail from '../pages/RepositoryDetail';
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
}
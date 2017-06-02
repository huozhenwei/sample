/**
 * Created by huozhenwei on 2017/6/2.
 */


export default class Utils{

    /**
     * 检查该Item 有没有被收藏过
     * @param item
     * @param items  已收藏项目的keys集合
     * @returns {boolean}
     */
    static checkFavourite(item,items){
        for (var i = 0, len = items.length; i < len; i++) {
            let id=item.id? item.id:item.fullName;
            if (id.toString() === items[i]) {
                return true;
            }
        }
        return false;
    }
}
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

    /**
     * 检查项目更新时间
     * @param longTime 项目更新时间
     * @returns {boolean} true不需要更新, false需要更新
     */
    static checkData(longTime){
        // return false;
        let cDate = new Date(); //当前时间
        let tDate = new Date(); //目标日期
        tDate.setTime(longTime); //以毫秒设置 Date 对象
        if(cDate.getMonth() !== tDate.getMonth()) return false;
        if(cDate.getDay() !== tDate.getDay()) return false;
        //超过4个小时
        if(cDate.getHours() - tDate.getHours() > 4) return false;
        return true;
    }
}
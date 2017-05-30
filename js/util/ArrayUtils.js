/**
 * Created by huozhenwei on 2017/5/30.
 */

/**
 * 操作数组方法
 * */
export default class ArrayUtils{

    /**
     * 更新数组,若item已存在则从数组中将它移除,反之添加进数组
     */
    static updateArray(array,item){
        for(var i = 0,len=array.length;i<len;i++){
            var temp = array[i];
            if(temp === item){
                array.splice(i,1); //移除掉
                return;
            }
        }
        array.push(item); //添加用户修改
    }
}
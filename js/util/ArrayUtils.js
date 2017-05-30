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

    /**
     * 克隆一个数组
     * @param from 原数组
     * @returns {Array}
     */
    static clone(from){
        if(!from) return [];
        let newArr = [];
        for(let i=0,len = from.length;i<len;i++){
            newArr[i] = from[i];
        }
        return newArr; //返回新数组
    }

    /**
     * 判断两个数组元素是否一一对应
     * @param arr1
     * @param arr2
     * @returns {boolean} true 数组长度相等且元素对应相等
     */
    static isEqual(arr1,arr2){
        if(!(arr1 && arr2)) return false; //判断是否空
        if(arr1.length !== arr2.length ) return false; //判断长度
        for(let i=0,len=arr2.length; i<len;i++){
            if(arr1[i]!==arr2[i]) return false; //判断元素是否相等
        }
        return true;
    }
}
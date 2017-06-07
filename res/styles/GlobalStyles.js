/**
 * Created by huozhenwei on 2017/6/3.
 * 全局样式
 */
import {
    Dimensions
} from 'react-native';
const {height, width} = Dimensions.get('window');
module.exports = {
    line:{
        height:0.5,
        opacity:0.5,//半透明
        backgroundColor:'darkgray'
    },
    root_container:{
        flex:1,
        backgroundColor:'#f3f3f4'
    },
    nav_bar_height_ios:44,
    nav_bar_height_android:50,
    window_height:height
}


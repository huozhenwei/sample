/**
 * Created by huozhenwei on 2017/5/30.
 */

/**
 * 页面通用元素
 * */
import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
} from 'react-native';

export default class ViewUtil{

    /**
     * 获取设置页的Item
     * @param callBack 单击Item的回调
     * @param icon 左侧图标
     * @param text 显示的文本
     * @param tintStyle 图标着色
     * @param expandableIcon 右侧图标
     */
    static getSettingItem(callBack,icon,text,tintStyle,expandableIcon){
        return (
            <TouchableOpacity onPress={callBack}>
                <View style={[styles.setting_item]}>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        {icon ?
                            <Image
                                style={[{width:16,height:16,marginRight:10},tintStyle]}
                                source={icon} resizeMode='stretch'/>
                            :<View style={{width:16,height:16,marginRight:10}}/>
                        }
                        <Text style={{fontSize:14}}>{text}</Text>
                    </View>
                    <Image
                        style={[{marginRight:0,height:22,width:22},tintStyle]}
                        source={expandableIcon?expandableIcon:require('../../res/images/ic_tiaozhuan.png')}/>
                </View>
            </TouchableOpacity>
        )
    }

    /**
     * @param callBack 返回事件由用户处理
     */
    static getLeftButton(callBack){

        return <TouchableOpacity
            style={{padding: 8}}
            onPress={callBack}>
            <Image style={styles.returnImage}
                   source={require('../../res/images/ic_arrow_back_white_36pt.png')} />
        </TouchableOpacity>
    }

    /**
     *
     * @param title
     * @param callBack 返回事件由用户处理
     */
    static getRightButton(title, callBack) {
        return <TouchableOpacity
            style={{alignItems: 'center'}}
            onPress={callBack}>
            <View style={{marginRight: 10}}>
                <Text style={{fontSize: 20, color: '#FFFFFF'}}>{title}</Text>
            </View>
        </TouchableOpacity>
    }
}

const styles = StyleSheet.create({
    returnImage:{
        width: 26,
        height: 26,
        tintColor:'white'
    },
    setting_item: {
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        padding:10,
        height:60,
        backgroundColor:'white'
    }
});
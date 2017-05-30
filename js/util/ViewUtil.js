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

    //返回按钮
    static getLeftButton(callBack){
        {/* 返回事件由用户处理 */}
        return <TouchableOpacity
            style={{padding: 8}}
            onPress={callBack}>
            <Image style={styles.returnImage}
                   source={require('../../res/images/ic_arrow_back_white_36pt.png')} />
        </TouchableOpacity>
    }
}

const styles = StyleSheet.create({
    returnImage:{
        width: 26,
        height: 26,
        tintColor:'white'
    }
});
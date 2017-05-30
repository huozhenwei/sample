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
            style={{alignItems: 'center',}}
            onPress={callBack}>
            <View style={{marginRight: 10}}>
                <Text style={{fontSize: 20, color: '#FFFFFF',}}>{title}</Text>
            </View>
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
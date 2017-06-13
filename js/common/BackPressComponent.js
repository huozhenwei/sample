/**
 * Created by huozhenwei on 2017/6/13.
 */

import React, {Component} from 'react';
import {BackAndroid} from 'react-native';

export default class BackPressComponent{
    //props 调用者传入
    constructor(props){
        //当组件被创建时,绑定 onHardwareBackPress方法
        this._hardwareBackPress = this.onHardwareBackPress.bind(this);
        this.props = props;
    }
    componentDidMount(){
        //上个页面有传回调函数
        if(this.props.backPress){
            //向系统注册返回键监听
            BackAndroid.addEventListener('hardwareBackPress',this._hardwareBackPress);
        }
    }
    componentWillUnmount(){
        if(this.props.backPress){
            BackAndroid.removeEventListener('hardwareBackPress',this._hardwareBackPress);
        }
    }
    onHardwareBackPress(e){
        return this.props.backPress(e);
    }
}
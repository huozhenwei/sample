/**
 * Created by huozhenwei on 2017/5/28.
 */
import React,{Component} from 'react';
/**
 * 欢迎页面做一些轮播图或广告
 */
import {
    StyleSheet,
    Text,
    View,
    Navigator,
} from 'react-native';

import NavigationBar from '../common/NavigationBar';
import HomePage from './HomePage';
import ThemeDao from '../expand/dao/ThemeDao';
import SplashScreen from 'react-native-splash-screen';
export default class WelcomePage extends Component{
    constructor(props){
        super(props);
    }

    //暂停两秒 进入主页
    componentDidMount(){
        new ThemeDao().getTheme()
            .then((data)=>{
                this.theme = data;
            });
        this.timer = setTimeout(()=>{
            SplashScreen.hide();//关闭启动屏幕
            /**
             * 用resetTo 而不用push?
             * 要在欢迎页重置页面栈中的路由, 然后让主页成为栈中的第一个组件,前面的组件就不在需要了.
             */
            this.props.navigator.resetTo({
                component:HomePage,
                params:{
                    theme:this.theme
                }
            })
        },2000);
    }

    //因为重置,当前页面被卸载掉,定时器可能会有异常
    componentWillUnmount(){
        this.timer && clearTimeout(this.timer);
    }

    render(){
        return null;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    tips: {
        fontSize: 29
    }
});
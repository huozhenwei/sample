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
export default class WelcomePage extends Component{
    constructor(props){
        super(props);
    }

    //暂停两秒 进入主页
    componentDidMount(){
        this.timer = setTimeout(()=>{
            /**
             * 用resetTo 而不用push?
             * 要在欢迎页重置页面栈中的路由, 然后让主页成为栈中的第一个组件,前面的组件就不在需要了.
             */
            this.props.navigator.resetTo({
                component:HomePage
            })
        },2000);
    }

    //因为重置,当前页面被卸载掉,定时器可能会有异常
    componentWillUnmount(){
        this.timer && clearTimeout(this.timer);
    }

    render(){
        return (<View style={styles.container}>
            <NavigationBar
                title='欢迎'
                style={{backgroundColor:'#2196F3'}}
            />
            <Text style={styles.tips}>欢迎</Text>
        </View>)
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tips: {
        fontSize: 29
    },
});
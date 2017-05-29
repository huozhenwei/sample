/**
 * Created by huozhenwei on 2017/5/28.
 */

import React,{Component} from 'react';

import {
    StyleSheet,
    Text,
    View,
    Navigator,
} from 'react-native';

import WelcomePage from './WelcomePage';

function setup() {
    //进行一些初始化配置
    //app的根组件
    class Root extends Component{

        renderScene(route,navigator){
            let Component = route.component;
            return <Component navigator={navigator} {...route.params}/>
        }
        render(){
            return <Navigator
                    //初始化路由->进入欢迎页
                    initialRoute={{component:WelcomePage}}
                    renderScene={(route,navigator)=> this.renderScene(route,navigator)}
                />
        }
    }
    return <Root/>
}

module.exports = setup;
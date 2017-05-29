/**
 * Created by huozhenwei on 2017/5/27.
 */
import React, {Component , PropTypes} from 'react';

import {
    StyleSheet,
    Text,
    View,
    Image,Button,Platform,StatusBar,
} from 'react-native';

const NAVBAR_HEIGHT_ANDROID = 50; //导航栏高度
const NAVBAR_HEIGHT_IOS = 44;
const STATUS_BAR_HEIGHT = 20; //状态栏(最顶部)高度
const StatusBarShape = { //状态栏属性
    backgroundColor:PropTypes.string,
    //状态栏文本颜色, 以下三种之一
    barStyle: PropTypes.oneOf(['default', 'light-content', 'dark-content']),
    hidden: PropTypes.bool,
}

export default class NavigationBar extends Component{
    //设置 NavigationBar 支持哪些属性,以及属性约束
    static propTypes = {
        style: View.propTypes.style,  //允许用户自定义样式
        title: PropTypes.string,   //允许用户自定义标题
        titleView: PropTypes.element,   //有些页面title位置是下拉框,不仅仅是文字
        hide:PropTypes.bool, //是否可以隐藏
        leftButton: PropTypes.element,  //左侧按钮约束
        rightButton: PropTypes.element, //右侧按钮约束
        statusBar: PropTypes.shape(StatusBarShape), //允许用户自定义状态栏形状
    }

    //给部分属性设定默认值
    static defaultProps = {
        //状态栏默认样式
        statusBar: {
            barStyle: 'light-content',
            hidden: false,
        },
    }

    constructor(props){
        super(props);
        this.state = {
            title : '', //默认为空
            hide : false, // NavigationBar默认不隐藏
        }
    }

    render(){
        //页面顶部状体栏, 取出用户设置的样式
        let statusBar = <View style={styles.statusBar}>
            <StatusBar {...this.props.statusBar}/>
        </View>;

        let titleView = this.props.titleView ? this.props.titleView :
            <Text style={styles.title}>{this.props.title}</Text>;

        let content = <View style={styles.navBar}>
            {this.props.leftButton}
            <View style={styles.titleViewContainer}>
                {titleView}
            </View>
            {this.props.rightButton}
        </View>;

        return(
            <View style={[styles.container, this.props.style]}>
                {statusBar}
                {content}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        backgroundColor: 'gray',
    },
    navBar:{
        flexDirection: 'row',
        justifyContent:'space-between',
        alignItems:'center',
        height: Platform.OS === 'ios'? NAVBAR_HEIGHT_IOS : NAVBAR_HEIGHT_ANDROID,
    },
    titleViewContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        left: 40,
        top: 0,
        right: 40,
        bottom: 0,
    },
    title: {
        fontSize: 20,
        color: '#FFFFFF',
    },
    statusBar: {
        height: Platform.OS === 'ios' ? STATUS_BAR_HEIGHT:0,
    },
});
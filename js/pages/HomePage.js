/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View, Image, Button,
    Navigator,
    DeviceEventEmitter
} from 'react-native';

import TabNavigator from 'react-native-tab-navigator';
import PopularPage from './PopularPage';
import TrendingPage from './TrendingPage';
import MyPage from './my/MyPage';
import Toast,{DURATION} from 'react-native-easy-toast';
import FavouritePage from './FavouritePage';
export const ACTION_HOME = {A_SHOW_TOAST:'showToast',A_RESTART:'restart'};
export const FLAG_TAB = {
    flag_popularTab:'tb_popular',
    flag_trendingTab:'tb_trending',
    flag_favoriteTab:'tb_favorite',
    flag_myTab:'tb_my'
};
export default class HomePage extends Component {
    constructor(props) {
        super(props);
        let selectedTab = this.props.selectedTab ? this.props.selectedTab : 'tb_popular';
        this.state = {
            selectedTab: selectedTab
        }
    }
    componentDidMount(){
        //注册通知, 这样其他页面通过事件发射器发射通知,首页这里会收到
        this.listener = DeviceEventEmitter.addListener('ACTION_HOME',
            (action,params)=> this.onAction(action,params));
    }

    /**
     * 重启首页
     * @param jumpToTab 默认显示的页面
     */
    onRestart(jumpToTab){
        this.props.navigator.resetTo({
            component:HomePage,
            params:{
                ...this.props,
                selectedTab:jumpToTab
            }
        })
    }

    /**
     * 通知回调事件处理
     * @param action
     * @param params
     */
    onAction(action,params){
        if(ACTION_HOME.A_RESTART === action){
            this.onRestart(params);
        }
        else if(ACTION_HOME.A_SHOW_TOAST === action){
            this.toast.show(params,DURATION.LENGTH_LONG);
        }
    }

    componentWillUnmount(){
        if(this.listener){
            this.listener.remove();
        }
    }

    _renderTab(Component, selectTab,title,renderIcon){
        return <TabNavigator.Item
            selected={this.state.selectedTab === selectTab}
            selectedTitleStyle={{color:'#2196F3'}}
            title={title}
            renderIcon={() => <Image style={styles.image}
                 source={renderIcon} />}
            renderSelectedIcon={() => <Image style={[styles.image,{tintColor:'#2196F3'}]}
                 source={renderIcon} />}
            onPress={() => this.setState({ selectedTab: selectTab })}>
            <Component {...this.props} />
        </TabNavigator.Item>;
    }

    render() {
        return (
            <View style={styles.container}>
                <TabNavigator>

                    {this._renderTab(PopularPage,'tb_popular','最热',require('../../res/images/ic_polular.png'))}

                    {this._renderTab(TrendingPage,'tb_trending','趋势',require('../../res/images/ic_trending.png'))}

                    {this._renderTab(FavouritePage,'tb_favorite','收藏',require('../../res/images/ic_favorite.png'))}

                    {this._renderTab(MyPage,'tb_my','我的',require('../../res/images/ic_my.png'))}

                </TabNavigator>

                {/* Toast 要在根视图底部使用, 其他页面公用 */}
                <Toast ref={toast=>this.toast=toast} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    page1: {
        flex: 1,
        backgroundColor: 'red',
    },
    page2: {
        flex: 1,
        backgroundColor: 'yellow',
    },
    page3: {
        flex: 1,
        backgroundColor: 'green',
    },
    page4: {
        flex: 1,
        backgroundColor: 'blue',
    },
    image: {
        width: 22,
        height: 22
    }
});
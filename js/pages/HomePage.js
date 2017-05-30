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
import AsyncStorageTest from '../../AsyncStorageTest';
import MyPage from './my/MyPage';
import Toast,{DURATION} from 'react-native-easy-toast';
import WebViewTest from '../../WebViewTest';
export default class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTab: 'tb_popular',
        }
    }
    componentDidMount(){
        //注册通知, 这样其他页面通过事件发射器发射名为showToast的通知,首页这里会收到
        this.listener = DeviceEventEmitter.addListener('showToast',(text)=>{
            this.toast.show(text,DURATION.LENGTH_LONG);
        }) 
    }
    componentWillUnmount(){
        this.listener&&this.listener.remove();
    }
    render() {
        return (
            <View style={styles.container}>
                <TabNavigator>
                    <TabNavigator.Item
                        selected={this.state.selectedTab === 'tb_popular'}
                        selectedTitleStyle={{color:'#2196F3'}}
                        title="最热"
                        renderIcon={() => <Image style={styles.image}
                 source={require('../../res/images/ic_polular.png')} />}
                        renderSelectedIcon={() => <Image style={[styles.image,{tintColor:'#2196F3'}]}
                 source={require('../../res/images/ic_polular.png')} />}
                        onPress={() => this.setState({ selectedTab: 'tb_popular' })}>
                        <PopularPage />
                    </TabNavigator.Item>
                    <TabNavigator.Item
                        selected={this.state.selectedTab === 'tb_trending'}
                        selectedTitleStyle={{color:'#2196F3'}}
                        title="趋势"
                        renderIcon={() => <Image style={styles.image}
                 source={require('../../res/images/ic_trending.png')} />}
                        renderSelectedIcon={() => <Image style={[styles.image,{tintColor:'#2196F3'}]}
                 source={require('../../res/images/ic_trending.png')} />}
                        onPress={() => this.setState({ selectedTab: 'tb_trending' })}>
                        <AsyncStorageTest/>
                    </TabNavigator.Item>
                    <TabNavigator.Item
                        selected={this.state.selectedTab === 'tb_favorite'}
                        selectedTitleStyle={{color:'#2196F3'}}
                        title="收藏"
                        renderIcon={() => <Image style={styles.image}
                 source={require('../../res/images/ic_favorite.png')} />}
                        renderSelectedIcon={() => <Image style={[styles.image,{tintColor:'#2196F3'}]}
                 source={require('../../res/images/ic_favorite.png')} />}
                        onPress={() => this.setState({ selectedTab: 'tb_favorite' })}>
                        <WebViewTest/>
                    </TabNavigator.Item>
                    <TabNavigator.Item
                        selected={this.state.selectedTab === 'tb_my'}
                        selectedTitleStyle={{color:'#2196F3'}}
                        title="我的"
                        renderIcon={() => <Image style={styles.image}
                 source={require('../../res/images/ic_my.png')} />}
                        renderSelectedIcon={() => <Image style={[styles.image,{tintColor:'#2196F3'}]}
                 source={require('../../res/images/ic_my.png')} />}
                        onPress={() => this.setState({ selectedTab: 'tb_my' })}>
                        <MyPage {...this.props}/>
                    </TabNavigator.Item>
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
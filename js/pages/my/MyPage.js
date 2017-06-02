/**
 * Created by huozhenwei on 2017/5/30.
 */
import React,{Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

import NavigationBar from '../../common/NavigationBar';
import CustomKeyPage from './CustomKeyPage';
import SortKeyPage from './SortKeyPage';
import {FLAG_LANGUAGE}from '../../expand/dao/LanguageDao';

export default class MyPage extends Component{
    constructor(props){
        super(props);
    }
    render(){
        return (<View style={styles.container}>
            <NavigationBar
                title='我的'
                style={{backgroundColor:'#2196F3'}}
            />
            <Text style={styles.tips}
                onPress={()=>{
                    this.props.navigator.push({
                        component:CustomKeyPage,
                        params:{
                            ...this.props,
                            flag:FLAG_LANGUAGE.flag_key
                        }
                    })
                }}>自定义标签</Text>

            <Text style={styles.tips}
                onPress={()=>{
                    this.props.navigator.push({
                        component:CustomKeyPage,
                        params:{
                            ...this.props,
                            flag:FLAG_LANGUAGE.flag_language
                        }
                    })
                }}>自定义语言</Text>

            <Text style={styles.tips}
                onPress={()=>{
                    this.props.navigator.push({
                        component:SortKeyPage,
                        params:{...this.props}
                    })
                }}>标签排序</Text>

            <Text style={styles.tips}
                  onPress={()=>{
                    this.props.navigator.push({
                        component:CustomKeyPage,
                        params:{
                            ...this.props,
                            isRemoveKey:true, //用于标识进入标签删除功能
                        }
                    })
                }}>标签移除</Text>
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
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
                        params:{...this.props}
                    })
                }}>自定义标签</Text>

            <Text style={styles.tips}
                onPress={()=>{
                    this.props.navigator.push({
                        component:SortKeyPage,
                        params:{...this.props}
                    })
                }}>标签排序</Text>
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
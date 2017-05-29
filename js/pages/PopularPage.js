/**
 * Created by huozhenwei on 2017/5/28.
 */
import React,{Component} from 'react';

import {
    StyleSheet,
    Text,
    View,
    TextInput,
} from 'react-native';
import NavigationBar from '../common/NavigationBar';
import DataRepository from '../expand/dao/DataRepository';
const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';
export default class PopularPage extends Component{
    constructor(props){
        super(props);
        this.state = {
            text:'', //用户输入关键字
            result:''
        }
        this.dataRepository = new DataRepository();
    }

    onLoad(){
        //调用数据模块, 获取用户输入关键字下的项目数据
        let url = URL + this.state.text + QUERY_STR;
        this.dataRepository.fetchNetRepository(url)
            .then(result=>{
                this.setState({
                    result:JSON.stringify(result)
                })
            })
            .catch(err=>{
                this.setState({
                    result:JSON.stringify(err)
                })
            })
    }

    render(){
        return (<View style={styles.container}>
            <NavigationBar
                title='最热'
                style={{backgroundColor:'#6495ED'}}
            />
            <Text
                onPress={()=>{
                    this.onLoad()
                }}
                style={styles.tips}>获取数据</Text>
            <TextInput
                style={{height:40, borderWidth:1}}
                onChangeText={text=>this.state.text = text}
            />
            <Text style={{height:500}}>{this.state.result}</Text>
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
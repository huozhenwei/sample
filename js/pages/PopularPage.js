/**
 * Created by huozhenwei on 2017/5/28.
 */
import React,{Component} from 'react';

import {
    StyleSheet,
    Text,
    View,
    TextInput,
    ListView,
    RefreshControl
} from 'react-native';
import ScrollableTabView,{ScrollableTabBar} from 'react-native-scrollable-tab-view';
import NavigationBar from '../common/NavigationBar';
import RepositoryCell from '../common/RepositoryCell';
import DataRepository from '../expand/dao/DataRepository';
const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';
export default class PopularPage extends Component{
    constructor(props){
        super(props);
    }

    render(){
        return (<View style={styles.container}>
            <NavigationBar
                title='最热'
                statusBar={{backgroundColor:'#2196F3'}}
            />

            <ScrollableTabView
                tabBarBackgroundColor='#2196F3'
                tabBarInactiveTextColor='mintcream'
                tabBarActiveTextColor='white'
                tabBarUnderlineStyle={{backgroundColor:'#e7e7e7',height:2}}
                renderTabBar={()=><ScrollableTabBar/>}>
                <PopularTab tabLabel='Java'>Java</PopularTab>
                <PopularTab tabLabel='iOS'>iOS</PopularTab>
                <PopularTab tabLabel='Android'>Android</PopularTab>
                <PopularTab tabLabel='JavaScript'>JavaScript</PopularTab>
            </ScrollableTabView>
        </View>)
    }
}

class PopularTab extends Component{
    constructor(props){
        super(props);
        this.dataRepository = new DataRepository(); //数据处理模块

        this.state = {
            result:'', //查询结果,
            //为ListView 创建数据源, 规则是下一行数据不一样的时候,ListView渲染它
            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            isLoading: false, //什么时候显示刷新视图
        };
    }

    //页面完成装载时加载数据
    componentDidMount(){
        this.loadData();
    }

    loadData(){
        //页面加载时,或者用户下拉刷新时,显示刷新视图
        this.setState({
            isLoading:true
        });
        //调用数据模块, 获取用户输入关键字下的项目数据
        let url = URL + this.props.tabLabel + QUERY_STR;
        this.dataRepository
            .fetchNetRepository(url)
            .then(result=>{
                //把数据赋给dataSource
                this.setState({
                    dataSource:this.state.dataSource.cloneWithRows(result.items),
                    isLoading:false, //数据返回后停止
                })
            })
            .catch(err=>{
                this.setState({
                    result:JSON.stringify(err)
                })
            })
    }

    renderRow(data){
        return <RepositoryCell data={data}/>
    }

    render(){
        {/* PopularTab 不设置样式就没有高度, 刷新视图看不见 */}
        return <View style={{flex:1}}>
            <ListView
                //绑定数据
                dataSource = {this.state.dataSource}
                //每行返回的视图
                renderRow = {(item)=> this.renderRow(item)}
                //下拉刷新
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.isLoading}
                        onRefresh={()=>this.loadData()}
                        colors={['#2196F3']}
                        tintColor={'#2196F3'}
                        title={'Loading'}
                        titleColor={'#2196F3'}
                    />}
            />
        </View>
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
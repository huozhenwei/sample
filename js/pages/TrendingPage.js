/**
 * Created by huozhenwei on 2017/5/31.
 */
import React,{Component} from 'react';

import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Image,
    ListView,
    RefreshControl,
    DeviceEventEmitter,
    TouchableOpacity
} from 'react-native';
import ScrollableTabView,{ScrollableTabBar} from 'react-native-scrollable-tab-view';
import NavigationBar from '../common/NavigationBar';
import TrendingCell from '../common/TrendingCell';
import DataRepository,{FLAG_STORAGE} from '../expand/dao/DataRepository';
import LanguageDao,{FLAG_LANGUAGE} from '../expand/dao/LanguageDao';
import RepositoryDetail from './RepositoryDetail';
import TimeSpan from '../model/TimeSpan';
import Popover from '../common/Popover';
var timeSpanTextArray = [
    new TimeSpan('今 天','since=daily'),
    new TimeSpan('本 周','since=weekly'),
    new TimeSpan('本 月','since=monthly')
];
const API_URL = 'https://github.com/trending/';
export default class TrendingPage extends Component{
    constructor(props){
        super(props);
        //初始化LanguageDao
        this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_language);
        this.state = {
            languages:[], //语言标签
            isVisible: false, //使用Popover
            buttonRect: {},
            timeSpan: timeSpanTextArray[0]
        }
    }

    //组件完成加载时候就调用
    componentDidMount(){
        this.loadData();
    }

    //通过LanguageDao读取本地标签
    loadData(){
        this.languageDao.fetch()
            .then(result=>{
                this.setState({
                    languages:result
                })
            })
            .catch(error=>{
                console.log(error);
            })
    }

    showPopover() {
        this.refs.button.measure((ox, oy, width, height, px, py) => {
            this.setState({
                isVisible: true,
                buttonRect: {x: px, y: py, width: width, height: height}
            });
        });
    }
    closePopover() {
        this.setState({isVisible: false});
    }
    onSelectTimeSpan(timeSpan) {
        this.closePopover();
        this.setState({
            timeSpan: timeSpan
        })
    }
    renderTitleView(){
        return <View>
            <TouchableOpacity
                ref='button'
                underlayColor='transparent'
                onPress={()=>this.showPopover()}
            >
                <View style={{flexDirection:'row',alignItems:'center'}}>
                    <Text style={{
                        fontSize: 18,
                        color: '#FFFFFF',
                        fontWeight: '400'
                    }}>趋势 {this.state.timeSpan.showText}</Text>
                    <Image
                        style={{width: 12, height: 12, marginLeft: 5}}
                        source={require('../../res/images/ic_spinner_triangle.png')}/>
                </View>
            </TouchableOpacity>
        </View>
    }
    render(){
        let navigationBar = <NavigationBar
            titleView={this.renderTitleView()}
            statusBar={{backgroundColor:'#2196F3'}}
        />;

        //自定义标签没有加载完, 渲染ScrollableTabView时无法计算tabBar宽度
        let content = this.state.languages.length > 0
            ? <ScrollableTabView
            tabBarBackgroundColor='#2196F3'
            tabBarInactiveTextColor='mintcream'
            tabBarActiveTextColor='white'
            tabBarUnderlineStyle={{backgroundColor:'#e7e7e7',height:2}}
            renderTabBar={()=><ScrollableTabBar/>}>

            {/* 根据用户自定义标签来渲染PopularTab */}
            {this.state.languages.map((result,i,arr)=>{
                let lan = arr[i];
                //必须是订阅了的标签
                return lan.checked ? <TrendingTab key={i} tabLabel={lan.name} timeSpan={this.state.timeSpan} {...this.props}/> :null;
            })}
        </ScrollableTabView> : null;

        //要放在根视图下面
        let timeSpanView = <Popover
            isVisible={this.state.isVisible}
            fromRect={this.state.buttonRect}
            placement="bottom"
            contentStyle={{opacity:0.82,backgroundColor:'#343434'}}
            onClose={()=>this.closePopover()}>
            <View style={{alignItems: 'center'}}>
                {timeSpanTextArray.map((res,i,arr)=>{
                    return <TouchableOpacity
                        key={i}
                        onPress={()=>this.onSelectTimeSpan(arr[i])}
                        underlayColor='transparent'>
                        <Text
                            style={{fontSize: 18,color:'white', padding: 8, fontWeight: '400'}}>
                            {arr[i].showText}
                        </Text>
                    </TouchableOpacity>
                })}
            </View>
        </Popover>
        return (<View style={styles.container}>
            {navigationBar}
            {content}
            {timeSpanView}
        </View>)
    }
}

class TrendingTab extends Component{
    constructor(props){
        super(props);
        //传入参数,初始化数据处理模块
        this.dataRepository = new DataRepository(FLAG_STORAGE.flag_trending);
        this.state = {
            //为ListView 创建数据源, 规则是下一行数据不一样的时候,ListView渲染它
            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            isLoading: false //什么时候显示刷新视图
        }
    }

    //页面完成装载时加载数据
    componentDidMount(){
        this.loadData(this.props.timeSpan,true);
    }

    //组件接收到新属性时候
    componentWillReceiveProps(nextProps) {
        //将要接收到的属性 和 当前属性
        if (nextProps.timeSpan !== this.props.timeSpan) {
            this.loadData(nextProps.timeSpan);
        }
    }
    onRefresh(){
        this.loadData(this.props.timeSpan);
    }
    updateState(dic){
        if(!this)return;
        this.setState(dic);
    }
    loadData(timeSpan,isRefresh){
        //页面加载时,或者用户下拉刷新时,显示刷新视图
        this.updateState({
            isLoading:true
        });
        let url = this.getFetchUrl(timeSpan, this.props.tabLabel);
        this.dataRepository
            .fetchRepository(url)
            .then(result=>{
                let items = result && result.items ? result.items : result ? result : []; //最后判断result
                this.updateState({
                    dataSource:this.state.dataSource.cloneWithRows(items),
                    isLoading:false
                });
                DeviceEventEmitter.emit('showToast', '显示缓存数据');
                if(result && result.update_date && !this.dataRepository.checkData(result.update_date)){
                    DeviceEventEmitter.emit('showToast','数据过时');
                    return this.dataRepository.fetchNetRepository(url);
                }
            })
            .then(items=>{
                if(!items || items.length === 0)return;
                this.updateState({
                    dataSource:this.state.dataSource.cloneWithRows(items),
                    isLoading:false
                });
                DeviceEventEmitter.emit('showToast','显示网络数据');
            })
            .catch(err=>{
                this.setState({
                    isLoading:false
                });
            })
    }

    getFetchUrl(timeSpan, category) {//objective-c?since=daily
        return API_URL + category + '?' + timeSpan.searchText;
    }

    //点击项目查看详情页面
    onSelect(item){
        this.props.navigator.push({
            component:RepositoryDetail,
            params:{
                item:item,
                ...this.props
            }
        });
    }

    renderRow(data){
        return <TrendingCell
            onSelect={()=>this.onSelect(data)}
            key={data.id}
            data={data}/>
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
                        onRefresh={()=>this.onRefresh()}
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
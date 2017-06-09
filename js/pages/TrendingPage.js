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
import TimeSpan from '../model/TimeSpan';
import Popover from '../common/Popover';
import ProjectModel from '../model/ProjectModel';
import FavouriteDao from '../expand/dao/FavouriteDao';
import Utils from '../util/Utils';
import BaseComponent from './BaseComponent';
import ViewUtil from '../util/ViewUtil';
import CustomThemePage from './my/CustomTheme';
import MoreMenu,{MORE_MENU} from '../common/MoreMenu';
import {FLAG_TAB} from './HomePage';
import ActionUtils from '../util/ActionUtils';
//全局的,在不同页签下使用
var favouriteDao = new FavouriteDao(FLAG_STORAGE.flag_trending);
//传入参数,初始化数据处理模块
var dataRepository = new DataRepository(FLAG_STORAGE.flag_trending);
var timeSpanTextArray = [
    new TimeSpan('今 天','since=daily'),
    new TimeSpan('本 周','since=weekly'),
    new TimeSpan('本 月','since=monthly')
];
const API_URL = 'https://github.com/trending/';
export default class TrendingPage extends BaseComponent{
    constructor(props){
        super(props);
        //初始化LanguageDao
        this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_language);
        this.state = {
            languages:[], //语言标签
            isVisible: false, //使用Popover
            buttonRect: {},
            timeSpan: timeSpanTextArray[0],
            theme:this.props.theme,
            customThemeViewVisible:false
        };
        this.loadLanguage();
    }

    //通过LanguageDao读取语言
    loadLanguage(){
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

    /**
     * 渲染更多菜单
     */
    renderMoreView(){
        let params = {
            ...this.props,fromPage:FLAG_TAB.flag_trendingTab
        };
        return <MoreMenu
            ref="moreMenu"
            {...params}
            menus={[MORE_MENU.Custom_Language,MORE_MENU.Sort_Language,
            MORE_MENU.Custom_Theme,MORE_MENU.About_Author,MORE_MENU.About]}
            anchorView={()=>this.refs.moreMenuButton}
            onMoreMenuSelect={(e)=>{
                if(e===MORE_MENU.Custom_Theme){
                    this.setState({customThemeViewVisible:true});
                }
            }}
        />
    }
    renderCustomThemeView(){
        return (<CustomThemePage
            visible = {this.state.customThemeViewVisible}
            {...this.props}
            onClose={()=> this.setState({customThemeViewVisible:false})}
        />)
    }

    render(){
        var statusBar = {
            backgroundColor: this.state.theme.themeColor
        };
        let navigationBar = <NavigationBar
            titleView={this.renderTitleView()}
            statusBar={statusBar}
            style = {this.state.theme.styles.navBar}
            rightButton={ViewUtil.getMoreButton(()=>this.refs.moreMenu.open())}
        />;

        //自定义标签没有加载完, 渲染ScrollableTabView时无法计算tabBar宽度
        let content = this.state.languages.length > 0
            ? <ScrollableTabView
            tabBarUnderlineStyle={{backgroundColor:'#e7e7e7',height:2}}
            tabBarInactiveTextColor='mintcream'
            tabBarActiveTextColor='white'
            ref="scrollableTabView"
            tabBarBackgroundColor={this.state.theme.themeColor}
            initialPage={0}
            renderTabBar={()=><ScrollableTabBar style={{height: 40, borderWidth: 0, elevation: 2}}
                tabStyle={{height: 39}}/>}
        >
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
        </Popover>;
        return (<View style={styles.container}>
            {navigationBar}
            {content}
            {timeSpanView}
            {this.renderMoreView()}
            {this.renderCustomThemeView()}
        </View>)
    }
}

class TrendingTab extends Component{
    constructor(props){
        super(props);
        this.state = {
            //为ListView 创建数据源, 规则是下一行数据不一样的时候,ListView渲染它
            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            isLoading: false,
            favouriteKeys:[],
            theme:this.props.theme
        };
        this.isFavouriteChanged = false;
    }

    //页面完成装载时加载数据
    componentDidMount(){
        this.loadData(this.props.timeSpan,true);
        //监听收藏模块的操作, 如果用户取消收藏,回到此页面要刷新视图
        this.listener = DeviceEventEmitter.addListener('favouriteChanged_trending',()=>{
            this.isFavouriteChanged = true;
        });
    }

    componentWillUnmount(){
        if(this.listener){
            this.listener.remove();
        }
    }

    //组件接收到新属性时候
    componentWillReceiveProps(nextProps) {
        //将要接收到的属性 和 当前属性
        if (nextProps.timeSpan !== this.props.timeSpan) {
            this.loadData(nextProps.timeSpan);
        }
        else if(this.isFavouriteChanged){
            this.isFavouriteChanged = false;
            this.getFavouriteKeys();
        }
        else if(nextProps.theme !=this.state.theme){
            this.updateState({theme:nextProps.theme});
            this.flushFavouriteState();
        }
    }

    /**
     * 更新Project Item 收藏的状态
     */
    flushFavouriteState(){
        let projectModels = [];
        let items = this.items;
        for(var i=0,len=items.length;i<len;i++){
            projectModels.push(new ProjectModel(items[i],Utils.checkFavourite(items[i],this.state.favouriteKeys)));
        }
        this.updateState({
            isLoading:false,
            dataSource:this.getDataSource(projectModels)
        })
    }
    getDataSource(items) {
        return this.state.dataSource.cloneWithRows(items);
    }
    updateState(dic){
        if(!this)return; //调用者不存在(组件)
        this.setState(dic);
    }
    getFavouriteKeys(){
        favouriteDao.getFavouriteKeys()
            .then(keys=>{
                if(keys){
                    this.updateState({favouriteKeys:keys})
                }
                this.flushFavouriteState();
            })
            .catch(e=>{
                this.flushFavouriteState();
            })
    }
    onRefresh(){
        this.loadData(this.props.timeSpan,true);
    }
    loadData(timeSpan,isRefresh){
        //页面加载时,或者用户下拉刷新时,显示刷新视图
        this.updateState({
            isLoading:true
        });
        let url = this.getFetchUrl(timeSpan, this.props.tabLabel);
        dataRepository
            .fetchRepository(url)
            .then(result=>{
                this.items = result && result.items ? result.items : result ? result : []; //最后判断result
                this.getFavouriteKeys();
                if(!this.items||isRefresh&&result && result.update_date && !Utils.checkData(result.update_date)){
                    return dataRepository.fetchNetRepository(url);
                }
            })
            .then(items=>{
                if(!items || items.length === 0)return;
                this.items = items;
                this.getFavouriteKeys();
            })
            .catch(err=>{
                this.updateState({
                    isLoading:false
                });
            })
    }

    getFetchUrl(timeSpan, category) {//objective-c?since=daily
        return API_URL + category + '?' + timeSpan.searchText;
    }

    /**
     * 当详情页面被卸载时,返回到这里刷新收藏按钮状态
     */
    onUpdateFavourite() {
        this.getFavouriteKeys();
    }

    renderRow(projectModel){
        return <TrendingCell
            key={projectModel.item.fullName}
            projectModel={projectModel}
            theme={this.props.theme}
            onSelect={()=>ActionUtils.onSelectRepository({
                projectModel: projectModel,
                flag: FLAG_STORAGE.flag_trending,
                ...this.props,
                onUpdateFavourite:()=>this.onUpdateFavourite()
            })}
            onFavourite={(item,isFavourite)=>ActionUtils.onFavourite(
            favouriteDao, item, isFavourite, FLAG_STORAGE.flag_trending)}
        />
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
                        title={'Loading...'}
                        titleColor={this.state.theme.themeColor}
                        colors={[this.state.theme.themeColor]}
                        refreshing={this.state.isLoading}
                        onRefresh={()=>this.onRefresh()}
                        tintColor={this.state.theme.themeColor}
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
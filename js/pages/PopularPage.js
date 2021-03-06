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
    RefreshControl,
    DeviceEventEmitter,
    TouchableOpacity,
    Image
} from 'react-native';
import ScrollableTabView,{ScrollableTabBar} from 'react-native-scrollable-tab-view';
import NavigationBar from '../common/NavigationBar';
import BaseComponent from './BaseComponent';
import RepositoryCell from '../common/RepositoryCell';
import DataRepository,{FLAG_STORAGE} from '../expand/dao/DataRepository';
import LanguageDao,{FLAG_LANGUAGE} from '../expand/dao/LanguageDao';
import ProjectModel from '../model/ProjectModel';
import {FLAG_TAB} from './HomePage';
import FavouriteDao from '../expand/dao/FavouriteDao';
import Utils from '../util/Utils';
import ViewUtil from '../util/ViewUtil';
import ActionUtils from '../util/ActionUtils';
import SearchPage from './SearchPage';
import CustomThemePage from './my/CustomTheme';
import MoreMenu,{MORE_MENU} from '../common/MoreMenu';
const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';
//全局的,在不同页签下使用
var favouriteDao = new FavouriteDao(FLAG_STORAGE.flag_popular);
//传入参数,初始化数据处理模块
var dataRepository = new DataRepository(FLAG_STORAGE.flag_popular);
export default class PopularPage extends BaseComponent{
    constructor(props){
        super(props);
        //初始化LanguageDao
        this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_key);
        this.state = {
            languages:[], //语言标签
            theme:this.props.theme,
            customThemeViewVisible:false
        };
        this.loadKey();
    }

    //通过LanguageDao读取本地标签
    loadKey(){
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

    renderRightButton(){
        return <View style={{flexDirection:'row'}}>
            <TouchableOpacity
                onPress={()=>{
                    this.props.navigator.push({
                        component:SearchPage,
                        params:{
                            ...this.props
                        }
                    })
                }}
            >
                <View style={{padding:5,marginRight:8}}>
                    <Image
                        style={{width:24,height:24}}
                        source={require('../../res/images/ic_search_white_48pt.png')} />
                </View>
            </TouchableOpacity>

            {ViewUtil.getMoreButton(()=>this.refs.moreMenu.open())}
        </View>
    }

    /**
     * 渲染更多菜单
     */
    renderMoreView(){
        let params = {
            ...this.props,fromPage:FLAG_TAB.flag_popularTab
        };
        return <MoreMenu
            ref="moreMenu"
            {...params}
            menus={[MORE_MENU.Custom_Key,MORE_MENU.Sort_Key,MORE_MENU.Remove_Key,
            MORE_MENU.Custom_Theme,MORE_MENU.About_Author,MORE_MENU.About
            // ,MORE_MENU.Share
            ]}
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
            backgroundColor: this.state.theme.themeColor,
            barStyle: 'light-content'
        };
        let navigationBar = <NavigationBar
                title={'最热'}
                statusBar={statusBar}
                style = {this.state.theme.styles.navBar}
                rightButton={this.renderRightButton()}
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
                return lan.checked ? <PopularTab key={i} tabLabel={lan.name} {...this.props}/> :null;
            })}
        </ScrollableTabView> : null;

        return (<View style={styles.container}>
            {navigationBar}
            {content}
            {this.renderMoreView()}
            {this.renderCustomThemeView()}
        </View>)
    }
}

class PopularTab extends Component{
    constructor(props){
        super(props);
        this.state = {
            //为ListView 创建数据源, 规则是下一行数据不一样的时候,ListView渲染它
            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            isLoading: false, //什么时候显示刷新视图
            favouriteKeys:[],
            theme:this.props.theme
        };
        this.isFavouriteChanged = false;
    }

    //页面完成装载时加载数据
    componentDidMount(){
        this.loadData();
        //监听收藏模块的操作, 如果用户取消收藏,回到此页面要刷新视图
        this.listener = DeviceEventEmitter.addListener('favouriteChanged_popular',()=>{
            this.isFavouriteChanged = true;
        })
    }

    componentWillUnmount(){
        if(this.listener){
            this.listener.remove();
        }
    }

    componentWillReceiveProps(nextProps){
        if(this.isFavouriteChanged){
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
    loadData(){
        //页面加载时,或者用户下拉刷新时,显示刷新视图
        this.updateState({
            isLoading:true
        });
        //调用数据模块, 获取用户输入关键字下的项目数据
        let url = URL + this.props.tabLabel + QUERY_STR;
        dataRepository
            .fetchRepository(url)
            .then(result=>{
                this.items = result && result.items ? result.items : result ? result : []; //最后判断result
                this.getFavouriteKeys();
                if(result && result.update_date && !Utils.checkData(result.update_date)){
                    //数据过时,重新获取
                    return dataRepository.fetchNetRepository(url);
                }
            })
            .then(items=>{
                //此链用于接收数据过时,重新发起的网络请求返回的Promise
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

    /**
     * 当详情页面被卸载时,返回到这里刷新收藏按钮状态
     */
    onUpdateFavourite() {
        this.getFavouriteKeys();
    }

    renderRow(projectModel){
        return <RepositoryCell
            key={projectModel.item.id}
            projectModel={projectModel}
            theme={this.props.theme}
            onSelect={()=>ActionUtils.onSelectRepository({
                projectModel: projectModel,
                flag: FLAG_STORAGE.flag_popular,
                ...this.props,
                onUpdateFavourite:()=>this.onUpdateFavourite()
            })}
            onFavourite={(item,isFavourite)=>ActionUtils.onFavourite(
            favouriteDao, item, isFavourite, FLAG_STORAGE.flag_popular)}
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
                        onRefresh={()=>this.loadData()}
                        tintColor={this.state.theme.themeColor}
                    />}
            />
        </View>
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});
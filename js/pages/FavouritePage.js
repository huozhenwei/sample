/**
 * Created by huozhenwei on 2017/06/03.
 */
import React, {Component} from 'react';

import {
    StyleSheet,
    Text,
    Image,
    View,
    TextInput,
    ListView,
    RefreshControl,
    DeviceEventEmitter
} from 'react-native';
import NavigationBar from '../common/NavigationBar';
import {FLAG_STORAGE} from '../expand/dao/DataRepository';
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view';
import RepositoryCell from '../common/RepositoryCell';
import TrendingCell from '../common/TrendingCell';
import FavouriteDao from '../expand/dao/FavouriteDao';
import ProjectModel from '../model/ProjectModel';
import ArrayUtils from '../util/ArrayUtils';
import ActionUtils from '../util/ActionUtils';
import ViewUtil from '../util/ViewUtil';
import MoreMenu,{MORE_MENU} from '../common/MoreMenu';
import {FLAG_TAB} from './HomePage';
export default class FavouritePage extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
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
            menus={[MORE_MENU.Custom_Theme,MORE_MENU.About_Author,MORE_MENU.About]}
            anchorView={()=>this.refs.moreMenuButton}
        />
    }
    render() {
        let navigationBar = <NavigationBar
            title='收藏'
            statusBar={{backgroundColor:'#2196F3'}}
            rightButton={ViewUtil.getMoreButton(()=>this.refs.moreMenu.open())}
        />;
        let content = <ScrollableTabView
            initialPage={0}
            tabBarBackgroundColor='#2196F3'
            tabBarInactiveTextColor='mintcream'
            tabBarActiveTextColor='white'
            tabBarUnderlineStyle={{backgroundColor:'#e7e7e7',height:2}}
            renderTabBar={()=><ScrollableTabBar/>}
        >
            <FavouriteTab tabLabel='最热' {...this.props} flag={FLAG_STORAGE.flag_popular}/>
            <FavouriteTab tabLabel='趋势' {...this.props} flag={FLAG_STORAGE.flag_trending}/>
        </ScrollableTabView>;

        return (<View style={styles.container}>
            {navigationBar}
            {content}
            {this.renderMoreView()}
        </View>)
    }
}

class FavouriteTab extends Component {
    constructor(props) {
        super(props);
        this.favouriteDao = new FavouriteDao(this.props.flag);
        this.state = {
            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            isLoading: false,
            favouriteKeys: []
        }
        this.unFavouriteItems = [];
    }

    componentDidMount() {
        this.loadData(true);
    }

    /**
     * 从详情页面返回时刷新列表
     * @param nextProps
     */
    componentWillReceiveProps(nextProps) {
        this.loadData(false);
    }

    loadData(isShowLoading) {
        if(isShowLoading){
            this.setState({
                isLoading: true
            })
        }
        this.favouriteDao.getAllItem()
            .then((items)=> {
                var resultData = [];
                for (var i = 0, len = items.length; i < len; i++) {
                    resultData.push(new ProjectModel(items[i], true));
                }
                this.setState({
                    isLoading: false,
                    dataSource: this.getDataSource(resultData)
                });
            })
            .catch((e)=> {
                this.setState({
                    isLoading: false
                });
            })
    }

    getDataSource(items) {
        return this.state.dataSource.cloneWithRows(items);
    }

    /**
     * favouriteIcon的单击回调函数
     * @param item
     * @param isFavourite
     */
    onFavourite(item, isFavourite) {
        var key = this.props.flag === FLAG_STORAGE.flag_popular ? item.id.toString() : item.fullName;
        if (isFavourite) {
            this.favouriteDao.saveFavouriteItem(key, JSON.stringify(item));
        }
        else {
            this.favouriteDao.removeFavouriteItem(key);
        }
        //记录用户操作,如果用户取消收藏,等回到Popular或Trending模块刷新它们
        ArrayUtils.updateArray(this.unFavouriteItems,item);
        if(this.unFavouriteItems.length > 0){
            if(this.props.flag === FLAG_STORAGE.flag_popular){
                DeviceEventEmitter.emit('favouriteChanged_popular');
            }
            else{
                DeviceEventEmitter.emit('favouriteChanged_trending');
            }
        }
    }

    renderRow(projectModel) {
        let Cell = this.props.flag === FLAG_STORAGE.flag_popular ? RepositoryCell : TrendingCell;
        return <Cell
            key={this.props.flag === FLAG_STORAGE.flag_popular ? projectModel.item.id : projectModel.item.fullName}
            projectModel={projectModel}
            onSelect={()=>ActionUtils.onSelectRepository({
                projectModel: projectModel,
                flag: this.props.flag,
                ...this.props
            })}
            onFavourite={(item,isFavourite)=>this.onFavourite(item,isFavourite)}
        />
    }

    render() {
        {/* 页面 不设置样式就没有高度, 刷新视图看不见 */
        }
        return <View style={{flex:1}}>
            <ListView
                enableEmptySections={true}
                //绑定数据
                dataSource={this.state.dataSource}
                //每行返回的视图
                renderRow={(item)=> this.renderRow(item)}
                //下拉刷新
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.isLoading}
                        onRefresh={()=>this.loadData()}
                        colors={['#2196F3']}
                        tintColor={'#2196F3'}
                        title='Loading'
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
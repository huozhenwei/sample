/**
 * Created by huozhenwei on 2017/6/6.
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    Image,
    View,
    TextInput,
    Platform,
    StatusBar,
    TouchableOpacity,
    ListView,
    ActivityIndicator,
    DeviceEventEmitter
} from 'react-native';
import Toast,{DURATION} from 'react-native-easy-toast';
import RepositoryCell from '../common/RepositoryCell';
import ViewUtil from '../util/ViewUtil';
import GlobalStyles from '../../res/styles/GlobalStyles';
import FavouriteDao from '../expand/dao/FavouriteDao';
import {FLAG_STORAGE} from '../expand/dao/DataRepository';
import LanguageDao,{FLAG_LANGUAGE} from '../expand/dao/LanguageDao';
import Utils from '../util/Utils';
import ActionUtils from '../util/ActionUtils';
import ProjectModel from '../model/ProjectModel';
import {ACTION_HOME} from './HomePage';
import {FLAG_TAB} from './HomePage';
import makeCancelable from '../util/Cancelable';
import BackPressComponent from '../common/BackPressComponent';
const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';
export default class SearchPage extends Component {
    constructor(props) {
        super(props);
        //全局的,在不同页签下使用
        this.favouriteDao = new FavouriteDao(FLAG_STORAGE.flag_popular);
        this.favouriteKeys = [];
        this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_key);
        this.keys = [];
        this.isKeyChange = false; //记录用户是否添加过key
        this.state = {
            rightButtonText: '搜索',
            isLoading: false,
            showBottomButton: false,
            dataSource: new ListView.DataSource({
                rowHasChanged: (r1, r2) => r1 !== r2
            })
        };
        this.backPress = new BackPressComponent({backPress:(e)=>this.onBackPress(e)});
    }

    componentDidMount() {
        this.initKeys();
        this.backPress.componentDidMount();
    }
    componentWillUnmount(){
        this.backPress.componentWillUnmount();
        if(this.isKeyChange){
            //传入事件名,类型 和 默认tab
            DeviceEventEmitter.emit('ACTION_HOME',ACTION_HOME.A_RESTART,FLAG_TAB.flag_popularTab);
        }
        //页面返回,如果有请求,把请求取消掉
        this.cancelable&&this.cancelable.cancel();
    }
    /**
     * 获取所有标签
     */
    async initKeys(){
        this.keys = await this.languageDao.fetch();
    }

    /**
     * 检查搜索内容有没有在标签中,如果没有,就显示底部'添加标签'按钮
     * @param keys
     * @param key
     */
    checkKeyIsExist(keys,key){
        for(let i = 0, len = keys.length; i<len; i++){
            if(key.toLowerCase() === keys[i].name.toLowerCase()){
                return true;
            }
        }
        return false;
    }

    /**
     * 添加标签
     */
    saveKey(){
        let key = this.inputKey;
        if(this.checkKeyIsExist(this.keys,key)) {
            this.toast.show(key + '已经存在', DURATION.LENGTH_LONG);
        } else {
            key = {
                "path": key,
                "name": key,
                "checked": true //默认订阅
            };
            this.keys.unshift(key);
            this.languageDao.save(this.keys);
            this.toast.show(key.name + '保存成功', DURATION.LENGTH_LONG);
            this.updateState({showBottomButton:false});
            this.isKeyChange = true;
        }
    }

    /**
     * 更新Project Item 收藏的状态
     */
    flushFavouriteState(){
        let projectModels = [];
        let items = this.items;
        for(var i=0,len=items.length;i<len;i++){
            projectModels.push(new ProjectModel(items[i],Utils.checkFavourite(items[i],this.favouriteKeys)));
        }
        this.updateState({
            isLoading: false,
            rightButtonText: '搜索',
            dataSource:this.getDataSource(projectModels)
        })
    }
    getDataSource(items) {
        return this.state.dataSource.cloneWithRows(items);
    }
    getFavouriteKeys(){
        this.favouriteDao.getFavouriteKeys()
            .then(keys=>{
                this.favouriteKeys = keys||[];
                this.flushFavouriteState();
            })
            .catch(e=>{
                this.flushFavouriteState();
            })
    }
    loadData(){
        this.updateState({
            isLoading:true
        });
        this.cancelable = makeCancelable(fetch(this.getFetchUrl(this.inputKey)));
        this.cancelable.promise
            .then(response=>response.json())
            .then((responseData)=>{
                //当前页面还在(没有被销毁)
                if(!this || !responseData || !responseData.items || responseData.items.length === 0){
                    this.toast.show(this.inputKey+'什么都没找到',DURATION.LENGTH_LONG);
                    this.updateState({
                        isLoading:false,
                        rightButtonText:'搜索'
                    });
                    return;
                }
                this.items = responseData.items;
                //如果用户已收藏,还要显示收藏状态
                this.getFavouriteKeys();

                if(!this.checkKeyIsExist(this.keys,this.inputKey)){
                    this.updateState({showBottomButton:true});
                }else{
                    this.updateState({showBottomButton:false});
                }
            })
            .catch((err)=>{
                this.updateState({
                    isLoading:false,
                    rightButtonText:'搜索'
                });
            })
    }
    getFetchUrl(key){
        return  URL + key + QUERY_STR;
    }

    updateState(dic){
        this.setState(dic)
    }
    onBackPress(){
        //隐藏键盘
        this.refs.input.blur();
        this.props.navigator.pop();
        return true; //告诉系统当前页面已经处理了返回事件
    }
    onRightButtonClick(){
        if(this.state.rightButtonText === '搜索'){
            this.updateState({rightButtonText:'取消'});
            this.loadData();
        }
        else{
            this.updateState({rightButtonText:'搜索',isLoading:false});
            //取消请求
            this.cancelable.cancel();
        }
    }
    renderNavBar(){
        let backButton = ViewUtil.getLeftButton(()=>this.onBackPress());
        let inputView = <TextInput
            onChangeText={(text)=>this.inputKey=text}
            ref="input"
            style={styles.textInput}
        >
        </TextInput>;
        let rightButton = <TouchableOpacity
            onPress={()=>{
                this.refs.input.blur(); //让输入框失去焦点,自动隐藏键盘
                this.onRightButtonClick()
            }}
        >
            <View style={styles.search}>
                <Text style={styles.searchText}>{this.state.rightButtonText}</Text>
            </View>
        </TouchableOpacity>;
        return <View style={[styles.navBar,this.props.theme.styles.navBar]}>
            {backButton}
            {inputView}
            {rightButton}
        </View>
    }
    renderRow(projectModel){
        return <RepositoryCell
            key={projectModel.item.id}
            projectModel={projectModel}
            theme={this.props.theme}
            onSelect={()=>ActionUtils.onSelectRepository({
                projectModel: projectModel,
                flag: FLAG_STORAGE.flag_popular,
                ...this.props
            })}
            onFavourite={(item,isFavourite)=>ActionUtils.onFavourite(
            this.favouriteDao,item,isFavourite,FLAG_STORAGE.flag_popular)}
        />
    }
    render() {
        let statusBar = null;
        if(Platform.OS === 'ios'){
            statusBar = <View style={[styles.statusBar,this.props.theme.styles.navBar]}/>
        }
        //数据加载时不显示ListView
        let listView = !this.state.isLoading ? <ListView
            dataSource={this.state.dataSource}
            //每行返回的视图
            renderRow = {(item)=> this.renderRow(item)}
        /> : null;
        let indicatorView = this.state.isLoading ?
            <ActivityIndicator
                size='large'
                animating={this.state.isLoading}
                style={styles.centering}
            />:null;
        let resultView = <View style={{flex:1}}>
            {indicatorView}
            {listView}
        </View>;
        let bottomButton = this.state.showBottomButton ?
            <TouchableOpacity
                onPress={()=>{
                    this.saveKey()
                }}
                style={[styles.bottomBtn,this.props.theme.styles.navBar]}>
                <View style={styles.bottomView}>
                    <Text style={styles.searchText}>添加标签</Text>
                </View>
            </TouchableOpacity> : null;
        return <View style={GlobalStyles.root_container}>
            {statusBar}
            {this.renderNavBar()}
            {resultView}
            {bottomButton}
            <Toast ref={toast=>this.toast=toast}/>
        </View>
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    statusBar:{
        height:20
    },
    navBar:{
        flexDirection:'row',
        alignItems:'center',
        height:(Platform.OS === 'ios') ? GlobalStyles.nav_bar_height_ios
            : GlobalStyles.nav_bar_height_android
    },
    textInput:{
        flex:1,
        height:(Platform.OS === 'ios') ? 30 : 40,
        borderWidth:(Platform.OS === 'ios') ? 1 :0,
        borderColor:'white',
        alignSelf:'center',
        marginRight:10,
        marginLeft:5,
        paddingLeft:10,
        borderRadius:3,
        opacity:0.7,
        color:'white'
    },
    search:{
        marginRight:10
    },
    searchText:{
        fontSize:18,
        color:'white',
        fontWeight:'500'
    },
    centering:{
        justifyContent :'center',
        alignItems:'center',
        flex:1
    },
    bottomBtn:{
        justifyContent:'center',
        alignItems:'center',
        opacity:0.9,
        height:40,
        position:'absolute',
        left:10,
        right:10,
        // top: GlobalStyles.window_height - 45,
        bottom:8,
        borderRadius:3
    },
    bottomView:{
        justifyContent :'center'
    }
});
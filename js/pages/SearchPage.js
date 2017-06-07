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
} from 'react-native';
import Toast,{DURATION} from 'react-native-easy-toast';
import RepositoryCell from '../common/RepositoryCell';
import ViewUtil from '../util/ViewUtil';
import GlobalStyles from '../../res/styles/GlobalStyles';
import FavouriteDao from '../expand/dao/FavouriteDao';
import {FLAG_STORAGE} from '../expand/dao/DataRepository';
import Utils from '../util/Utils';
import ActionUtils from '../util/ActionUtils';
import ProjectModel from '../model/ProjectModel';
const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';
export default class SearchPage extends Component {
    constructor(props) {
        super(props);
        //全局的,在不同页签下使用
        this.favouriteDao = new FavouriteDao(FLAG_STORAGE.flag_popular);
        this.favouriteKeys = [];
        this.state = {
            rightButtonText: '搜索',
            isLoading: false,
            dataSource: new ListView.DataSource({
                rowHasChanged: (r1, r2) => r1 !== r2
            })
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
        fetch(this.getFetchUrl(this.inputKey))
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
    componentDidMount() {
    }
    updateState(dic){
        this.setState(dic)
    }
    onBackPress(){
        //隐藏键盘
        this.refs.input.blur();
        this.props.navigator.pop();
    }
    onRightButtonClick(){
        if(this.state.rightButtonText === '搜索'){
            this.updateState({rightButtonText:'取消'})
            this.loadData();
        }
        else{
            this.updateState({rightButtonText:'搜索',isLoading:false})
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
        return <View style={styles.navBar}>
            {backButton}
            {inputView}
            {rightButton}
        </View>
    }
    renderRow(projectModel){
        return <RepositoryCell
            key={projectModel.item.id}
            projectModel={projectModel}
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
            statusBar = <View style={[styles.statusBar,{backgroundColor:'#2196F3'}]}/>
        }
        let listView = <ListView
            dataSource={this.state.dataSource}
            //每行返回的视图
            renderRow = {(item)=> this.renderRow(item)}
        />;
        return <View style={GlobalStyles.root_container}>
            {statusBar}
            {this.renderNavBar()}
            {listView}
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
        backgroundColor:'#2196F3',
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
    }
});
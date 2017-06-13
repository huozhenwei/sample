/**
 * Created by huozhenwei on 2017/5/31.
 * 详情页面
 */
import React,{Component} from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    WebView,
    Image,
    TouchableOpacity,
} from 'react-native';
import NavigationBar from '../common/NavigationBar';
import ViewUtil from '../util/ViewUtil';
import FavouriteDao from '../expand/dao/FavouriteDao';
import BackPressComponent from '../common/BackPressComponent';

const TRENDING_URL = 'https://github.com/';
export default class RepositoryDetail extends Component{
    constructor(props){
        super(props);
        let url = this.props.projectModel.item.html_url ?
            this.props.projectModel.item.html_url: TRENDING_URL + this.props.projectModel.item.fullName;
        let title = this.props.projectModel.item.full_name ?
            this.props.projectModel.item.full_name: this.props.projectModel.item.fullName;
        this.favouriteDao = new FavouriteDao(this.props.flag);
        this.state = {
            url:url,
            title:title,
            canGoBack:false,
            isFavourite:this.props.projectModel.isFavourite,
            favouriteIcon:this.props.projectModel.isFavourite?
                require('../../res/images/ic_star.png'):
                require('../../res/images/ic_star_navbar.png')
        };
        this.backPress = new BackPressComponent({backPress:(e)=>this.onBackPress(e)});
    }

    componentDidMount(){
        //让BackPressComponent组件注册监听
        this.backPress.componentDidMount();
    }
    onBackPress(e){
        this.onBack();
        return true; //告诉系统当前页面已经处理了返回事件
    }
    onBack(){
        //先判断,能返回就返回,不能就关闭
        if(this.state.canGoBack){
            this.webView.goBack(); //返回上一页
        }
        else{
            this.props.navigator.pop();
        }
    }

    //函数被回调时返回navState参数
    onNavigationStateChange = (navState) => {
        this.setState({
            canGoBack: navState.canGoBack,
            url:navState.url
        })
    }

    componentWillUnmount() {
        this.backPress.componentWillUnmount();
        if (this.props.onUpdateFavourite)this.props.onUpdateFavourite();
    }

    setFavoriteState(isFavourite) {
        this.setState({
            isFavourite: isFavourite,
            favouriteIcon: isFavourite ? require('../../res/images/ic_star.png')
                : require('../../res/images/ic_star_navbar.png')
        })
    }
    //favoriteIcon单击回调函数
    onRightButtonClick(){
        var projectModel = this.props.projectModel;
        this.setFavoriteState(projectModel.isFavourite = !projectModel.isFavourite);
        //Trending模块的数据,或者是Popular模块的
        var key = projectModel.item.fullName ? projectModel.item.fullName :projectModel.item.id.toString();
        if(projectModel.isFavourite){
            this.favouriteDao.saveFavouriteItem(key,JSON.stringify(projectModel.item));
        }
        else {
            this.favouriteDao.removeFavouriteItem(key);
        }
    }
    renderRightButton (){
        return <TouchableOpacity onPress={()=>this.onRightButtonClick()}>
            <Image
                style={{width: 20, height: 20,marginRight:10}}
                source={this.state.favouriteIcon}
            />
        </TouchableOpacity>;
    }
    render(){
        let titleLayoutStyle = this.state.title.length>20?{paddingRight:5}:null;
        return (
            <View style={styles.container}>
                <NavigationBar
                    title={this.state.title}
                    style={this.props.theme.styles.navBar}
                    titleLayoutStyle={titleLayoutStyle}
                    leftButton={ViewUtil.getLeftButton(()=>this.onBack())}
                    rightButton={this.renderRightButton()}
                />

                <WebView
                    ref={webView=>this.webView=webView}
                    source={{uri: this.state.url}}
                    onNavigationStateChange={(e)=>this.onNavigationStateChange(e)}
                    startInLoadingState={true}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1
    }
});
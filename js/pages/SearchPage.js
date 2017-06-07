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
    TouchableOpacity
} from 'react-native';
import NavigationBar from '../common/NavigationBar';
import ViewUtil from '../util/ViewUtil';
import GlobalStyles from '../../res/styles/GlobalStyles';
export default class SearchPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rightButtonText:'搜索'
        }
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
        }
        else{
            this.updateState({rightButtonText:'搜索'})
        }
    }
    renderNavBar(){
        let backButton = ViewUtil.getLeftButton(()=>this.onBackPress());
        let inputView = <TextInput
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
    render() {
        let statusBar = null;
        if(Platform.OS === 'ios'){
            statusBar = <View style={[styles.statusBar,{backgroundColor:'#2196F3'}]}/>
        }
        return <View style={GlobalStyles.root_container}>
            {statusBar}
            {this.renderNavBar()}
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
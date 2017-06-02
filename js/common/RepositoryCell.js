/**
 * Created by huozhenwei on 2017/5/29.
 */
import React, {Component} from 'react';

import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
} from 'react-native';

//用于显示 ListView中 每个项目信息
export default class RepositoryCell extends Component {
    constructor(props){
        super(props);
        this.state = {
            isFavourite:this.props.projectModel.isFavourite,
            favouriteIcon:this.props.projectModel.isFavourite?require('../../res/images/ic_star.png'):
                require('../../res/images/ic_unstar_transparent.png')
        }
    }
    //当传入的参数发生变化时,更新视图
    componentWillReceiveProps(nextProps){
        this.setFavouriteState(nextProps.projectModel.isFavourite)
    }
    setFavouriteState(isFavourite){
        this.setState({
            isFavourite:isFavourite,
            favouriteIcon:isFavourite?require('../../res/images/ic_star.png')
                :require('../../res/images/ic_unstar_transparent.png')
        })
    }
    onPressFavourite(){
        this.setFavouriteState(!this.state.isFavourite);
        //当前Cell组件通知PopularPage页面用户单击了图标,让PopularPage处理逻辑
        this.props.onFavourite(this.props.projectModel.item,!this.state.isFavourite);
    }
    
    render() {
        let item = this.props.projectModel.item ? this.props.projectModel.item:null;
        let favouriteButton = <TouchableOpacity
            onPress={()=>this.onPressFavourite()}
        >
            <Image
                style={[{width: 22,height: 22},{tintColor:'#2196F3'}]}
                source={this.state.favouriteIcon}/>
        </TouchableOpacity>;
        return <TouchableOpacity
            onPress={this.props.onSelect}
            style={styles.container}>
            <View style={styles.cell_container}>
                <Text style={styles.title}>{item.full_name}</Text>
                <Text style={styles.description}>{item.description}</Text>
                <View style={styles.bot}>
                    <View style={styles.botLeft}>
                        <Text>Author:</Text>
                        <Image
                            style={styles.avatarImage}
                            source={{uri:item.owner.avatar_url}}
                        />
                    </View>
                    <View style={styles.botCenter}>
                        <Text>Stars:</Text>
                        <Text>{item.stargazers_count}</Text>
                    </View>
                    {favouriteButton}
                </View>
            </View>
        </TouchableOpacity>
    }
}

const styles = StyleSheet.create({
    container:{
      flex:1
    },
    cell_container:{
        backgroundColor:'white',
        padding:10,
        marginLeft:5,
        marginRight:5,
        marginVertical:3,
        borderRadius:2,
        borderColor:'#dddddd',
        borderWidth:0.5,
        shadowColor:'gray',
        shadowOffset:{ width:0.5, height:0.5},
        shadowOpacity:0.4,
        shadowRadius:1,
        elevation:2 //安卓阴影
    },
    title: {
        fontSize: 16,
        marginBottom: 2,
        color: '#212121'
    },
    description: {
        fontSize: 14,
        marginBottom: 2,
        color: '#757575'
    },
    bot: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    botLeft: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    avatarImage: {
        height: 22,
        width: 22
    },
    botCenter: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    favourite: {
        width: 22,
        height: 22
    }
});
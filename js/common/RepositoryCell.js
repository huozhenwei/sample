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
    render() {
        return <TouchableOpacity
            onPress={this.props.onSelect}
            style={styles.container}>
            <View style={styles.cell_container}>
                <Text style={styles.title}>{this.props.data.full_name}</Text>
                <Text style={styles.description}>{this.props.data.description}</Text>
                <View style={styles.bot}>
                    <View style={styles.botLeft}>
                        <Text>Author:</Text>
                        <Image
                            style={styles.avatarImage}
                            source={{uri:this.props.data.owner.avatar_url}}
                        />
                    </View>
                    <View style={styles.botCenter}>
                        <Text>Stars:</Text>
                        <Text>{this.props.data.stargazers_count}</Text>
                    </View>
                    <Image
                        style={styles.favourite}
                        source={require('../../res/images/ic_star.png')}/>
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
        elevation:2, //安卓阴影
    },
    title: {
        fontSize: 16,
        marginBottom: 2,
        color: '#212121',
    },
    description: {
        fontSize: 14,
        marginBottom: 2,
        color: '#757575',
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
        width: 22,
    },
    botCenter: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    favourite: {
        width: 22,
        height: 22,
    }
});
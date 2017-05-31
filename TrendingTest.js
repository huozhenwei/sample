/**
 * Created by huozhenwei on 2017/5/31.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
} from 'react-native';
import NavigationBar from './js/common/NavigationBar';
import GitHubTrending from 'GitHubTrending';
const URL = 'https://github.com/trending/';
export default class TrendingTest extends Component {
    constructor(props) {
        super(props);
        this.trending = new GitHubTrending();
        this.state = {
            result: ''
        }
    }

    onLoad() {
        let url = URL + this.text;
        this.trending.fetchTrending(url)
            .then(result=> {
                this.setState({
                    result: JSON.stringify(result)
                })
            })
            .catch(err=> {
                this.setState({
                    result: JSON.stringify(err)
                })
            })
    }

    render() {
        return (
            <View style={styles.container}>
                <NavigationBar
                    title='GitHubTrending的使用'
                    style={{backgroundColor:'#2196F3'}}
                />
                <TextInput
                    style={styles.input}
                    onChangeText={(text)=>{
                        this.text = text;
                    }}
                />
                <View style={{flex:1}}>
                    <Text
                        style={styles.tips}
                        onPress={()=>this.onLoad()}
                    >加载数据</Text>
                    <Text style={{flex:1}}>{this.state.result}</Text>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tips: {
        fontSize: 20,
    },
    input: {
        height: 40,
        borderWidth: 1,
    }
});

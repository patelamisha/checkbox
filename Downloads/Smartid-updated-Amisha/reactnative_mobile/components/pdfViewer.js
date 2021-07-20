// This file is used to view PDF

import React from 'react';
import { StyleSheet, Dimensions, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
 
import Pdf from 'react-native-pdf';
 
export default class pdfViewer extends React.Component {
    
    render() {
        const source = {uri:this.props.route.params.source,cache:true};
        
 
        return (
            <View style={styles.container}>

                <View style={styles.backlocation}>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Signup')}>
                        <Icon size={30} name="arrow-left" color="#4c52ba"  ></Icon>
                    </TouchableOpacity>
                </View>

                <Pdf
                    source={source}
                    onLoadComplete={(numberOfPages,filePath)=>{
                        console.log(`number of pages: ${numberOfPages}`);
                    }}
                    onPageChanged={(page,numberOfPages)=>{
                        console.log(`current page: ${page}`);
                    }}
                    onError={(error)=>{
                        console.log(error);
                    }}
                    onPressLink={(uri)=>{
                        console.log(`Link presse: ${uri}`)
                    }}
                    style={styles.pdf}/>
            </View>
        )
  }
}
 
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 25,
    },
    pdf: {
        flex:1,
        width:Dimensions.get('window').width,
        height:Dimensions.get('window').height,
    }, 
    backlocation: {
        position: 'absolute',
        top: '3%',
        left: '3%',
        zIndex: 2,
      },
});
 
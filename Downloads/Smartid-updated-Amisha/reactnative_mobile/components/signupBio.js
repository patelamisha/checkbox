import React, { Component} from 'react';
import {Image, StyleSheet, Text, View, ActivityIndicator, ScrollView, TouchableHighlight} from 'react-native';


export default class SignupBio extends Component {

  //initialize variables
  constructor() {
    super();

    /*State variables used throughout the class React.Component
    Please view https://www.geeksforgeeks.org/component-state-react-native/ for more details on using state varibles */
    this.state = {
      email: '',
      isLoading: false,
      errorMessage: '',
      toggleBiometric: false,
    }
  }


  /* Builtin React Native function which is called AFTER the FIRST render of the page
  Please view https://reactjs.org/docs/react-component.html for more detail */
  componentDidMount() {
    this.setState({
      isLoading: false,
    })
  }

  //Function called to switch to the FaceRecog.js page which deals with the Biometrics registration
  toggleBiometricSetup = () =>{
    //Example on how to navigate between pages on ReactNative
    //Ex: signupBio -> FaceRecog
    this.props.navigation.navigate('FaceRecog')
  }

  //Custom function used to update State variables
  updateInputVal = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  }


  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.preloader}>
          <ActivityIndicator size="large" color="#9E9E9E" />
        </View>
      )
    }


    return (
      <ScrollView style={styles.container}>

        <View style={{ top: '5%' }}>
          <View style={styles.imgView}>
            <Image
              style={styles.imgSize}
              source={require('./logo.png')}
            />
          </View>

          <Text
            style={styles.mainText}>
            Biometrics Set Up
          </Text>

          <Text
            style={styles.subText}>
            Next, we will set up the biometrics component for your smartID
          </Text>
        </View>


        <View style={{ marginVertical: '5%', justifyContent: 'center' }}>
          <Image
            style={{width: '100%', height: '34%'}}
            source={require('./biometricsDemo.png')}
          />
        </View>


        <View style={{ marginVertical: '10%' }}>
            <TouchableHighlight
              style={{
                  backgroundColor: "#243c97",
                  borderColor: "#243c97",
                  borderRadius: 10,
                  borderWidth: 1,
                  height: 45,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginVertical: '5%'
              }}
              onPress={() => this.toggleBiometricSetup()}
            >
            <Text style={{ color: '#FFFFFF', fontWeight: "bold", fontSize: 16 }}>Begin Biometrics</Text>
            </TouchableHighlight>
        </View>

        <Text
          style={styles.errorText}>
          {this.state.errorMessage}
        </Text>

      </ScrollView>
    );
  }
}


//HTML/CSS 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    padding: 35,
    backgroundColor: '#fff'
  },
  errorText: {
    color: 'red',
    marginTop: 25,
    marginBottom: 100,
    textAlign: 'center'
  },
  preloader: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff'
  },
  imgSize: {
    width: 70,
    height: 70,
  },
  imgView: {
    textAlign: 'left',
    marginBottom: 20,
  },
  mainText: {
    fontSize: 35,
    fontWeight: "bold",
  },
  subText: {
    fontSize: 15,
    marginBottom: 50
  },
  bold: {
    fontWeight: 'bold'
  },
});
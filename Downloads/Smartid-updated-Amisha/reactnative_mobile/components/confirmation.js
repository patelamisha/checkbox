// components/confirmation.js

import React, { Component } from 'react';
import { Image, StyleSheet, Text, View, TextInput, Button, Alert, ActivityIndicator, TouchableHighlight } from 'react-native';
import { setToken, getToken } from './async_storage'

export default class confirmation extends Component {


  //initialize variables
  constructor(props) {
    super(props);
    this.state = {
      user: props.route.params.keycloakUser, // cognitoUser sent from signup.js. Change for keycloak
      saveEmail: props.route.params.storeEmail, // boolean to determine if REMEMBER ME feature was checked
      usePhoneBiometrics: props.route.params.usePhoneBiometrics, // boolean to determine if FACEID was checked

      code: '',
      errorMSG: '',
      isLoading: false,
      cognitoUser: null
    }
  }

  //update variables function
  updateInputVal = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  }

  /* This function allows users to resend the confirmation code. Currently, this is not operational however, when 
  implemnting such function, this can go here */
  resendConfirmationCode = async () => {
    console.log("Resending codes is not an option yet.")
  }


  /* CODE error checking. Checks that are included:
  1. check if code only contains digits 
  2. check if code is empty 
  ...... more can be added if needed 
  */
  errorCheck = () => {

    //ERROR CHECKING FUNCTION
    //return TRUE if there is an error caught
    //return FALSE if there is no error

    var errorMessage = ""

    //Check if code is empty 
    if (this.state.code == "") {
      errorMessage = "Invalid. Code cannot be empty"
      this.updateInputVal(errorMessage, 'errorMSG')
      return true
    }

    // if (!this.isNumeric(this.state.code)) {
    //   errorMessage = "Invalid. Code should only be digits"
    //   this.updateInputVal(errorMessage, 'errorMSG')
    //   return true
    // }
    return false
  }



  //Check if code is numeric. Code should only contain digits
  isNumeric = (str) => {
    if (typeof str != "string") return false // we only process strings!  
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
      !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
  }



  /* Function is used to make sure inputted code was the correct one for login */
  confirmLoginIn = async () => {

    //error checking basic user errors
    if (this.errorCheck())
      return

    try {
      //Start loading screen
      this.setState({
        isLoading: true,
      })

      //Calling Cognito sendCustomChallengeAnswer built-in function
      // var cognitoUser = await Auth.sendCustomChallengeAnswer(this.state.user, this.state.code);
      // console.log(cognitoUser)

      //Checking if code was successful. If not .signInUserSession is null
      // if (cognitoUser.signInUserSession == null) {
      //   //changing error message
      //   this.updateInputVal("Incorrect", 'errorMSG')

      //   //debug printing error to console
      //   console.log('error confirming sign up:', 'USER INPUT WRONG CODE');

      //   //set the loading icon off
      //   this.setState({
      //     isLoading: false,
      //   })

      //   //end the function if this statement is true
      //   return
      // }

      const confCode = await getToken('@conf_Code');
      console.log(confCode);
      if (this.state.code !== confCode) {

        this.updateInputVal("Incorrect", 'errorMSG');
        console.log('error confirming sign up:', 'USER INPUT WRONG CODE');

        this.setState({
          isLoading: false,
        })

        return;
      }

      ////////IF AUTH SUCCESSFUL DO THIS////////
      console.log(this.state.user);

      // This saves the users EMAIL, if the Save Email section is checked off. Users will not need to re-enter email
      if (this.state.saveEmail) {
        console.log('Saved email')
        await setToken('@user_email', this.state.user);
      }

      // This is used to save the use of FaceID/Phone built-in biometrics. Sets token to "1"
      if (this.state.usePhoneBiometrics) {
        console.log('Saved FaceID usage')
        await setToken('@use_phone_biometrics', "1"); //Async storage function used
      }


      // Async storage function used. With a successful login, save the users accessToken to the device. This MAY change when switching to 
      // keycloak
      // await setToken('@auth_token', cognitoUser.signInUserSession.accessToken.jwtToken);


      // Send user to dashboard
      this.props.navigation.navigate('Dashboard', {
        userEmail: this.state.user
      });



    } catch (error) {

      //else give error message. Check console for this
      this.updateInputVal(error.message, 'errorMSG')
      console.log('error confirming sign up', error);

      this.setState({
        isLoading: false,
      })
    }
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
      <View style={styles.container}>


        <View style={styles.imgView}>
          <Image
            style={styles.imgSize}
            source={require('./logo.png')}
          />
        </View>

        <Text
          style={styles.mainText}>
          Confirmation code has been sent to:
        </Text>

        <Text
          style={styles.emailText}>
          {this.state.user}
        </Text>


        <Text
          style={{ color: "red" }}>
          {this.state.errorMSG}
        </Text>

        <TextInput
          style={styles.inputStyle}
          placeholder="Enter code here"
          placeholderTextColor="#808080"
          keyboardType="number-pad"
          value={this.state.code}
          onChangeText={(val) => this.updateInputVal(val, 'code')}
        />

        <TouchableHighlight
          style={{
            backgroundColor: "#243c97",
            borderColor: "#243c97",
            borderRadius: 10,
            borderWidth: 1,
            height: 45,
            justifyContent: 'center',
            alignItems: 'center'
          }}
          onPress={() => this.confirmLoginIn()}
        >
          <Text style={{ color: '#FFFFFF', fontWeight: "bold", fontSize: 15 }}>Continue</Text>
        </TouchableHighlight>

        <Text
          style={styles.loginText}
          onPress={() => this.resendConfirmationCode()}>
          Resend code? Click here
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: 35,
    backgroundColor: '#fff'
  },
  inputStyle: {
    width: '100%',
    marginBottom: 15,
    paddingBottom: 8,
    paddingTop: 8,
    paddingLeft: 20,
    alignSelf: "center",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10
  },
  loginText: {
    color: '#243c97',
    marginTop: 25,
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
  mainText: {
    fontSize: 15,
    margin: 20,
    marginBottom: 0,
    textAlign: "center"
  },
  emailText: {
    fontSize: 17,
    fontWeight: "bold",
    margin: 20,
    marginTop: 0,
    marginBottom: 30,
    textAlign: "center"
  },
  imgSize: {
    width: 100,
    height: 100,
  },
  imgView: {
    alignItems: 'center',
    justifyContent: 'center',
    top: 0,
    marginBottom: 20,
  },
});
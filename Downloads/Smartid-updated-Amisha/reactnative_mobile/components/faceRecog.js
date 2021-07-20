'use strict';
import React, { PureComponent } from 'react';
import { AppRegistry, StyleSheet, Text, View, Alert, TouchableHighlight } from 'react-native';
import {RNCamera} from 'react-native-camera';
import Icon from 'react-native-vector-icons/FontAwesome';
import ProgressCircle from 'react-native-progress-circle'


export default class FaceRecog extends PureComponent {

  /* CURRENT BIOMETRICS PROCESS
  User will look from LEFT to RIGHT. Make sure angles are properly collected
  After every checkpoint, percentage increases by 12%
  After, send screenshots to API */


  constructor(props) {
    super(props);


      /*State variables used throughout the class React.Component
      Please view https://www.geeksforgeeks.org/component-state-react-native/ for more details on using state varibles */
      this.state = {
      isLoading: false,
      processState: false,
      setupPercentage: 0,
      yawAngle: null,
      yawCount: 0,

      beginBio: "Click to begin",
      beginButtonColor: "#F8F35C",


      instructions: {
        bigInstruct: "",
        smallInstruct: "",
        iconName: "angle-double-left",
        opacity: 0,
      },



      box: {
        width: 0,
        height: 0,
        x: 0,
        y: 0,
        yawAngle: 0,
        rollAngle: 0,
      },


      //These are the images that will be sent to the API for biomtetrics authentication
      biometrics: {
        img1: null,
        img2: null,
        img3: null,
        img4: null,
        img5: null,
        img6: null,
        img7: null,
        img8: null,
        img9: null,
      }

    };
  }

  render() {

    return (

      <View style={styles.container}>

        <View style={{ top: '5%', left: '5%'}}>
          <TouchableHighlight onPress={() => this.props.navigation.navigate('Signup')} style={styles.backButton}>
            <View>
              <Icon style={{ textAlign: "center" }} name="chevron-left" size={12} color="#243c97" ></Icon>
            </View>
          </TouchableHighlight>
        </View>


        <View style={{backgroundColor: '#fff',
          padding: 15,
          position: 'absolute',
          top: '5%',
          right: '5%'}}>

            <Text style={{fontSize: 18}}> {this.state.setupPercentage + '% ' + 'Complete' } </Text>
        </View>

        <View style={{opacity: this.state.instructions.opacity, justifyContent: 'center', alignSelf: "center", marginTop: '35%', marginBottom: '5%'}}>
          <Text style={{fontSize: 32, color: 'white'}}>  {this.state.instructions.bigInstruct} </Text>
          <Text style={{fontSize: 14, color: 'white'}}>  {this.state.instructions.smallInstruct} </Text>

          <View>
              <Icon style={{ textAlign: "center" }} name={this.state.instructions.iconName} size={60} color="white" ></Icon>
          </View>
        </View>

        

        <View style={{alignSelf: "center", marginTop: '1%', marginBottom: '20%'}}>

          <ProgressCircle
              percent={this.state.setupPercentage}
              radius={180}
              borderWidth={8}
              color="#3399FF"
              shadowColor="#990000"
              bgColor="#fff"
            >


            <View style={{ height: '100%', width: '100%', alignSelf: "center", borderRadius: 200, borderWidth: 1,  overflow: 'hidden'}}>

              {/* View this for more details on RNCameras face detection feature
              https://github.com/react-native-camera/react-native-camera/blob/master/docs/RNCamera.md#face-detection-related-props */}
              
                <RNCamera
                  ref={ref => {
                    this.camera = ref;
                  }}
                  style={styles.preview}
                  
                  faceDetectionMode={RNCamera.Constants.FaceDetection.Mode.accurate}
                  onFacesDetected={this.onFaceDetected}
                  autoFocus={RNCamera.Constants.AutoFocus.on}
                  type={RNCamera.Constants.Type.front}
                  flashMode={RNCamera.Constants.FlashMode.off}
                  captureAudio={false}
                  androidCameraPermissionOptions={{
                    title: 'Permission to use camera',
                    message: 'We need your permission to use your camera',
                    buttonPositive: 'Ok',
                    buttonNegative: 'Cancel',
                  }}
                >

                  {/* This view below is used to add a box around the users face during the process. If the box is needed
                  uncomment the section if needed */}

                    {/* <View style={{position: 'absolute', width: this.state.box.width, height: this.state.box.height, left: this.state.box.x, top: this.state.box.y, borderRadius: 1, borderWidth: 1,  borderColor: "blue",}}>
                      <TouchableHighlight >
                        <View>
                        </View>
                      </TouchableHighlight>
                    </View> */}

                    
                  </RNCamera>
            </View>
          </ProgressCircle>
        </View>

        

        <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
          <TouchableHighlight onPress={()=> this.processStart()} style={[styles.capture, {backgroundColor: this.state.beginButtonColor}]}>
            <Text style={{ fontSize: 14 }}> {this.state.beginBio} </Text>
          </TouchableHighlight>
        </View>

      </View>
    );
  }


  /* processStart is the function called when the user clicks "Begin" and starts the biometrics process */
  processStart = async () => {

    //checking if camera is on/valid and that processState is false
    //processState = boolean(determines if biometrics process is in-progress or not)
    if (this.camera && this.state.processState == false) {

      try {
        /* 
        change processState = true
        change beginBio text to "IN-PROGRESS"
        change button color
        */
        this.setState({processState: true})
        this.setState({beginBio: "IN-PROGRESS"})
        this.setState({beginButtonColor: "#990000"})

        /* Initial set of instructions for user for biometrics setup */
        this.setState({
          instructions: {
            bigInstruct: "Look Left",
            smallInstruct: "Slowly begin turning right",
            iconName: "angle-double-left",
            opacity: 1,
          }
        })

      } catch(err) {
        //Errors caught
        console.log(err)
      } 

    }
  };


  //takePicture function used to take screenshot of camera.
  // View https://github.com/react-native-camera/react-native-camera/blob/master/docs/RNCamera.md#takepictureasyncoptions-promise for more detail on takePictureAsync
  takePicture = async () => {
    if (this.camera) {
      const options = { quality: 0.5, base64: true };
      const data = await this.camera.takePictureAsync(options);
      console.log(data.uri);
    }
  }

  biometricCompletion= () => {
    //FUNCTION CALLED WHEN BIOMETRICS IS COMPLETE
    this.setState({processState: false})
    this.setState({beginBio: "COMPLETED"})
    this.setState({beginButtonColor: "F8F35C"})

    Alert.alert(
      "Biometrics Complete!",
      "Setup for Shoptaki FaceID is finished",
      [
        { text: "Continue with registration", onPress: () => {


          this.props.navigation.navigate('Signup', {toggleBiometrics: true})

        } }
      ],
      { cancelable: false }
    );
  }


  //Function calls everytime face is detected
  //View https://github.com/react-native-camera/react-native-camera/blob/master/docs/RNCamera.md#takepictureasyncoptions-promise for more details
  onFaceDetected = ({faces}) => {

    //faces[0] if valid, means A FACE ID DETECTED
    if (faces[0]) {

      //Used to change bounding box for face detection
      var bx = {
        width: faces[0].bounds.size.width,
        height: faces[0].bounds.size.height,
        x: faces[0].bounds.origin.x,
        y: faces[0].bounds.origin.y,
        yawAngle: faces[0].yawAngle,
        rollAngle: faces[0].rollAngle,
      }
      this.setState({box: bx})

      //Next step after every face detection
      this.biometricsSetup(faces[0].yawAngle)

    } else {

      //If no face is detected, set bounding box to 0(removes it temporary)
      var bx = {
        width: 0,
        height: 0,
        x: 0,
        y: 0,
        yawAngle: 0,
        rollAngle: 0,
      }
      this.setState({box: bx})
    }


    //Used for testing purposes. Logs the box values
    //console.log(this.state.box)
  }


  /* biometricsSetup function
  takes in {yawAngle} as input
  */

  biometricsSetup = (yawAngle) => {

    //printing yawAngle for testing purposes
    console.log({yawAngle: yawAngle}) //This is the latest yawAngle detected
    console.log({CurrentYawCollected: this.state.yawAngle}) //This is the current yaw stored

    /* If the processState = false
      This means the process has not begun
      END function if processState = false */
    if (this.state.processState == false){
      return
    }


    //No no current yawAngle collected, this means this is the start of the process
    if (this.state.yawAngle == null) {

      //yawAngle starts from LEFT
      if (yawAngle < -42.0 && yawAngle > -48.0) {
        this.setState({yawAngle: yawAngle})
        this.setState({setupPercentage: this.state.setupPercentage + 12})
        this.setState({yawCount: this.state.yawCount + 1})
        this.setState({
          instructions: {
            bigInstruct: "Look Left",
            smallInstruct: "Maintain slowly turning right",
            iconName: "angle-double-left",
            opacity: 1,
          }
        })

        /* Currently this is uncommented but, once API is complete, send information to API and take screenshot */
        // this.takePicture()
      }
      
    }
    else {

      /*CURRENT PROCESS */
      /* 
      User is going from left to right. Negative YAW to positive YAW.
      As the user proceeds, the yaw angle must increase. If it increases too much, 
      no increase in percentage. Must increase within a difference of +10. This 
      increases percentage by 12%
      */

      if ((yawAngle < -26) && (yawAngle > -34) && (this.state.yawCount == 1)){
        this.setState({setupPercentage: this.state.setupPercentage + 12})
        this.setState({yawAngle: yawAngle})
        this.setState({yawCount: this.state.yawCount + 1})
        this.setState({
          instructions: {
            bigInstruct: "Look Slight Left",
            smallInstruct: "Maintain slowly turning right",
            iconName: "angle-double-left",
            opacity: 1,
          }
        })
      } else if ((yawAngle < -12) && (yawAngle > -18) && (this.state.yawCount == 2)){
        this.setState({setupPercentage: this.state.setupPercentage + 12})
        this.setState({yawAngle: yawAngle})
        this.setState({yawCount: this.state.yawCount + 1})
        this.setState({
          instructions: {
            bigInstruct: "Look Slight Left",
            smallInstruct: "Maintain slowly turning right",
            iconName: "angle-left",
            opacity: 1,
          }
        })
      }
      else if ((yawAngle < -7) && (yawAngle > -12) && (this.state.yawCount == 3)){
        this.setState({setupPercentage: this.state.setupPercentage + 12})
        this.setState({yawAngle: yawAngle})
        this.setState({yawCount: this.state.yawCount + 1})
        this.setState({
          instructions: {
            bigInstruct: "Look Slight Left",
            smallInstruct: "Maintain slowly turning right",
            iconName: "angle-left",
            opacity: 1,
          }
        })
      }
      else if ((yawAngle < 3) && (yawAngle > -3) && (this.state.yawCount == 4)){
        this.setState({setupPercentage: this.state.setupPercentage + 12})
        this.setState({yawAngle: yawAngle})
        this.setState({yawCount: this.state.yawCount + 1})
        this.setState({
          instructions: {
            bigInstruct: "Look straight",
            smallInstruct: "Maintain slowly turning right",
            iconName: "angle-up",
            opacity: 1,
          }
        })
      }
      else if ((yawAngle < 12) && (yawAngle > 7) && (this.state.yawCount == 5)) {
        this.setState({setupPercentage: this.state.setupPercentage + 12})
        this.setState({yawAngle: yawAngle})
        this.setState({yawCount: this.state.yawCount + 1})
        this.setState({
          instructions: {
            bigInstruct: "Look Slight Right",
            smallInstruct: "Maintain slowly turning right",
            iconName: "angle-right",
            opacity: 1,
          }
        })
      }
      else if ((yawAngle < 18) && (yawAngle > 12) && (this.state.yawCount == 6)){
        this.setState({setupPercentage: this.state.setupPercentage + 12})
        this.setState({yawAngle: yawAngle})
        this.setState({yawCount: this.state.yawCount + 1})
        this.setState({
          instructions: {
            bigInstruct: "Look Slight Right",
            smallInstruct: "Maintain slowly turning right",
            iconName: "angle-right",
            opacity: 1,
          }
        })
      }
      else if ((yawAngle < 33) && (yawAngle > 27) && (this.state.yawCount == 7)){
        this.setState({setupPercentage: this.state.setupPercentage + 12})
        this.setState({yawAngle: yawAngle})
        this.setState({
          instructions: {
            bigInstruct: "Look Right",
            smallInstruct: "Maintain slowly turning right",
            iconName: "angle-double-right",
            opacity: 1,
          }
        })
        this.setState({yawCount: this.state.yawCount + 1})
      }
      else if ((yawAngle < 48) && (yawAngle > 42) && (this.state.yawCount == 8)){



        this.setState({setupPercentage: 100})
        this.setState({yawAngle: yawAngle})
        this.setState({yawCount: this.state.yawCount + 1})
        this.setState({
          instructions: {
            bigInstruct: "Look Right",
            smallInstruct: "Maintain slowly turning right",
            iconName: "angle-double-right",
            opacity: 1,
          }
        })
      }
  
    }

    //once setup is complete
    if (this.state.setupPercentage >= 100){
      this.setState({
        instructions: {
          bigInstruct: "Look Slight Left",
          smallInstruct: "Maintain slowly turning right",
          iconName: "angle-left",
          opacity: 0,
        }
      })
      this.biometricCompletion()
    }

  }

}



//CSS content
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black'
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderRadius: 10
  },
  capture: {
    flex: 0,
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
    width: '85%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: '#fff',
    borderRadius: 150,
    padding: 15,
    position: 'absolute',
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
});
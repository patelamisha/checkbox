import React from 'react';
import { StyleSheet, View, Text, ActivityIndicator, ScrollView } from 'react-native';
import { Auth } from 'aws-amplify';
import Icon from 'react-native-vector-icons/FontAwesome';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { fetchUserData, searchuserBackend } from '../database/datafetch'


export default class Id extends React.Component {

  constructor(props) {
    super(props);

    //All variables in the id screen
    this.state = {
      keycloakUser: props.route.params.userEmail,
      userSub: 'N/A',
      fullName: 'N/A',
      smartID: 'N/A',
      dateofBirth: 'N/A',
      countryRes: 'N/A',
      validDate: 'N/A',
      countryOrigin: 'N/A',
      isLoading: true,
      isQRcodeVisible: false,
      certificiateList: null,
      licenceList: null
    }
  }

  //function used to update the variables
  //val is the value and prop is the name of the variable
  updateInputVal = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  }

  /* Builtin React Native function which is called AFTER the FIRST render of the page
  Please view https://reactjs.org/docs/react-component.html for more detail */
  async componentDidMount() {

    //Getting current user
    await this.currentUser()
    let user_data = await fetchUserData(this.state.userSub)
    console.log(user_data)
    this.updateInputVal(user_data.FirstName + ' ' + user_data.LastName, 'fullName')
    console.log(this.state.fullName)

    /* Commented out this section to avoid issues with the ArangoDB/API instance being down. 
    Uncomment when the team has the DB up and running again */

    // //fetching the data
    // let data = await fetchUserData(this.state.userSub)

    // //fill in data components here
    // this.updateInputVal(data.FirstName + ' ' + data.LastName, 'fullName')
    // this.updateInputVal(data.dateofBirth, 'dateofBirth')
    // this.updateInputVal(data.smartID, 'smartID')


    // let data_certificates = await fetchUserCertificate(this.state.userSub)

    // //SAVING CERTIFICATIONS
    // this.setState({
    //   certificiateList: data_certificates
    // })

    //Data has been fetched. Remove loading screen
    this.setState({
      isLoading: false,
    })

  }

  // Check if Cognito user is authenticated
  isAuthenticated = async () => {
    try {
      await Auth.currentSession();
      return true;
    } catch {
      return false;
    }
  }

  // Getting the current authenticated user
  currentUser = async () => {
    try {

      //initial keycloakUser is user email address sent from dashboard.js
      const keycloakUser = await searchuserBackend(this.state.keycloakUser)
      //console.log(keycloakUser);
      //Assign keyclaok user id to userSub
      this.updateInputVal(keycloakUser.id, 'userSub')
      //Assign keycloak user information to keycloakUser
      this.updateInputVal(keycloakUser, 'keycloakUser')
      // Logged for testing purposes. Contains a large structure of cognito user information. Uncomment to view in console.
      // console.log(cognitoUser)
    } catch (e) {
      // If an error is caught, print error and send usr back to login page
      // Change situation if needed
      console.log(e)
      this.props.navigation.navigate('Dashboard')
    }
  };


  // This function is used to generate the certificates connected to users
  certificiateList = (certs) => {

    if (certs == null) {
      return (
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          <Text style={{ fontSize: 18 }}> Not Available </Text>
        </View>
      )
    } else {

      return certs.map((item) => {
        return (
          <View key={item.Cert._key} style={{ flexDirection: "row", justifyContent: "flex-end" }}>

            <View style={{ flexDirection: "column" }}>
              <View style={{ flexDirection: "column" }}>
                <Text style={styles.textStyleCtitle}>
                  {item.Comp.title}
                </Text>
                <Text style={styles.textStyleC}>
                  {item.Comp.Industry}
                </Text>
              </View>
            </View>

            <View style={{ flexDirection: "column" }}>
              <View style={{ flexDirection: "column" }}>
                <Text style={styles.textStyleDate}>
                  {item.Cert.start_date + " - " + item.Cert.end_date}
                </Text>
              </View>
            </View>

          </View>
        );
      });
    }
  }

  //Function used to display licences
  licenseList = (certs) => {

    if (certs == null) {
      return (
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          <Text style={{ fontSize: 18 }}> Not Available </Text>
        </View>
      )
    } else {

      return certs.map((item) => {
        return (
          <View key={item.Cert._key} style={{ flexDirection: "row", justifyContent: "flex-end" }}>

            <View style={{ flexDirection: "column" }}>
              <View style={{ flexDirection: "column" }}>
                <Text style={styles.textStyleCtitle}>
                  {item.Comp.title}
                </Text>
                <Text style={styles.textStyleC}>
                  {item.Comp.Industry}
                </Text>
              </View>
            </View>

            <View style={{ flexDirection: "column" }}>
              <View style={{ flexDirection: "column" }}>
                <Text style={styles.textStyleDate}>
                  {item.Cert.start_date + " - " + item.Cert.end_date}
                </Text>
              </View>
            </View>

          </View>
        );
      });
    }
  }


  render() {
    //Loading screen if loading variable is true
    if (this.state.isLoading) {
      return (
        <View style={styles.preloader}>
          <ActivityIndicator size="large" color="#9E9E9E" />
        </View>
      )
    }

    //HTML/CSS style for screen
    return (
      <View style={styles.container}>

        <View style={styles.mainBackground}>

          <View style={styles.mainHeader}>

            <Text style={styles.textStyleName}>
              {this.state.fullName}
            </Text>

            <Text style={styles.textStyleID}>
              Smart ID: {this.state.smartID}
            </Text>

            <View style={{ flexDirection: "row", justifyContent: "center" }}>

              <View style={{ flexDirection: "column" }}>
                <View style={{ flexDirection: "column" }}>
                  <Text style={styles.textStyleRtitle}>
                    Date Of Birth:
                  </Text>
                  <Text style={styles.textStyleR}>
                    {this.state.dateofBirth}
                  </Text>
                </View>

                <View style={{ flexDirection: "column" }}>
                  <Text style={styles.textStyleRtitle}>
                    Country of Origin:
                  </Text>
                  <Text style={styles.textStyleR}>
                    {this.state.countryOrigin}
                  </Text>
                </View>
              </View>


              <View style={{ flexDirection: "column" }}>
                <View style={{ flexDirection: "column" }}>
                  <Text style={styles.textStyleRtitle}>
                    Valid until:
                  </Text>
                  <Text style={styles.textStyleR}>
                    {this.state.validDate}
                  </Text>
                </View>

                <View style={{ flexDirection: "column" }}>
                  <Text style={styles.textStyleRtitle}>
                    Country of Residence:
                  </Text>
                  <Text style={styles.textStyleR}>
                    {this.state.countryRes}
                  </Text>
                </View>
              </View>
            </View>

          </View>
        </View>

        <View style={styles.backlocation}>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('Dashboard')}>
            <Icon size={30} name="arrow-left" color="#e3d966" backgroundColor="#4c52ba" ></Icon>
          </TouchableOpacity>
        </View>

        <ScrollView nestedScrollEnabled={true} contentContainerStyle={{ justifyContent: 'center', alignContent: 'center' }} style={styles.bottomContainer}>

          <ScrollView nestedScrollEnabled={true} style={styles.subBackground}>
            <Text style={styles.textStyleC}>
              Certifications
            </Text>
            {this.certificiateList(this.state.certificiateList)}
          </ScrollView>

          <ScrollView nestedScrollEnabled={true} style={styles.subBackground}>
            <Text style={styles.textStyleC}>
              Licences
            </Text>
            {this.licenseList(null)}

          </ScrollView>

        </ScrollView>


      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
    backgroundColor: '#fff'
  },
  mainBackground: {
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: '100%',
    height: '38%',
    backgroundColor: '#4c52ba',
    borderBottomEndRadius: 40,
    borderBottomStartRadius: 40
  },
  mainHeader: {
    marginTop: 20

  },
  bottomContainer: {
    width: '100%',
    top: '35%',
    height: '100%',
  },
  subBackground: {
    marginBottom: 40,
    marginLeft: 20,
    paddingTop: 10,
    paddingBottom: 10,
    width: '90%',
    height: 175,
    backgroundColor: 'white',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#d6d6d6',
  },
  qrlocation: {
    position: 'absolute',
    top: 5,
    right: 5,
    zIndex: 2,
  },
  qrView: {
    width: '100%',
    height: '85%',
    alignItems: "center",
    backgroundColor: "#fff",
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
    borderBottomStartRadius: 20,
    borderBottomEndRadius: 20,
  },
  textStyleR: {
    fontSize: 12,
    color: '#fff',
    marginBottom: 20,
    marginStart: 60,
    marginEnd: 40
  },
  textStyleRtitle: {
    fontSize: 12,
    marginEnd: 60,
    marginStart: 60,
    color: '#bababa',
  },
  textStyleC: {
    fontSize: 12,
    color: '#505050',
    marginTop: 5,
    marginBottom: 10,
    marginStart: 30,
    marginEnd: 40
  },
  textStyleCtitle: {
    fontSize: 15,
    marginStart: 30,
    marginEnd: 50,
    marginTop: 15,
    width: 105,
    color: '#000',
  },
  textStyleDate: {
    fontSize: 12,
    color: '#505050',
    marginTop: 20,
    marginEnd: 20
  },
  textStyleName: {
    fontSize: 36,
    color: '#fff',
    marginBottom: 5,
    fontWeight: 'bold',
    alignSelf: "center",
  },
  textStyleID: {
    fontSize: 16,
    color: '#f5bd1f',
    marginBottom: 20,
    alignSelf: "center",
  },
  imgSize: {
    width: 125,
    height: 125,
    borderWidth: 10,
    borderRadius: 20,
    borderColor: '#3e428c',
  },
  imgView: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  backlocation: {
    position: 'absolute',
    top: '5%',
    left: '5%',
    zIndex: 2,
  }
});
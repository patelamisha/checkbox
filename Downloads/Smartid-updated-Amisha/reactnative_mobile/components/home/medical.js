import { createIconSetFromFontello } from 'react-native-vector-icons';
import fontelloConfig from '../config.json';
import { Dimensions } from "react-native";
import React from "react";
import { StyleSheet, Text, View, ScrollView, FlatList } from "react-native";
import ProgressCircle from "react-native-progress-circle";
import {
  TouchableHighlight,
  TouchableOpacity,
} from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/FontAwesome";
import {
  fetchCovidInfo,
  fetchUserCertificate,
  fetchUserMedication,
  fetchUserVax,
  fetchUserObs,
  fetchUserClaim,
  fetchUserEnc,
  fetchUserCon,
  fetchUserPra,
  fetchUserDiaRep,
  fetchUserMediReq,
  fetchUserPat,
  fetchUserCar,
  searchuserBackend
} from "../database/datafetch";
import { Auth } from "aws-amplify";
import LinearGradient from 'react-native-linear-gradient';
import { fetchUserData } from '../database/datafetch'

export default class Medication extends React.Component {
  constructor(props) {
    super(props);

    //All variables in the id screen
    this.state = {
      keycloakUser: props.route.params.userEmail,
      userSub: "",
      fullName: "",
      lastTemp: 100,
      vaxStatus: "N/A",
      dose1: "N/A",
      dose2: "N/A",
      covidResult: false,
      medicationList: null,
      vaccineList: null,
      patientInfo: null,
      observationInfo: null,
      isLoading: true,
      showVax: false,
      showTestResults: false,
      showVitals: false,
      showMedications: false,
      fetchUserPat: false,
      fetchUserObs: false,
    };
  }


  //function used to update the variables
  //val is the value and prop is the name of the variable
  updateInputVal = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  };

  showVitalsFunc() {
    this.updateInputVal(true, "showVitals");
    this.updateInputVal(false, "showMedications");
    this.updateInputVal(false, "showTestResults");
    this.updateInputVal(false, "showVax");
    this.updateInputVal(false, "fetchUserPat");
    this.updateInputVal(false, "fetchUserObs");

  }

  showMedsFunc() {
    this.updateInputVal(false, "showVitals");
    this.updateInputVal(true, "showMedications");
    this.updateInputVal(false, "showTestResults");
    this.updateInputVal(false, "showVax");
    this.updateInputVal(false, "fetchUserPat");
    this.updateInputVal(false, "fetchUserObs");

  }

  showVaxFunc() {
    this.updateInputVal(false, "showVitals");
    this.updateInputVal(false, "showMedications");
    this.updateInputVal(true, "showVax");
    this.updateInputVal(false, "showMedications");
    this.updateInputVal(false, "fetchUserPat");
    this.updateInputVal(false, "fetchUserObs");

  }
  showPatientInfo() {
    this.updateInputVal(false, "showVax");
    this.updateInputVal(false, "showVitals");
    this.updateInputVal(false, "showMedications");
    this.updateInputVal(true, "fetchUserPat");
    this.updateInputVal(false, "fetchUserObs");
  }
  showObserFunc() {
    this.updateInputVal(false, "showVitals");
    this.updateInputVal(false, "showMedications");
    this.updateInputVal(false, "showVax");
    this.updateInputVal(false, "fetchUserPat");
    this.updateInputVal(true, "fetchUserObs");

  }

  //fetching data from arangodb
  async componentDidMount() {
    //Getting current user
    await this.currentUser()
    let user_data = await fetchUserData(this.state.userSub)
    console.log(user_data)
    this.updateInputVal(user_data.FirstName + ' ' + user_data.LastName, 'fullName')
    console.log(this.state.fullName)
    // console.log(user_data)

    /* Commented out this section to avoid issues with the ArangoDB/API instance being down.
        Uncomment when the team has the DB up and running again */

    // //Call apis to get information to populate the pages
    // let data_meds = await fetchUserMedication(this.state.userSub)
    // let data_vax = await fetchUserVax(this.state.userSub)
    // let covid_data = await fetchCovidInfo(this.state.userSub)
    // let claim_data = await fetchUserClaim(this.state.userSub)

    // //Saving data from apis
    // this.setState({
    // medicationList: data_meds,
    // vaccineList: data_vax.entry,
    // dose1: covid_data.coding[1].occurrenceDateTime.substring(0,10),
    // dose2: covid_data.coding[1].occurrenceDateTime.substring(0,10)
    // })

    //Data has been fetched. Remove loading screen
    this.setState({
      isLoading: false,
    });
  }

  //check if user is authenticated
  isAuthenticated = async () => {
    try {
      await Auth.currentSession();
      return true;
    } catch {
      return false;
    }
  };

  //getting the current user that is authenicated
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

  patientInfo = (uid) => {
    if (uid == null) {
      return (
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          <Text style={{ fontSize: 18 }}>Not Available</Text>
        </View>
      );
    } else {
      return uid.map((item) => {
        return (
          <View
            key={item.patient._key}
            style={{ flexDirection: "row", justifyContent: "center" }}
          >
            <View style={{ flexDirection: "column", width: "80%" }}>
              <Text style={styles.textStyleTitle}>{item.patient.name}</Text>
              <Text style={styles.textStyleSub}>{item.patient.name}</Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                width: "20%",
                paddingRight: 10,
              }}
            >
              <View style={{ flexDirection: "column", width: "100%" }}>
                <Text style={styles.textStyleR}>{item.patient.name}</Text>
              </View>
            </View>
          </View>
        );
      });
    }
  };

  observationInfo = (uid) => {
    if (uid == null) {
      return (
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          <Text style={{ fontSize: 18 }}>Not Available</Text>
        </View>
      );
    } else {
      return uid.map((item) => {
        return (
          <View
            key={item.patient._key}
            style={{ flexDirection: "row", justifyContent: "center" }}
          >
            <View style={{ flexDirection: "column", width: "80%" }}>
              <Text style={styles.textStyleTitle}>{item.patient.name}</Text>
              <Text style={styles.textStyleSub}>{item.patient.name}</Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                width: "20%",
                paddingRight: 10,
              }}
            >
              <View style={{ flexDirection: "column", width: "100%" }}>
                <Text style={styles.textStyleR}>{item.patient.name}</Text>
              </View>
            </View>
          </View>
        );
      });
    }
  };

  medicationList = (meds) => {
    if (meds == null) {
      return (
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          <Text style={{ fontSize: 18 }}> Not Available </Text>
        </View>
      );
    } else {
      return meds.map((item) => {
        return (
          <View
            key={item.Med._key}
            style={{ flexDirection: "row", justifyContent: "flex-start" }}
          >
            <View style={{ flexDirection: "column", width: "80%" }}>
              <Text style={styles.textStyleTitle}>{item.Med.name}</Text>
              <Text style={styles.textStyleSub}>{item.Dose.frequency}</Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                width: "20%",
                paddingRight: 10,
              }}
            >
              <View style={{ flexDirection: "column", width: "100%" }}>
                <Text style={styles.textStyleR}>{item.Dose.dose}</Text>
              </View>
            </View>
          </View>
        );
      });
    }
  };

  vaccineList = (vax) => {
    if (vax == null) {
      return (
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          <Text style={{ fontSize: 18 }}> Not Available </Text>
        </View>
      );
    } else {
      return vax.map((item) => {
        return (
          <View
            key={item.resource.id}
            style={{ flexDirection: "row", justifyContent: "flex-start" }}
          >
            <View style={{ flexDirection: "column", width: "60%" }}>
              <Text style={styles.textStyleTitle}>
                {item.resource.vaccineCode.text}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                width: "40%",
                paddingRight: 10,
              }}
            >
              <View style={{ flexDirection: "column", width: "100%" }}>
                <Text style={styles.textStyleR}>
                  {item.resource.status == "completed"
                    ? "Vaccinated"
                    : "Not Vaccinated"}
                </Text>
                <Text style={[styles.textStyleR, { marginTop: 5 }]}>
                  {(
                    item.resource.occurrenceDateTime.substring(5, 10) +
                    "/" +
                    item.resource.occurrenceDateTime.substring(0, 4)
                  ).replace("-", "/")}
                </Text>
              </View>
            </View>
          </View>
        );
      });
    }
  };

  render() {
    const Medical = createIconSetFromFontello(fontelloConfig);
    return (
      <View style={styles.container}>
        <View style={styles.mainBackground}>
          <LinearGradient colors={['#00001a', '#000066', '#000099', '#0000cc']} style={styles.linearGradient}>
            <Text
              style={{
                fontSize: 25,
                color: "#ffffff",
                fontWeight: "bold",
                marginBottom: 5,
                marginTop: 15,
                alignSelf: "center",
              }}
            >
              {this.state.fullName}
            </Text>
            <Text
              style={{
                fontSize: 17,
                color: "#e3d966",
                marginBottom: 15,
                alignSelf: "center",
              }}
            >
              Medical Records
            </Text>
          </LinearGradient>
        </View>

        <View style={styles.backlocation}>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("Dashboard")}
          >
            <Icon
              size={30}
              name="chevron-left"
              color="#e3d966"
            ></Icon>
          </TouchableOpacity>
        </View>

        {/* <View style={styles.vaxStatusCard}>
          <Text
            style={[styles.textStyleSub, { paddingBottom: 7 }]}
            //MAKE THIS ELEMENT TOUCHABLE
            //DISPLAY COVID VACCINE TYPE (pfizer, moderna ...)
          >
            Covid Vaccination Status
          </Text>
          <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
            <View style={{ flexDirection: "column" }}>
              <Text style={styles.textStyleVaxStatus}>
                {this.state.vaxStatus}
              </Text>
            </View>
            <View
              style={{ flexDirection: "column", padding: 10 }}
              //DOSAGE INFO - CURRENTLY DISPLAYS SAME DATE FOR BOTH DOSES
              //WILL BE CHANGED WHEN DOSAGE INFO IS UPDATED IN THE JSON REQUEST
            >
              <View style={{ flexDirection: "row" }}>
                <View
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 10,
                    marginVertical: 5,
                    backgroundColor: "#00ff00",
                  }}
                ></View>
                <Text style={styles.textStyleCard}>
                  Dose 1{" "}
                  {this.state.dose1.substring(5, 10).replace("-", "/") +
                    "/" +
                    this.state.dose1.substring(0, 4)}
                </Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <View
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 10,
                    marginVertical: 5,
                    backgroundColor: "#ff0000",
                  }}
                ></View>
                <Text style={styles.textStyleCard}>
                  Dose 2{" "}
                  {this.state.dose2.substring(5, 10).replace("-", "/") +
                    "/" +
                    this.state.dose2.substring(0, 4)}
                </Text>
              </View>
            </View>
          </View>
        </View> */}
        {this.state.fetchUserObs && ( //DISPLAYS MEDICATION DATA
          <View style={styles.dataCard}>
            <ScrollView>
              <Text style={styles.textStyleSub}>Observation </Text>
              {this.observationInfo(this.state.observationInfo)}
            </ScrollView>
          </View>
        )}
        {this.state.fetchUserPat && (//DISPLAYS Patient DATA
          <View style={styles.dataCard}>
            <ScrollView>
              <Text style={styles.textStyleSub}>Patient information</Text>
              {this.patientInfo(this.state.patientInfo)}
            </ScrollView>
          </View>
        )}
        {this.state.showMedications && ( //DISPLAYS MEDICATION DATA
          <View style={styles.dataCard}>
            <ScrollView>
              <Text style={styles.textStyleSub}>Medications </Text>
              {this.medicationList(this.state.medicationList)}
            </ScrollView>
          </View>
        )}

        {this.state.showVax && (
          <View style={[styles.dataCard, { paddingBottom: 10 }]}>
            <ScrollView>
              <Text style={styles.textStyleSub}>Vaccinations</Text>
              {this.vaccineList(this.state.vaccineList)}
            </ScrollView>
          </View>
        )}

        {this.state.showVitals && (
          <View style={styles.dataCard}>
            <Text style={styles.textStyleSub}>Recent Records</Text>

            <View
              style={{ flexDirection: "row", justifyContent: "flex-start" }}
            >
              <View
                style={{ flexDirection: "column", padding: 10, marginLeft: 20 }}
              >
                <View style={{ flexDirection: "column" }}>
                  <Text style={styles.textStyleCard}>Last Covid Result</Text>
                  <Text style={styles.textStyleBold}>Negative</Text>
                </View>

                <View style={{ padding: 5 }}></View>

                <View style={{ flexDirection: "column" }}>
                  <Text style={styles.textStyleCard}>Last Covid Test</Text>
                  <Text style={styles.textStyleCard}>01/01/21</Text>
                </View>
              </View>

              <View
                style={{
                  flexDirection: "column",
                  marginBottom: 20,
                  marginLeft: "20%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <ProgressCircle
                  percent={this.state.lastTemp}
                  radius={22}
                  borderWidth={3}
                  color={
                    this.state.lastTemp < 99
                      ? "#00ff00"
                      : this.state.lastTemp < 100.2
                        ? "#ffae42"
                        : "#ff0000"
                  }
                  shadowColor="#f2f2f2"
                  bgColor="#f2f2f2"
                >
                  <Text style={{ fontSize: 12 }}> 99.7 </Text>
                </ProgressCircle>
                <Text
                  style={{ textAlign: "center", fontSize: 12, paddingTop: 5 }}
                >
                  {"Last Recorded\nTemperature"}
                </Text>
              </View>
            </View>

            <View
              style={{ flexDirection: "row", justifyContent: "flex-start" }}
            >
              <View
                style={{
                  flexDirection: "column",
                  paddingTop: 10,
                  marginLeft: 30,
                }}
              >
                <View style={{ flexDirection: "column" }}>
                  <Text style={styles.textStyleGrey}>Height</Text>
                  <Text style={styles.textStyleCard}>5'11</Text>
                </View>

                <View style={{ padding: 5 }}></View>

                <View style={{ flexDirection: "column" }}>
                  <Text style={styles.textStyleGrey}>Weight</Text>
                  <Text style={styles.textStyleCard}>150 lbs</Text>
                </View>
              </View>

              <View
                style={{
                  flexDirection: "column",
                  paddingTop: 10,
                  marginStart: -15,
                }}
              >
                <View style={{ flexDirection: "column" }}>
                  <Text style={styles.textStyleGrey}>Waist</Text>
                  <Text style={styles.textStyleCard}>32 in</Text>
                </View>

                <View style={{ padding: 5 }}></View>

                <View style={{ flexDirection: "column" }}>
                  <Text style={styles.textStyleGrey}>BMI</Text>
                  <Text style={styles.textStyleCard}>28</Text>
                </View>
              </View>

              <View
                style={{
                  flexDirection: "column",
                  paddingTop: 10,
                  marginStart: -15,
                }}
              >
                <View style={{ flexDirection: "column" }}>
                  <Text style={styles.textStyleGrey}>Stat</Text>
                  <Text style={styles.textStyleCard}>NA</Text>
                </View>

                <View style={{ padding: 5 }}></View>

                {/* <View style={{ flexDirection: "column" }}>
                  <Text style={styles.textStyleGrey}>Stat</Text>
                  <Text style={styles.textStyleCard}>NA</Text>
                </View> */}
              </View>
            </View>
          </View>
        )}

        {/* <View  style={[styles.bottomContainer]}> */}
        <ScrollView stickyHeaderIndices={[1]} style={styles.scrollcontainer}>
          <View style={styles.containerx}>
            <View style={styles.box}>
              <TouchableOpacity
                //style={[styles.wrapper]}
                onPress={() => this.showVaxFunc()}>
                <View >
                  <Medical
                    style={{ textAlign: "center" }}
                    size={70}
                    color={"#00004d"}
                    name='vaccine'
                  ></Medical>
                  <Text style={{
                    fontSize: 19,
                    color: "#00004d",
                    marginTop: 5,
                    fontWeight: "bold",
                    alignSelf: "center",
                    textAlign: "center"
                  }}>Vaccinations</Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.box}>
              <TouchableOpacity
                //style={[styles.wrapper]}
                //onPress={() => this.showVaxFunc()}>
                onPress={() => this.showObserFunc()}>
                <View>
                  <Icon
                    style={{ textAlign: "center" }}
                    size={70}
                    color={"#00004d"}
                    name="flask"
                  ></Icon>
                  <Text style={{
                    fontSize: 19,
                    color: "#00004d",
                    marginTop: 5,
                    fontWeight: "bold",
                    alignSelf: "center",
                    textAlign: "center"
                  }}>Observation</Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.box}>
              <TouchableOpacity
                //style={[styles.wrapper]}
                onPress={() => this.showClaimsFunc()}>
                <View>
                  <Medical
                    style={{ textAlign: "center" }}
                    size={70}
                    color={"#00004d"}
                    name="notes"
                  ></Medical>
                  <Text style={{
                    fontSize: 19,
                    color: "#00004d",
                    marginTop: 5,
                    fontWeight: "bold",
                    alignSelf: "center",
                    textAlign: "center"
                  }}>Claim</Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.box}>
              <TouchableOpacity
                //style={[styles.wrapper]}
                onPress={() => this.showPatientInfo()}>
                <View>
                  <Icon
                    style={{ textAlign: "center" }}
                    size={70}
                    color={"#00004d"}
                    name="heartbeat"
                  ></Icon>
                  <Text style={{
                    fontSize: 19,
                    color: "#00004d",
                    marginTop: 5,
                    fontWeight: "bold",
                    alignSelf: "center",
                    textAlign: "center"
                  }}>Patient details</Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.box}>
              <TouchableOpacity
                //style={[styles.wrapper]}
                onPress={() => this.showMedsFunc()}>
                <View>
                  <Medical
                    style={{ textAlign: "center" }}
                    size={70}
                    color={"#00004d"}
                    name="medicine-"
                  ></Medical>
                  <Text style={{
                    fontSize: 19,
                    color: "#00004d",
                    marginTop: 5,
                    fontWeight: "bold",
                    alignSelf: "center",
                    textAlign: "center"
                  }}>Medicine</Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.box}>
              <TouchableOpacity
                //style={[styles.wrapper]}
                onPress={() => this.showEncounterFunc()}>
                <View>
                  <Medical
                    style={{ textAlign: "center" }}
                    size={70}
                    color={"#00004d"}
                    name="encounter"
                  ></Medical>
                  <Text style={{
                    fontSize: 19,
                    color: "#00004d",
                    marginTop: 5,
                    fontWeight: "bold",
                    alignSelf: "center",
                    textAlign: "center"
                  }}>Encounter</Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.box}>
              <TouchableOpacity
                //style={[styles.wrapper]}
                onPress={() => this.showConditionsFunc()}>
                <View>
                  <Medical
                    style={{ textAlign: "center" }}
                    size={70}
                    color={"#00004d"}
                    name="condition"
                  ></Medical>
                  <Text style={{
                    fontSize: 19,
                    color: "#00004d",
                    marginTop: 5,
                    fontWeight: "bold",
                    alignSelf: "center",
                    textAlign: "center"
                  }}>Conditions</Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.box}>
              <TouchableOpacity
                // style={[styles.wrapper]}
                onPress={() => this.showPractFunc()}>
                <View>
                  <Medical
                    style={{ textAlign: "center" }}
                    size={70}
                    color={"#00004d"}
                    name="practitioner"
                  ></Medical>
                  <Text style={{
                    fontSize: 19,
                    color: "#00004d",
                    marginTop: 5,
                    fontWeight: "bold",
                    alignSelf: "center",
                    textAlign: "center"
                  }}>Practitioner</Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.box}>
              <TouchableOpacity
                //style={[styles.wrapper]}
                onPress={() => this.showDiagnosticFunc()}>
                <View>
                  <Medical
                    style={{ textAlign: "center" }}
                    size={70}
                    color={"#00004d"}
                    name="diagnostic"
                  ></Medical>
                  <Text style={{
                    fontSize: 19,
                    color: "#00004d",
                    marginTop: 5,
                    fontWeight: "bold",
                    alignSelf: "center",
                    textAlign: "center"
                  }}>Diagnostic report</Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.box}>
              <TouchableOpacity
                // style={[styles.wrapper]}
                onPress={() => this.showMedsReqFunc()}>
                <View>
                  <Icon
                    style={{ textAlign: "center" }}
                    size={70}
                    color={"#00004d"}
                    name="plus"
                  ></Icon>
                  <Text style={{
                    fontSize: 19,
                    color: "#00004d",
                    marginTop: 5,
                    fontWeight: "bold",
                    alignSelf: "center",
                    textAlign: "center"
                  }}>Medication request</Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.box}>
              <TouchableOpacity
                //style={[styles.wrapper]}
                onPress={() => this.showCareFunc()}>
                <View>
                  <Medical
                    style={{ textAlign: "center" }}
                    size={70}
                    color={"#00004d"}
                    name="care"
                  ></Medical>
                  <Text style={{
                    fontSize: 19,
                    color: "#00004d",
                    marginTop: 5,
                    fontWeight: "bold",
                    alignSelf: "center",
                    textAlign: "center"
                  }}>Care plan</Text>
                </View>
              </TouchableOpacity>
            </View>

          </View>
        </ScrollView>
      </View>

    )
  }
}


const styles = StyleSheet.create({
  scrollcontainer: {
    flex: 1,

  },
  containerx: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    top: '14%',
    marginLeft: '3.1%',
    marginBottom: '5%',
  },
  box: {
    margin: 5,
    width: Dimensions.get('window').width / 2 - 6,
    justifyContent: 'center',
    backgroundColor: '#ebebe0',
    //  marginBottom: 5,
    width: 185,
    height: 170,
    borderRadius: 10,
    shadowColor: "#e6e600",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 10,


  },
  container: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 0,
  },
  mainBackground: {
    justifyContent: "center",
    position: "absolute",
    top: 0,
    width: "100%",
    backgroundColor: "#5F9EA0",
    zIndex: 2,

  },
  subBackground: {
    paddingTop: 10,
    paddingBottom: 50,
    width: "80%",
    height: "60%",
    marginTop: "5%",
    // backgroundColor: "white",
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#d6d6d6",
  },
  dataCard: {
    paddingTop: 20,
    // position:"absolute",
    width: "80%",
    height: "50%",
    marginTop: "25%",
    backgroundColor: '#f5f5f0',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#d6d6d6",
    // paddingBottom: 50,
    shadowColor: "#f5f5f0",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 10,
  },
  vaxStatusCard: {
    position: "relative",
    paddingTop: 20,
    width: "80%",
    height: "80%",
    // marginTop: "10%",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#d6d6d6",
    paddingBottom: 50,
    borderRadius: 40,
  },
  textStyleVaxStatus: {
    fontSize: 20,
    marginEnd: 35,
    color: "#000",
    fontWeight: "bold",
    alignSelf: "center",
  },
  textStyleCard: {
    fontSize: 12,
    color: "#000",
    marginHorizontal: 10,
    width: 100,
  },
  textStyleBold: {
    fontSize: 12,
    color: "#000",
    marginHorizontal: 10,
    fontWeight: "bold",
    width: 100,
  },
  textStyleGrey: {
    fontSize: 12,
    color: "#000",
    marginHorizontal: 10,
    width: 100,
  },
  // bottomContainer: {
  //   flex: 1,
  //   display: "flex",
  //   flexDirection:"row",
  //   justifyContent :"space-around",
  //   alignItems:"stretch",
  //   flexGrow:2,
  //   height:"100%",

  // },
  navigationContainer: {
    justifyContent: "space-around",
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    // height:"10%",
  },

  backlocation: {
    position: "absolute",
    top: "4%",
    left: "5%",
    zIndex: 2,
  },

  textStyleSub: {
    fontSize: 12,
    color: "#505050",
    marginTop: 5,
    marginBottom: 5,
    marginStart: 30,
  },
  textStyleTitle: {
    fontSize: 15,
    marginStart: 30,
    marginEnd: 20,
    marginTop: 15,
    color: "#000",
  },
  textStyleR: {
    fontSize: 12,
    color: "#505050",
    marginTop: 20,
  },
  // wrapper: {
  //   // flex: 1,
  //   alignItems: "center",
  //   justifyContent: "space-around",
  //   height: 190,
  //   top: '8%',
  //   backgroundColor: '#f5f5f0',
  //   marginBottom: 5,
  //   width: 190,
  //   // borderColor:"#b3c6ff",
  //   borderRadius: 10,
  //   shadowColor: "#f5f5f0",
  //   shadowOffset: {
  //     width: 0,
  //     height: 1,
  //   },
  //   shadowOpacity: 0.25,
  //   shadowRadius: 3.84,
  //   elevation: 10,
  // },
  // patinetMedicalList:{
  //   color:"black",
  //   fontWeight:900,
  //   fontSize:"50",
  //
});
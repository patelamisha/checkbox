
/* Onboarding section. 
View https://www.npmjs.com/package/react-native-onboarding-swiper for more detail on how to use the library */

import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';

import Onboarding from 'react-native-onboarding-swiper';
import LinearGradient from 'react-native-linear-gradient';

const Dots = ({selected}) => {
    let backgroundColor;

    backgroundColor = selected ? 'rgba(255, 140, 0, 1)' : 'rgba(0, 0, 0, 0.3)';

    return (
        <View 
            style={{
                borderBottomEndRadius: 40,
                borderBottomStartRadius: 40,
                borderTopEndRadius: 40,
                borderTopStartRadius: 40,
                width:10,
                height: 10,
                marginHorizontal: 3,
                backgroundColor
            }}
        />
    );
}


const Skip = ({...props}) => (
    <TouchableOpacity
        style={{marginHorizontal:10, padding:10}}
        {...props}
    >
        <Text style={{fontSize:16}}>Skip</Text>
    </TouchableOpacity>
);

const Next = ({...props}) => (
    <TouchableOpacity
        style={{marginHorizontal:10, padding:10}}
        {...props}
    >
        <Text style={{fontSize:16}}>Next</Text>
    </TouchableOpacity>
);

const Done = ({...props}) => (
    <TouchableOpacity
        style={{marginHorizontal:10, padding:10}}
        {...props}
    >
        <Text style={{fontSize:16}}>Done</Text>
    </TouchableOpacity>
);


const OnboardingScreen = ({navigation}) => {
      return (
        <LinearGradient colors={['#ffe900', '#eb6308']} style={styles.gradient}>
          <Onboarding
            SkipButtonComponent={Skip}
            NextButtonComponent={Next}
            DoneButtonComponent={Done}
            DotComponent={Dots}
            onSkip={() => navigation.navigate("Signup")}
            onDone={() => navigation.navigate("Signup")}
            imageContainerStyles={{paddingBottom:40}}
            titleStyles = {{ fontWeight: 'bold' }}
            pages={[
              {
                backgroundColor: '#0000',
                title: 'Introducing SmartID',
                image: <Image source={require('../components/ShoptakiFill.png')}/>,
                subtitle: 'A universal ID can be used as either your drivers licence, student ID, medical ID, employee ID and much more, all in one place.',
              },
              {
                backgroundColor: '#0000',
                title: 'A Universal ID',
                image: <Image source={require('../components/page2.png')} />,
                subtitle: 'With full control over your personal data, use it wherever you go and show it to whoever you wish.',
              },
              {
                backgroundColor: '#0000',
                title: 'Security in Your Hands',
                image: <Image source={require('../components/security.png')} />,
                subtitle: "Powered by biometrics, SmartID eliminates the need to remember hundreds of passwords. With your biometrics you have full control!",
              },
              {
                backgroundColor: '#0000',
                title: 'A More Connected, Streamlined, and Autonomous World',
                image: <Image source={require('../components/page3.png')} />,
                subtitle: "With the usage of our Smartchain technology, you will have access to your information at a moment's notice. ",
              },
            ]}
            />
        </LinearGradient>
      );
    // }
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center'
  },
  gradient: {
    flex: 1
  },
  subtitle:{
    justifyContent:'center',
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

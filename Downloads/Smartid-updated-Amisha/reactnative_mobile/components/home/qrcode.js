/* This page is not used at the moment */

import React from 'react';
import { Text, View } from 'react-native';

export default class QRScreen extends React.Component {
    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text> This is your code </Text>
            </View>
        );
    }
}
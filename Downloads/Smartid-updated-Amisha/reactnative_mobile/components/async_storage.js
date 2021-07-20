/* Use these functions to save tokens in local storage of device */
// These functions are used to save email and faceID usage

import AsyncStorage from '@react-native-async-storage/async-storage';

export const getToken = async (itemKey) => {
    try {
        const value = await AsyncStorage.getItem(itemKey);
        if (value !== null) {
            return value;
        }
    } catch (e) {
        return null;
    }
};

export const setToken = async (itemKey, token) => {
    try {
        await AsyncStorage.setItem(itemKey, token);
    } catch (e) {
        return null;
    }
};



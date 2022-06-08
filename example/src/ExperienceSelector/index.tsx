import React, { Fragment } from "react";
import { Button, StyleSheet, View } from "react-native";

export type AppExperience = 'input' | 'output';

interface Props {
    onSelect: (experience: AppExperience) => void;
}
export const ExperienceSelector = ({ onSelect}: Props) => {
    const style = StyleSheet.create({
        view: {
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 50,
    }
})
    return <View style={style.view}>
        <Button onPress={() => onSelect('input')} title="Input" />
        <Button onPress={() => onSelect('output')} title="Output" />
    </View>
}
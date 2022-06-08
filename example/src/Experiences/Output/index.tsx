import type { MIDIValOutput } from "@midival/core";
import { Keyboard } from "../../Keyboard";
import { SelectMidiOutput } from "../../SelectMidiOutput";
import React, { Fragment, useState } from "react";
import { StyleSheet, View } from "react-native";

export const ExperienceOutput  = () => {
  const [output, setOutput] = useState<MIDIValOutput>();

  const onPress = ((key: number) => {
      output?.sendNoteOn(key, 127);
  });

  const onDepress = ((key: number) => {
      output?.sendNoteOff(key);
  });


  return (
    <View style={{width: "100%"}}>
      {/* <Text>Open up App.tsx to start working on your app!</Text> */}
      {output ?
        <Keyboard onPress={onPress} onDepress={onDepress} octaves={2} /> :
        <SelectMidiOutput onSelect={setOutput} />
      }
    </View>
  );
}
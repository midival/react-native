import React, { useState } from "react";
import { MIDIVal, MIDIValInput, MIDIValOutput } from '@midival/core';
import { ReactNativeMIDIValAccess } from "@midival/react-native";
import { StyleSheet, Text, View } from 'react-native';
import { SelectMidiInput } from "./SelectMidiInput";
import { MessageInspector } from "./MessageInspector";
import { AppExperience, ExperienceSelector } from "./ExperienceSelector";
import { ExperienceInput } from "./Experiences/Input";
import { ExperienceOutput } from "./Experiences/Output";

MIDIVal.configureAccessObject(new ReactNativeMIDIValAccess());

// MIDIVal.connect()
// .then(access => {
//   console.log("Using access", access);
//   // setTimeout(() => {

//     // console.log("Using output from access", access);
//     // const midiOutput = new MIDIValOutput(access.outputs[0]);
//     // console.log(midiOutput);

//     // const midiIn = new MIDIValInput(access.inputs[0]);
//     // console.log(midiIn);
//     // midiIn.onAllNoteOn((data) => {
//     //   console.log("NOTE ON", data);
//     // })
//     // midiOutput.sendNoteOn(60, 120);
//     // console.log("Input connected", input);
//     // const midiInput = new MIDIValInput(input);
//     // midiInput.onNoteOn(() => {
//     //   console.log("NOTE ON");
//     // })

//   // access.inputs.forEach(input => {
//   //     const midiInput = new MIDIValInput(input);
//   //     midiInput.onAllNoteOn(() => {
//   //       console.log("note on");
//   //     })
//   //   });

//   //   access.outputs.forEach(output => {
//   //     const midiOut = new MIDIValOutput(output);
//   //     setInterval(() => {
//   //       console.log(output);
//   //       midiOut.sendNoteOn(40, 100, 0);
//   //     }, 1000);
//   //   })
//   // }, 10000);
// })
// .catch(e => {
//   console.log(e);
// })

export default function App() {
  const [experience, setExperience] = useState<AppExperience>();

  const style = StyleSheet.create({
    view: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 50,
        width: "100%",
        backgroundColor: "yellow"
    }});

  return <View style={style.view}>
  { !experience ? <ExperienceSelector onSelect={setExperience} /> :
    (experience === "input") ? 
    <ExperienceInput /> :
    <ExperienceOutput />
    }
  </View>
};

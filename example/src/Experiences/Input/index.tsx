import type { MIDIValInput } from "@midival/core";
import { MessageInspector } from "../../MessageInspector";
import { SelectMidiInput } from "../../SelectMidiInput";
import React, { useState } from "react";
import { View } from "react-native";

export const ExperienceInput = () => {
  const [input, setInput] = useState<MIDIValInput>();

  const onInputSelect = (input: MIDIValInput) => {
    console.log(input);
    setInput(input);
  }

  return (
    <View style={{width: "100%"}}>
      {input ?
        <MessageInspector input={input} /> :
        <SelectMidiInput onSelect={onInputSelect} />
      }
    </View>
  );
}
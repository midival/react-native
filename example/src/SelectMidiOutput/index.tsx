import React, { Fragment, useRef } from "react";
import { IMIDIAccess, IMIDIOutput, MIDIValOutput } from "@midival/core"
import { MIDIVal} from "@midival/core";
import { useEffect, useState } from "react";
import { Button, Text } from "react-native";
import { Picker } from "@react-native-community/picker";
import type { ItemValue } from "@react-native-community/picker/typings/Picker";

const useMidiOutputs = (access: IMIDIAccess) => {
    const [outputs, setOutputs] = useState(access.outputs);
    useEffect(() => {
        setOutputs(access.outputs);
    }, [access.outputs]);
    return outputs;
}

interface PropsResolved {
    access: IMIDIAccess,
    onSelect: (output: MIDIValOutput) => void
}

export const SelectMidiOutputResolved = ({ access, onSelect }: PropsResolved) => {
    const outputs = useMidiOutputs(access);
    const [selected, setSelected] = useState<ItemValue>();

    return (
        <Fragment>
        <Picker selectedValue={selected} onValueChange={value => {
           
            setSelected(value);
        }}>
            {outputs.map(output => (
                <Picker.Item label={output.name} value={output.id} key={output.id} />
            ))}
        </Picker>
        <Button title="Select" onPress={() => {
            if (!selected) {
                return;
            }
            const output = outputs.find(i => i.id === selected);
            if (!output) {
                return;
            }
            onSelect(new MIDIValOutput(output));
        }} />
        </Fragment>
    );
}

interface Props {
    onSelect: (output: MIDIValOutput) => void;
}

export const SelectMidiOutput = ({ onSelect }: Props) => {
    const [access, setAccess] = useState<IMIDIAccess>();
    useEffect(() => {
        MIDIVal.connect()
        .then(setAccess);
    }, []);


    if (!access) {
        return <Text>Loading ...</Text>;
    }
    return <SelectMidiOutputResolved access={access} onSelect={onSelect} />
}
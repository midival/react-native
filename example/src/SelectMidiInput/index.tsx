import React, { Fragment, useRef } from "react";
import { IMIDIAccess, IMIDIInput, MIDIValInput } from "@midival/core"
import { MIDIVal} from "@midival/core";
import { useEffect, useState } from "react";
import { Button, Text } from "react-native";
import { Picker } from "@react-native-community/picker";
import type { ItemValue } from "@react-native-community/picker/typings/Picker";

const useMidiInputs = (access: IMIDIAccess) => {
    const [inputs, setInputs] = useState(access.inputs);
    useEffect(() => {
        setInputs(access.inputs);
    }, [access.inputs]);
    return inputs;
}

interface PropsResolved {
    access: IMIDIAccess,
    onSelect: (input: MIDIValInput) => void
}

export const SelectMidiInputResolved = ({ access, onSelect }: PropsResolved) => {
    const inputs = useMidiInputs(access);
    const [selected, setSelected] = useState<ItemValue>();

    // const [selectedLanguage, setSelectedLanguage] = useState();

    // return <Picker
    //     selectedValue={selectedLanguage}
    //     onValueChange={(itemValue, itemIndex) =>
    //         setSelectedLanguage(itemValue)
    //     }>
    //     <Picker.Item label="Java" value="java" />
    //     <Picker.Item label="JavaScript" value="js" />
    //     </Picker>

    return (
        <Fragment>
        <Picker selectedValue={selected} onValueChange={value => {
           
            setSelected(value);
        }}>
            {inputs.map(input => (
                <Picker.Item label={input.name} value={input.id} key={input.id} />
            ))}
            {/* <Picker.Item label={"XXX"} value="dsada" key="dsada" /> */}
        </Picker>
        <Button title="Select" onPress={() => {
            if (!selected) {
                return;
            }
            const input = inputs.find(i => i.id === selected);
            if (!input) {
                return;
            }
            onSelect(new MIDIValInput(input));
        }} />
        </Fragment>
    );
}

interface Props {
    onSelect: (input: MIDIValInput) => void;
}

export const SelectMidiInput = ({ onSelect }: Props) => {
    const [access, setAccess] = useState<IMIDIAccess>();
    console.log("ACCESS", access);
    useEffect(() => {
        MIDIVal.connect()
        .then(setAccess);
    }, []);


    if (!access) {
        return <Text>Loading ...</Text>;
    }
    return <SelectMidiInputResolved access={access} onSelect={onSelect} />
}
import React, { Fragment, useState } from "react";
import styled from "@emotion/native";
import { StyleSheet, GestureResponderEvent } from "react-native";
import { midiToNote } from "./utils/midiToNote";
import { range } from "./utils/range";

interface WhiteKeyProps {
    onPress: (n: number) => void,
    onDepress: (n: number) => void,
    midiNo: number,
    moveHalf?: boolean,
    keyHighlight?: boolean,
};

const WhiteKey = ({ onPress, onDepress, midiNo, moveHalf, keyHighlight }: WhiteKeyProps) => {
    const [isActive, setIsActive] = useState(false);
    const onPressIntern = () => {
        setIsActive(true);
        onPress(midiNo);
    };

    const onDepressIntern = (e: GestureResponderEvent) => {
        setIsActive(false);
        onDepress(midiNo);
    }
    return <WhiteKeyView
        onTouchStart={onPressIntern}
        onTouchEnd={onDepressIntern}
        isActive={isActive}
        isHighlight={!!keyHighlight}
        moveHalf={moveHalf}
        width={70}
    >
        <KeyName>{midiToNote(midiNo)}</KeyName>
    </WhiteKeyView>;
}

const WhiteKeyView = styled.View<{moveHalf?: boolean, isActive: boolean, width: number, isHighlight: boolean}>`
    background-color: ${({ isHighlight }) => isHighlight ? "#DDF" : "#FFF"};
    ${({ isActive}) => isActive ? "background-color: #DDD" : ""};
    width: ${({ width}) => `${width}px`};
    height: ${({ width}) => `${3*width}px`};
    border: 1px solid black;
    border-width: 2px 2px 5px 2px;
    margin-left: ${({moveHalf,width}) => moveHalf ? `-${width/4+2}px` : "-2px"};
    border-radius: 0 0 6px 6px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
`;

const KeyName = styled.Text`
    color: #DDD;
    font-size: 20;
    font-weight: bold;
    padding-bottom: 10;
`;

interface BlackKeyProps {
    onPress: (n: number) => void,
    onDepress: (n: number) => void,
    midiNo: number
};

const BlackKey = ({ onPress, onDepress, midiNo}: BlackKeyProps) => {
    const [isActive, setIsActive] = useState(false);
    const onPressIntern = () => {
        setIsActive(true);
        onPress(midiNo);
    }

    const onDepressIntern = () => {
        setIsActive(false);
        onDepress(midiNo);
    }
    return <BlackKeyView
        onTouchStart={onPressIntern}
        onTouchEnd={onDepressIntern}
        isActive={isActive}
        width={70}
    />
}

const BlackKeyView = styled.View<{isActive: boolean, width: number}>`
    width: ${({ width }) => `${width/2}px`};
    height: 100px;
    background-color: ${({isActive}) => isActive ? "#666" : "#000"};
    margin-left: ${({width}) => `-${width/4}px`};
    z-index: 100;
    border-radius: 0 0 6px 6px;
`;

const KeyboardContainer = styled.ScrollView`
    display: flex;
    /* justify-content: center;
    align-items: flex-start; */
    flex-direction: row;
    width: 100%;
`;

interface Props {
    onPress: (key: number) => void,
    onDepress: (key: number) => void,
    octaves: number,
    baseMidi: number,
    scale: number[]
}

const SEQ = Array.from("wbwbwwbwbwbw");

interface OctaveProps {
    cMidi: number,
    onPress: (n: number) => void,
    onDepress: (n: number) => void,
};

const Octave = ({ cMidi = 60, onPress, onDepress }: OctaveProps) => {
    return <Fragment>
        {SEQ.map((type, i) => {
                const CMP = type === "w" ? WhiteKey : BlackKey;
                return <CMP
                    midiNo={i+cMidi}
                    onPress={onPress}
                    onDepress={onDepress}
                    moveHalf={i>0 && SEQ[i-1] === "b"}
                />
            })}
    </Fragment>
}

export const ScaleList = [
    { name: "Ionian", value: "IONIAN" },
    { name: "Dorian", value: "DORIAN" },
    { name: "Phrygian", value: "PHRYGIAN" },
    { name: "Lydian", value: "LYDIAN" },
    { name: "Mixolydian", value: "MIXOLYDIAN"},
    { name: "Aeolian", value: "AEOLIAN"},
    { name: "Locrian", value: "LOCRIAN"},
]

export const SCALES = {
"IONIAN":      [0, 2, 4, 5, 7, 9, 11], /* WWHWWWH */
"DORIAN":      [0, 2, 3, 5, 7, 9, 10], /* WHWWWHW */
"PHRYGIAN":    [0, 1, 3, 5, 7, 8, 10], /* HWWWHWW */
"LYDIAN":      [0, 2, 4, 6, 7, 9, 11], /* WWWHWWH */
"MIXOLYDIAN":  [0, 2, 4, 5, 7, 9, 10], /* WWHWWHW */
"AEOLIAN":     [0, 2, 3, 5, 7, 8, 10], /* WHWWHWW */
"LOCRIAN":     [0, 1, 3, 5, 6, 8, 10]  /* HWWHWWW */
};

export const NOTES = [
    { name: "C",  value: 60 },
    { name: "C#", value: 61 },
    { name: "D",  value: 62 },
    { name: "D#", value: 63 },
    { name: "E",  value: 64 },
    { name: "F",  value: 65 },
    { name: "F#", value: 66 },
    { name: "G",  value: 67 },
    { name: "G#", value: 68 },
    { name: "A",  value: 69 },
    { name: "A#", value: 70 },
    { name: "B",  value: 71 },
]

interface ScaleOctaveProps {
    baseMidi: number,
    onPress: (n: number) => void,
    onDepress: (n: number) => void,
    scale: number[],
}

const ScaleOctave = ({ baseMidi = 60, onPress, onDepress, scale }: ScaleOctaveProps) => {
    return (
        <Fragment>
            {scale.map((diff, i) => <WhiteKey
                midiNo={baseMidi+diff}
                onPress={onPress}
                onDepress={onDepress}
                key={i}
                keyHighlight={i === 0}
            />)}
        </Fragment>
    )
}

const styles = StyleSheet.create({
    contentContainer: {
      justifyContent: "center",
      alignItems: "flex-start",
      display: "flex",
      flexDirection: "row",
    }
  });

export const Keyboard = ({ onPress, onDepress, octaves = 1 }: Props) => {
    return (
        <KeyboardContainer contentContainerStyle={styles.contentContainer} horizontal={true}>
            {range(octaves).map(x => (
            <Octave
                onPress={onPress}
                onDepress={onDepress}
                cMidi={36 + x * 12}
            />
            ))}
        </KeyboardContainer>);
}

export const OctaveKeyboard = ({ onPress, onDepress, octaves = 5, baseMidi = 36, scale = SCALES.IONIAN }: Props) => {
    return (
        <KeyboardContainer contentContainerStyle={styles.contentContainer} horizontal={true}>
            {range(octaves).map(x => (
                <ScaleOctave
                    onPress={onPress}
                    onDepress={onDepress}
                    baseMidi={baseMidi + x * 12}
                    scale={scale}
                />
            ))}
        </KeyboardContainer>
    )
}
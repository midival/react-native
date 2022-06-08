import type { MIDIValInput } from "@midival/core"
import React, { Fragment, useEffect, useState } from "react"
import { Text } from "react-native"

interface Props {
    input: MIDIValInput,
}

interface Log {
    message: string;
}

const useInputLog = (input: MIDIValInput) => {
    const [log, setLog] = useState<Log[]>([]);

    useEffect(() => {
        const h1 = input.onAllNoteOn(event => {
            console.log("NOTE ON", event);
            setLog([{
                message: "Note On " + event.note + " " + event.velocity
            }, ...(log || []).slice(0, 9)]);
        });

        return () => {
            h1();
        }
    }, [log]);


    return log;
}

export const MessageInspector = ({ input }: Props) => {
    const log = useInputLog(input);
    return <Fragment>
        {log.map(({ message}) => <Text>{message}</Text>)}
    </Fragment>
}
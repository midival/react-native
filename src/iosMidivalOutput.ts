import type { IMIDIOutput } from '@midival/core';
import { NativeModules } from 'react-native'

export class IosMidivalOutput implements IMIDIOutput {
    constructor(id: string, name: string, manufacturer: string) {
        this.id = id;
        this.name = name;
        this.manufacturer = manufacturer;
    }
    send(data: Uint8Array | number[]): void {
        if (data.length < 3) {
            console.error("Incorrect length");
        }
        NativeModules
        .Midival
        .sendMidiMessage(this.id, data[0], data[1], data[2]);
    }
    id: string;
    name: string;
    manufacturer: string;

}
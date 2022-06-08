import type { IMIDIInput, IMIDIOutput, UnregisterCallback } from '@midival/core';
import type { IMIDIAccess } from "@midival/core/dist/wrappers/access/IMIDIAccess";
import type { InputStateChangeCallback, OutputStateChangeCallback } from '@midival/core/dist/wrappers/access/IMIDIAccess';
import { NativeEventEmitter, NativeModules } from 'react-native';
import { CallbackType, Omnibus } from "@hypersphere/omnibus";
import { IosMidivalInput } from './iosMidivalInput';
import { IosMidivalOutput } from './iosMidivalOutput';
import type { OnMessageCallback } from '@midival/core/dist/wrappers/inputs/IMIDIInput';

interface NativeMidiResponse {
    id: string;
    name: string;
    manufacturer: string;
    type: 'input' | 'output';
}

export class ReactNativeMIDIValAccess implements IMIDIAccess {
    private listeners: Omnibus;
  constructor() {
    this.inputs = [];
    this.outputs = [];
    this.listeners = new Omnibus<Record<any, any>>();
    }
    onInputConnected(callback: InputStateChangeCallback): UnregisterCallback {
        throw new Error('Method not implemented.');
    }
    onInputDisconnected(callback: InputStateChangeCallback): UnregisterCallback {
        throw new Error('Method not implemented.');
    }
    onOutputConnected(callback: OutputStateChangeCallback): UnregisterCallback {
        throw new Error('Method not implemented.');
    }
    onOutputDisconnected(callback: OutputStateChangeCallback): UnregisterCallback {
        throw new Error('Method not implemented.');
    }

    private connectToEmmiter() {
        const emitter = new NativeEventEmitter(NativeModules.Midival);
        emitter.addListener('MidiEvent', (data) => {
            console.log("Got message", data);
            this.listeners.trigger(data.source.toString(), {
                data: data.data,
                receivedTime: Date.now(),
            })
        });
    }

    public registerEvent(id: string, callback: OnMessageCallback): () => void {
        return this.listeners.on(id, callback as CallbackType<any[]>);
    }

    connect(): Promise<void> {
        return NativeModules
        .Midival
        .getMidiDevices()
        .then((data: NativeMidiResponse[] | null) => {
            const inputs = [];
            const outputs = [];
            if (!data) {
                return;
            }
            for(const response of data) {
                if (response.type === "input") {
                    inputs.push(new IosMidivalInput(response.id, response.name, response.manufacturer, this));
                } else {
                    outputs.push(new IosMidivalOutput(response.id, response.name, response.manufacturer));
                }
            }
            this.inputs = inputs;
            this.outputs = outputs;
            this.connectToEmmiter();
        });
    }
    inputs: IMIDIInput[];
    outputs: IMIDIOutput[];
    onInputStateChange(_callback: InputStateChangeCallback): void {
        return;
    }
    onOutputStateChange(_callback: OutputStateChangeCallback): void {
        return;
    }
}
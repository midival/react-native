import type { IMIDIInput, UnregisterCallback } from '@midival/core';
import type { OnMessageCallback } from '@midival/core/dist/wrappers/inputs/IMIDIInput';
import type { ReactNativeMIDIValAccess } from '.';

export class IosMidivalInput implements IMIDIInput {
    private access: ReactNativeMIDIValAccess | null = null;
    constructor(id: string, name: string, manufacturer: string, accessObject: ReactNativeMIDIValAccess) {
        this.id = id;
        this.name = name;
        this.manufacturer = manufacturer;
        this.access = accessObject;
    }

    async onMessage(callback: OnMessageCallback): Promise<UnregisterCallback> {
        if (!this.access) {
            return () => {};
        }
        return this.access.registerEvent(this.id, callback);
    }
    id: string;
    name: string;
    manufacturer: string;

}
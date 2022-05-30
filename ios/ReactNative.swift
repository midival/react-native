import Foundation

import CoreMIDI

import Gong

// transport object
class MidivalDeviceTO : Codable {
    var id: String;
    var name: String;
    var manufacturer: String;
    var type: String;
    
    init(id: String, name: String?, manufacturer: String?, type: String) {
        self.id = id;
        self.name = name ?? "";
        self.manufacturer = manufacturer ?? "";
        self.type = type;
    }
}

@available(iOS 13.0, *)
@objc(Midival)
class Midival: RCTEventEmitter, MIDIObserver {
    func receive(_ notice: MIDINotice) {
        // noop
    }
      override func supportedEvents() -> [String]! {
        return ["MidiEvent"]
      }
    
    func receive(_ packet: MIDIPacket, from source: MIDISource) {
        self.sendEvent(withName: "MidiEvent", body: ["source": source.reference, "data": packet.bytes.map({ NSNumber(value: $0)}) ])
//        outputCallbacks[String(source.reference)]?(packet.bytes.map({ NSNumber(value: $0)}))
    }
    

    @objc
  override static func requiresMainQueueSetup() -> Bool {
    return true
  }
    
    private var inputs:  [String:MIDISource] = [:]
    private var outputs: [String:MIDIDestination] = [:]
    private var outputCallbacks: [String:([NSNumber]) -> Void] = [:]
  
  @objc
  func sendMidiMessage(_ n: NSString, a: NSNumber, b: NSNumber, c: NSNumber) {
    NSLog("Send MIDI Message")
    
    guard let output = MIDI.output else { return }
      NSLog("OUTPUT FOUND")
    let packet = MIDIPacket(bytes: [a.uint8Value, b.uint8Value, c.uint8Value])

    let device = outputs[n as String]
    device?.send(packet, via: output)
  }
    
    @objc
    func registerCallback(_ n: NSString, callback: @escaping RCTResponseSenderBlock) {
//        outputCallbacks[n as String] = { message in
//            callback(message)
//        }
    }
  
  @objc
  func getMidiDevices(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
    MIDI.connect()
      var devices: [[AnyHashable : String]] = []
    for device in MIDIDevice.all {
        let manufacturer = try! device.string(for: "manufacturer")
        for source in device.sources {
            inputs[String(source.reference)] = source
            devices.append(["id": String(source.reference), "name": source.name ?? "", "manufacturer": manufacturer, "type": "input"])
       }
        for destination in device.destinations {
            outputs[String(destination.reference)] = destination
            devices.append(["id": String(destination.reference), "name": destination.name ?? "", "manufacturer": manufacturer, "type": "output"])
        }
    }
    
  MIDI.addObserver(self)
    
    resolve(devices)
  }
}

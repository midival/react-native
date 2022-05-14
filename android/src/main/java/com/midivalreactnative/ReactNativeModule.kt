package com.midivalreactnative

import android.content.Context
import android.media.midi.MidiDeviceInfo
import android.media.midi.MidiInputPort
import android.media.midi.MidiManager
import android.os.Build
import androidx.annotation.RequiresApi
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule


class ReactNativeModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "Midival"
    }

    private var midiManager: MidiManager? = null

    private val portInfos: MutableMap<String, MidiDeviceInfo.PortInfo> = mutableMapOf()

    private val isConnecting: MutableMap<String, Boolean> = mutableMapOf()
    private val devices: MutableMap<String, MidiDeviceInfo> = mutableMapOf()
    private val deviceInfos: MutableMap<String, MidiDeviceInfo> = mutableMapOf()
  private val ports: MutableMap<String, MidiDeviceInfo> = mutableMapOf()

    @RequiresApi(Build.VERSION_CODES.M)
    fun getMidiDevices() {
      val m = reactContext.getSystemService(Context.MIDI_SERVICE)
      midiManager = m
      val infos: Array<MidiDeviceInfo> = m.getDevices()
      val localDeviceInfos: MutableList<Map<String, String?>> = mutableListOf()
      infos.forEach { info ->
        val portInfosArr = info.ports
        portInfosArr.forEach { port ->
          val properties = info.properties
          val portId =  port.name + port.portNumber
          deviceInfos[portId] = info
          var device = mapOf(
            "id" to portId,
            "name" to port.name,
            "manufacturer" to properties.getString(MidiDeviceInfo.PROPERTY_MANUFACTURER),
            "type" to if(port.type == MidiDeviceInfo.PortInfo.TYPE_INPUT) "input"  else "output"
          )
          localDeviceInfos.add(device)
          portInfos[portId] = port
        }
      }
    }

    fun sendMidiMessage(n: String, a: Int, b: Int, c: Int) {
      val buffer = byteArrayOf(a.toByte(), b.toByte(), c.toByte())
      val port = this.ports[n];
      val device = this.devices[n];
      if (device == null) {
        val isDeviceConnecting: Boolean = isConnecting[n] ?: false;
        if (isDeviceConnecting) {
          return;
        }
        val deviceInfo = this.deviceInfos[n]
        midiManager.openDevice(deviceInfo, MidiManager.OnDeviceOpenedListener { device ->
          if (device == null) {
            // couldnt open
          }
          deviceInfos[n] = device
        })
      }
      val inputPort = this.ports[n];
      inputPort?
    }



}

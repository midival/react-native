package com.midivalreactnative

import android.content.Context
import android.media.midi.*
import android.os.Build
import androidx.annotation.RequiresApi
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import java.io.IOException


class ReactNativeModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private val reactContext = reactContext

    override fun getName(): String {
        return "Midival"
    }

    private var midiManager: MidiManager? = null

    private val portInfos: MutableMap<String, MidiDeviceInfo.PortInfo> = mutableMapOf()

    private val isConnecting: MutableMap<String, Boolean> = mutableMapOf()
    private val devices: MutableMap<String, MidiDevice> = mutableMapOf()
    private val deviceInfos: MutableMap<String, MidiDeviceInfo> = mutableMapOf()
    private val outputPorts: MutableMap<String, MidiOutputPort> = mutableMapOf()
    private val inputPorts: MutableMap<String, MidiInputPort> = mutableMapOf()

    @RequiresApi(Build.VERSION_CODES.M)
    @ReactMethod
    fun getMidiDevices(promise: Promise) {
      midiManager = reactContext.getSystemService(Context.MIDI_SERVICE) as MidiManager?
      val infos: Array<MidiDeviceInfo> = midiManager!!.getDevices()
      val localDeviceInfos = WritableNativeArray()
      infos.forEach { info ->
        val portInfosArr = info.ports
        portInfosArr.forEach { port ->
          val properties = info.properties
          val portId =  port.name + port.portNumber
          deviceInfos[portId] = info
          var device = WritableNativeMap()
          device.putString("id", portId)
          device.putString("name", port.name)
          device.putString("manufacturer", properties.getString(MidiDeviceInfo.PROPERTY_MANUFACTURER))
          device.putString("type", if(port.type == MidiDeviceInfo.PortInfo.TYPE_INPUT) "input"  else "output")
          localDeviceInfos.pushMap(device)
          portInfos[portId] = port
        }
      }
      promise.resolve(localDeviceInfos)
    }

    @RequiresApi(Build.VERSION_CODES.M)
    fun sendMidiMessage(n: String, a: Int, b: Int, c: Int) {
      if (midiManager == null) {
        return;
      }
      val buffer = byteArrayOf(a.toByte(), b.toByte(), c.toByte())
      val port = this.inputPorts[n];
      val device = this.devices[n];
      if (port == null || device == null) {
        val isDeviceConnecting: Boolean = isConnecting[n] ?: false;
        if (isDeviceConnecting) {
          return;
        }
        isConnecting[n] = true;
        val deviceInfo = this.deviceInfos[n]!!
        midiManager!!.openDevice(deviceInfo, MidiManager.OnDeviceOpenedListener { device ->
          if (device == null) {
            // couldnt open
            return@OnDeviceOpenedListener
          }
          devices[n] = device
          val portNumber = portInfos[n]?.portNumber ?: return@OnDeviceOpenedListener;
          val port = device.openInputPort(portNumber)
          inputPorts[n] = port
        }, null)
        return
      }
      val inputPort = this.inputPorts[n];
      inputPort?.send(buffer, 0, 3);
    }

  private fun sendEvent(reactContext: ReactContext, eventName: String, params: WritableMap?) {
    reactContext
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
      .emit(eventName, params)
  }
  @RequiresApi(Build.VERSION_CODES.M)
  @ReactMethod
  fun registerCallback(n: String) {
    val port = this.outputPorts[n]
    if (port == null) {
      val deviceInfo = this.deviceInfos[n]
      midiManager!!.openDevice(deviceInfo, MidiManager.OnDeviceOpenedListener { device ->
        if (device == null) {
          return@OnDeviceOpenedListener
        }
        devices[n] = device
        val portNumber = portInfos[n]?.portNumber ?: return@OnDeviceOpenedListener
        val port = device.openOutputPort(portNumber)
        outputPorts[n] = port
        class Receiver : MidiReceiver() {
          @Throws(IOException::class)
          override fun onSend(
            data: ByteArray?, offset: Int,
            count: Int, timestamp: Long
          ) {
            // parse MIDI or whatever
            val params = Arguments.createMap().apply {
              putString("data", data.toString())
            }
            sendEvent(reactContext, "midiEvent", params)
          }

        }
        port.connect(Receiver())

      }, null)
    }
  }



}

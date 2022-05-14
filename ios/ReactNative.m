#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(Midival, NSObject)

RCT_EXTERN_METHOD(getMidiDevices: (RCTPromiseResolveBlock)resolve rejecter: (RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(sendMidiMessage: (nonnull NSString *)n a: (nonnull NSNumber *)a b: (nonnull NSNumber *)b  c: (nonnull NSNumber *)c )
RCT_EXTERN_METHOD(registerCallback: (nonnull NSString *)n callback: (RCTResponseSenderBlock)callback)

@end

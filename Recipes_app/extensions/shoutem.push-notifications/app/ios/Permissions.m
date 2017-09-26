#import "Permissions.h"

@implementation Permissions

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(arePushNotificationsEnabled:(RCTResponseSenderBlock)callback)
{
  BOOL isRegistered = [[UIApplication sharedApplication] isRegisteredForRemoteNotifications];
  BOOL isEnabled = [[[UIApplication sharedApplication] currentUserNotificationSettings] types] != UIUserNotificationTypeNone;

  callback(@[[NSNumber numberWithBool:(isRegistered || isEnabled)]]);
}

RCT_EXPORT_METHOD(openSettings) {
  [[UIApplication sharedApplication] openURL:[NSURL URLWithString:UIApplicationOpenSettingsURLString]];
}

@end

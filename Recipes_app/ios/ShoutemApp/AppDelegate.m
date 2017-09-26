/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AppDelegate.h"
#import "CodePush.h"
#import <AVFoundation/AVFoundation.h>
#import <FBSDKCoreKit/FBSDKCoreKit.h>
#import <FBSDKLoginKit/FBSDKLoginKit.h>

#import "RCTBundleURLProvider.h"
#import "RCTRootView.h"
#import "SplashScreen.h"

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  NSURL *jsCodeLocation;
//NativeModuleInjectionMark-appDelegate-applicationDidFinishLaunchingWithOptions

  // This overrides silent switch and allows audio to play even if hardware switch is set to silent
  AVAudioSession *audioSession = [AVAudioSession sharedInstance];
    NSError *setCategoryError = nil;
    [audioSession setCategory:AVAudioSessionCategoryPlayback
                        error:&setCategoryError];

  // Appetizer.io params check
  NSDictionary *initialProperties = [[NSUserDefaults standardUserDefaults] dictionaryForKey:@"initialProps"];

#ifdef DEBUG
  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index.ios" fallbackResource:nil];
#else
  jsCodeLocation = [CodePush bundleURL];
#endif

  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"ShoutemApp"
                                               initialProperties: initialProperties
                                                   launchOptions:launchOptions];
  rootView.backgroundColor = [UIColor whiteColor];

  // Loading view that shows the launch screen while Javascript is reloading
  UIView *loading = [[[NSBundle mainBundle] loadNibNamed:@"LaunchScreen" owner:self options:nil] objectAtIndex:0];
  rootView.loadingView = loading;
  // Allows the Javascript to render and avoids the white view flash, as described in:
  // https://github.com/facebook/react-native/issues/1402
  rootView.loadingViewFadeDelay = 2;
  loading.frame = self.window.bounds;

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];

  [[FBSDKApplicationDelegate sharedInstance] application:application
                           didFinishLaunchingWithOptions:launchOptions];

  [SplashScreen show];

  return YES;
}

- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url
  sourceApplication:(NSString *)sourceApplication annotation:(id)annotation
{
  return [[FBSDKApplicationDelegate sharedInstance] application:application
                                                        openURL:url
                                              sourceApplication:sourceApplication
                                                     annotation:annotation];
}

//NativeModuleInjectionMark-appDelegate-body
@end

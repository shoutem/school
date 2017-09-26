package com.shoutemapp;

import android.support.multidex.MultiDexApplication;

import com.facebook.react.ReactApplication;
import com.reactnativeshopify.RNShopifyPackage;
import com.xxsnakerxx.flurryanalytics.FlurryAnalyticsPackage;
import com.shoutem.flurry.ShoutemFlurryExtensionPackage;
import com.lwansbrough.RCTCamera.RCTCameraPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.brentvatne.react.ReactVideoPackage;
import com.cboy.rn.splashscreen.SplashScreenReactPackage;
import com.avishayil.rnrestart.ReactNativeRestartPackage;
import com.shoutem.calendar.CalendarManagerPackage;
import com.imagepicker.ImagePickerPackage;
import com.reactnative.photoview.PhotoViewPackage;
import cl.json.RNSharePackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.microsoft.codepush.react.CodePush;
import com.idehub.GoogleAnalyticsBridge.GoogleAnalyticsBridgePackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;

import com.facebook.CallbackManager;
import com.facebook.FacebookSdk;
import com.facebook.reactnative.androidsdk.FBSDKPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends MultiDexApplication implements ReactApplication {

  private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

    @Override
    protected String getJSBundleFile() {
      return CodePush.getJSBundleFile();
    }

    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNShopifyPackage(),
            new FlurryAnalyticsPackage(),
            new ShoutemFlurryExtensionPackage(),
            new RCTCameraPackage(),
            new RNDeviceInfo(),
            new ReactVideoPackage(),
            new SplashScreenReactPackage(),
            new ReactNativeRestartPackage(),
            new CalendarManagerPackage(),
            new ImagePickerPackage(),
            new PhotoViewPackage(),
            new RNSharePackage(),
            new LinearGradientPackage(),
            new VectorIconsPackage(),
          new CodePush(null, getApplicationContext(), BuildConfig.DEBUG),
          new MapsPackage(),
          new GoogleAnalyticsBridgePackage(),
          new FBSDKPackage(mCallbackManager)
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
      return mReactNativeHost;
  }

  protected static CallbackManager getCallbackManager() {
    return mCallbackManager;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    FacebookSdk.sdkInitialize(getApplicationContext());
  }
}

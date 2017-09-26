package com.shoutem.flurry;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.JavaScriptModule;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Created by Shoutem on 7/20/17.
 * This file just implements ReactPackage interface, it is a template, which just enables automatic RN linking,
 * by adding its path to settings.gradle and build.gradle of the Shoutem platform, 
 * which results whith automatic merging of AndroidManifest.xml from extension to main app.
 * Override any method if you have to.
 */
public class ShoutemFlurryExtensionPackage implements ReactPackage {

    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }

    @Override
    public List<Class<? extends JavaScriptModule>> createJSModules() {
        return Collections.emptyList();
    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return new ArrayList<>();
    }
}

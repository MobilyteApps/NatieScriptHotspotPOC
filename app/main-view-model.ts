import {Observable, EventData} from "tns-core-modules/data/observable";
import * as dialogs from "tns-core-modules/ui/dialogs";

const platform = require("tns-core-modules/platform");
const WifiManager = android.net.wifi.WifiManager;
import * as application from "tns-core-modules/application";
import MyVersatileCopyWriter from "./mycls"
import WifiConfiguration = android.net.wifi.WifiConfiguration;
import Throwable = java.lang.Throwable;
import Exception = java.lang.Exception;
import Override = java.lang.Override;
import LocalOnlyHotspotReservation = android.net.wifi.WifiManager.LocalOnlyHotspotReservation;
import Context = android.content.Context;
import LocationManager = android.location.LocationManager;
import AlertDialog = androidx.appcompat.app.AlertDialog;
import DialogInterface = android.content.DialogInterface;
import Settings = android.provider.Settings;


export class HelloWorldModel extends Observable {
    private _counter: number;
    private _message: string;
    private mReservation: android.net.wifi.WifiManager.LocalOnlyHotspotReservation


    constructor() {
        super();

    }

    get message(): string {
        return this._message;
    }

    set message(value: string) {
        if (this._message !== value) {
            this._message = value;
            this.notifyPropertyChange("message", value);
        }
    }

    onTap() {
        if (platform.isAndroid) {
            this.checkLocation()

        }
    }

    offTap() {
        if (platform.isAndroid) {
            if (android.os.Build.VERSION.SDK_INT >= 26) {
                this.mReservation.close()
                this.message = "Switched off"
            } else {
                this.switchOn(false);
                this.message = "Switched off"
            }
        }
    }


    onLoad(args: EventData) {
        // var page = args.object as Page;
        try {
            androidx.core.app.ActivityCompat.requestPermissions(application.android.startActivity,
                Array(
                    android.Manifest.permission.ACCESS_COARSE_LOCATION,
                    android.Manifest.permission.ACCESS_FINE_LOCATION,
                    android.Manifest.permission.ACCESS_NETWORK_STATE,
                    android.Manifest.permission.CHANGE_NETWORK_STATE,
                    android.Manifest.permission.ACCESS_WIFI_STATE,
                    android.Manifest.permission.CHANGE_WIFI_STATE,
                    android.Manifest.permission.WRITE_SETTINGS
                ), 1
            )
        } catch (e) {
            console.log(e)
        }
    }

    check() {
        const ctx = application.android.context as android.content.Context;

        let wifimanager = ctx.getSystemService("wifi") as android.net.wifi.WifiManager;

        try {

            let wmMethods = wifimanager.getClass().getDeclaredMethods() as Array<java.lang.reflect.Method>;
            for (let method of wmMethods) {
                if (method.getName() === "isWifiApEnabled") {

                    (method as java.lang.reflect.Method).setAccessible(true);
                    let res = (method as java.lang.reflect.Method).invoke(wifimanager, null) as java.lang.Boolean

                    if (res) {
                        this.message = "Hotspot On";
                    } else {
                        this.message = "Hotspot Off";
                    }


                }
            }
            // //     return (Boolean) method.invoke(wifimanager);
        } catch (args) {
            console.log(args);
            this.message = "exaption";
        }
    }

    switchOn(status: Boolean) {

        const ctx = application.android.context as android.content.Context;
        let wifimanager = ctx.getSystemService(android.content.Context.WIFI_SERVICE) as android.net.wifi.WifiManager;
        let wificonfiguration = null;
        try {

            if (android.os.Build.VERSION.SDK_INT >= 26) {
                const cls = new MyVersatileCopyWriter()


                wifimanager.startLocalOnlyHotspot(cls, new android.os.Handler());
                setInterval(() => {
                    this.mReservation = cls.getdata()
                }, 2000);

            }

            let method = <java.lang.reflect.Method>(
                wifimanager.getClass().getMethod("setWifiApEnabled", Array.of(WifiConfiguration.class, java.lang.Boolean.class.getField("TYPE").get(null)))
            );
            method.invoke(wifimanager, Array.of(null, status));
            return true;
        } catch (e) {
            e.message;
            this.message = "some problem occurred"
        }
        return false;
    }

      checkLocation() {
        let lm =
            application.android.context.getSystemService(Context.LOCATION_SERVICE) as LocationManager
        let gps_enabled = false
        let network_enabled = false

        try {
            gps_enabled = lm.isProviderEnabled(LocationManager.GPS_PROVIDER)
        } catch (ex) {
        }

        try {
            network_enabled = lm.isProviderEnabled(LocationManager.NETWORK_PROVIDER)
        } catch (ex) {
        }

        if (!gps_enabled && !network_enabled) { // notify user

            dialogs.confirm({
                title: "GPS not Enabled",
                message: "Please enable GPS from settings",
                okButtonText: "Open Settings"
            }).then(result => {
                // result argument is boolean
                console.log("Dialog result: " + result);
                application.android.startActivity.startActivity(
                    new android.content.Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS))
            });


        } else {
            this.switchOn(true);
            this.message = "Switching on..."
        }
    }


}

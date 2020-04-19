const WifiManager = android.net.wifi.WifiManager;

class MyVersatileCopyWriter extends WifiManager.LocalOnlyHotspotCallback {
    private mReservation: android.net.wifi.WifiManager.LocalOnlyHotspotReservation

    constructor() {
        super();
        return global.__native(this);
    }

    onStarted(param0: android.net.wifi.WifiManager.LocalOnlyHotspotReservation): void {
        super.onStarted(param0);
        this.mReservation = param0;
    }

    onFailed(param0: number): void {
        super.onFailed(param0);
    }

    onStopped(): void {
        super.onStopped();
    }

    getdata() {
        return this.mReservation
    }

}

export default MyVersatileCopyWriter

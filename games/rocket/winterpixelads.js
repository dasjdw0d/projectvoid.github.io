


class WinterpixelAds { 
	constructor() {
		this.registered_events = {};
		this.adBreak = null;
		this.adConfig = null;
		this.adConfigReady = false;
		this.driver = "winterpixel";

		// ad drivers
		this.crazysdk = null;
	}

	init(adBreak, adConfig, driver) {
		console.log("WinterpixelAds init");
		this.adBreak = adBreak;
		this.adConfig = adConfig;
		this.driver = driver; 
		console.log("WinterpixelAds driver: " + driver);


		if(this.driver == "winterpixel") {
			this.adConfig({
				sound: "on",
				preloadAdBreaks: "on",
				onReady: () => { 
					console.log("WinterpixelAds init adConfig onReady"); 
					this.adConfigReady = true;
				}
			});
		}
		else if(this.driver == "adinplay") {
			//TODO
		}
		else if(this.driver == "crazygames") {
			this.crazysdk = window.CrazyGames.CrazySDK.getInstance();
			this.crazysdk.init();
		}
		else if(this.driver == "poki") {
			PokiSDK.init().then(() => {
				console.log("Poki SDK successfully initialized");
				// fire your function to continue to game
				PokiSDK.gameLoadingFinished();
			}).catch(() => {
				console.log("Initialized, but the user likely has adblock");
				// fire your function to continue to game
			});
		}
	};

	addEventListener(key, func) { 
		console.log("WinterpixelAds addEventListener");
		if(this.driver == "winterpixel") {
			this.registered_events[key] = func;
		}
		else if(this.driver == "crazygames") {
			this.crazysdk.addEventListener(key, func);
		}
	};

	gameplayStart() {
		console.log("WinterpixelAds gameplayStart");
		
		if(this.driver == "winterpixel") {
			// todo
		}
		else if(this.driver == "crazygames") {
			this.crazysdk.gameplayStart();
		}
		if(this.driver == "poki") {
			PokiSDK.gameplayStart();
		}
	}

	gameplayStop() {
		console.log("WinterpixelAds gameplayStop");

		if(this.driver == "winterpixel") {
			// todo
		}
		else if(this.driver == "crazygames") {
			this.crazysdk.gameplayStop();
		}
		if(this.driver == "poki") {
			PokiSDK.gameplayStop();
		}
	}

	happytime() {
		console.log("WinterpixelAds happytime");

		if(this.driver == "winterpixel") {
			// todo
		}
		else if(this.driver == "crazygames") {
			this.crazysdk.happytime();
		}
	}

	requestAd(adNameString) {
		console.log("WinterpixelAds requestAd");

		if(this.driver == "winterpixel") {
			if(this.adConfigReady) {
				this.adBreak({
					type: 'next',  // ad shows at start of next level
					name: 'next',
					beforeAd: () => { 
						console.log("adBreak beforeAd"); 
					},  // You may also want to mute the game's sound.
					afterAd: () => { 
						console.log("adBreak afterAd"); 
					},
					adBreakDone: (o) => { 
						console.log("preroll done"); 
						if(this.registered_events["adFinished"]) {
							this.registered_events["adFinished"]();
						}
					}
				});
			}
			else{
				console.log("WinterpixelAds requestAd, adConfig not ready");
				if(this.registered_events["adError"]) {
					this.registered_events["adError"]();
				}
			}
		}
		else if(this.driver == "adinplay") {
			if(this.registered_events["adStarted"]) {
				this.registered_events["adStarted"]();
			}
			if(adNameString == "rewarded") {
				show_rewarded();
			}
			else {
				show_preroll();
			}
		}
		else if(this.driver == "crazygames") {
			this.crazysdk.requestAd(adNameString);
		}
		else if(this.driver == "poki") {
			// pause your game here if it isn't already
			PokiSDK.commercialBreak(() => {
				if(this.registered_events["adStarted"]) {
					this.registered_events["adStarted"]();
				}
			}).then(() => {
				console.log("Commercial break finished, proceeding to game");
				if(this.registered_events["adFinished"]) {
					this.registered_events["adFinished"]();
				}
			});
		}
	}

	requestBanner(bannerDictArray) {
		console.log("WinterpixelAds requestBanner");

		if(this.driver == "winterpixel") {
			// todo
		}
		else if(this.driver == "adinplay") {
			request_banner();
		}
		else if(this.driver == "crazygames") {
			this.crazysdk.requestBanner(bannerDictArray);
		}
	}

	requestResponsiveBanner(bannerArray) {
		console.log("WinterpixelAds requestResponsiveBanner");

		if(this.driver == "winterpixel") {
			// todo
		}
		else if(this.driver == "adinplay") {
			request_banner();
		}
		else if(this.driver == "crazygames") {
			this.crazysdk.requestResponsiveBanner(bannerArray);
		}
	}
};

if (typeof window !== 'undefined') {
	window['WinterpixelAds'] = new WinterpixelAds();
}


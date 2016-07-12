/// <reference path="common.ts"/>

chrome.browserAction.onClicked.addListener((tab: chrome.tabs.Tab) => {
	chrome.storage.local.get(defaultOptions, function (opts: Options) {
		if (opts.Button.Enabled) {
			const kc = "https://krautchan.net/" + opts.Button.Board + "/";
			chrome.tabs.create({ url: kc });
		}
	});
});

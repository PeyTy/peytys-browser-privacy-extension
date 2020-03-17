// Browser Privacy Extension
// Copyright (C) 2020  Oleg Petrenko
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Lesser General Public License as published by
// the Free Software Foundation, version 3 of the License.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Lesser General Public License for more details.
//
// You should have received a copy of the GNU Lesser General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

const randomString = () => {
	let text = ""
	const charset = "abcdefghijklmnopqrstuvwxyz"
	for (var i = 0; i < 5; i++)
		text += charset.charAt(Math.floor(Math.random() * charset.length))
	return text
}

let agent = "Windows NT 6.1;"
let agentReplace = true

chrome.storage.local.set({ docId: randomString() })
chrome.storage.local.get(["enabled", "profile"], (items = {}) => {
	const { enabled = true, profile = {} } = items
	const path = chrome.extension.getURL(`/images/${enabled? "16.png" : "disabled.png"}`)
	chrome.browserAction.setIcon({ path })
	agent = profile.agent || "Windows NT 6.1;"
	agentReplace = enabled
})

const notifyUser = (title, message, url) => {
	var options = {
		type: "basic",
		title,
		message: message,
		iconUrl: "images/64.png"
	}
	if (url) {
		chrome.notifications.create(`chrome-privacy-extension-${randomString()}`, options, (notificationId) => {
			setTimeout(() => {
				chrome.notifications.clear(notificationId, () => {})
			}, 5000)
		})
	} else {
		chrome.notifications.create("chrome-privacy-extension", options, (notificationId) => {})
	}
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.action === "open-options") {
		chrome.tabs.create({ url: chrome.extension.getURL("/html/options.html") })
	} else if (request.action === "show-notification") {
		notifyUser("Kill it with fire!", `This page tries to generate unique ID ${request.url}`, request.url)
	}
})

chrome.storage.onChanged.addListener((changes, namespace) => {
	for (key in changes) {
		if (key == "profile") {
			agent = changes["profile"].newValue.agent || "Windows NT 6.1;"
		}
		if (key == "enabled") {
			agentReplace = changes["enabled"].newValue
		}
	}
});

const onBeforeSendHeaders = (details) => {
	var header = { requestHeaders: details.requestHeaders };
	if (agentReplace == false) return header;
	if (details && details.url && details.requestHeaders && details.requestHeaders.length > 0) {
		for (const head of details.requestHeaders)
			if (head.name == "User-Agent") {
				const inStr = head.value.toString()
				const newSourceValue = agent
				head.value = inStr.replace(/Windows NT [0123456789\.]+;/, newSourceValue);
			}
	}
	return header;
}

chrome.webRequest.onBeforeSendHeaders.addListener(onBeforeSendHeaders, { "urls": ["http://*/*", "https://*/*"] }, ["requestHeaders", "blocking"]);

/*chrome.privacy.network.webRTCIPHandlingPolicy.set({
	value: 'default'
})*/

chrome.storage.local.set({
	rtcIPHandling: 'default_public_and_private_interfaces'
}, () => {
	chrome.privacy.network.webRTCIPHandlingPolicy.set({
		value: 'default_public_and_private_interfaces'
	});
})

/*
if(chrome.privacy) {
	if (typeof chrome.privacy['IPHandlingPolicy'] !== 'undefined') {
		window.IPHandlingPolicy = chrome.privacy['IPHandlingPolicy']
		console.info("chrome.privacy.IPHandlingPolicy is already defined", window.IPHandlingPolicy);
	}

	if (typeof window.IPHandlingPolicy === 'undefined') {
		window.IPHandlingPolicy = {
			DEFAULT: 'default',
			DEFAULT_PUBLIC_AND_PRIVATE_INTERFACES: 'default_public_and_private_interfaces',
			DEFAULT_PUBLIC_INTERFACE_ONLY: 'default_public_interface_only',
			DISABLE_NON_PROXIED_UDP: 'disable_non_proxied_udp'
		}
	}

	const GOOD_POLICY = window.IPHandlingPolicy.DISABLE_NON_PROXIED_UDP
	{
		(function(policy) {

			chrome.privacy.network.webRTCIPHandlingPolicy.set({
				value: policy
			})

		})(GOOD_POLICY)
	}
} else {
	console.info("No chrome.privacy support!")
}
*/

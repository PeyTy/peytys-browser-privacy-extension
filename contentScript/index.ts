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

let allowScripts = true
if (window.frameElement != null && (window.frameElement as any).sandbox != null) {
	allowScripts = false
	for (let i = 0; i < (window.frameElement as any).sandbox.length; i++) {
		const val = (window.frameElement as any).sandbox[i]
		if (val == 'allow-scripts') {
			allowScripts = true
		}
	}
}

const storedObjectPrefix = utils.randomString()

const patch = (docId: string, code: string, profile: types.Profile, notifys: boolean): void => {
	const script = document.createElement('script')
	script.id = utils.randomString()
	script.type = "text/javascript"
	if (allowScripts) {
		const newChild = document.createTextNode(`;(` + code + `)(${JSON.stringify(profile)}, '${script.id}', '${storedObjectPrefix}', ${notifys});`)
		script.appendChild(newChild)
		const node: any = (document.documentElement || document.head || document.body)
		if (typeof node[docId] === 'undefined') {
			node.insertBefore(script, node.firstChild)
			node[docId] = utils.randomString()
		}
	}
}

if (allowScripts) {
	chrome.storage.local.get(["docId", "enabled", "profile", "notifys"], (elems) => {
		const { docId = utils.randomString(), enabled = true, profile, notifys = true } = elems || {}
		if (enabled) {
			patch(docId, replacer.code.toString(), profile, notifys)
		} else {
			const node: any = (document.documentElement || document.head || document.body)
			if (node[docId]) {
				delete node[docId]
			}
		}
	})
}

const showNotification = () => {
	chrome.runtime.sendMessage({ action: "show-notification", url: window.location.href })
}

let notificationTimeoutID: number = 0
{
	(() => {
		window.addEventListener(storedObjectPrefix + "_notification_custom_event", (evt) => {
			if (notificationTimeoutID) {
				clearTimeout(notificationTimeoutID)
			}
			notificationTimeoutID = setTimeout(showNotification, 2 * 1000)
		})
	})()
}

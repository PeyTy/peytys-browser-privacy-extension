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

import React, {useState, useEffect} from 'react'

declare type Profile = {
	name: string,
	id: string,
	agent: string,
	gpu: string,
	latitude: number,
	longitude: number,
}

declare const chrome: any

function generateProfile(name: string, profiles: Profile[]): Profile {
	let id = generateId()
	for (const profile of profiles) {
		// Avoid collisions
		if (profile.id == id) id = generateId()
	}
	let latlng = generateRandomLatLng()
	return {
		name: name,
		id: id,
		latitude: latlng.lat,
		longitude: latlng.lng,
		agent: "Windows NT 6.1;",
		gpu: "-1",
	}
}

function generateRandomLatLng() {
	const lat = (Math.random() * 180) - 90; // generate a random latitude between -90 and 90
	const lng = (Math.random() * 360) - 180; // generate a random longitude between -180 and 180
	return {
	  lat: parseFloat(lat.toFixed(6)),
	  lng: parseFloat(lng.toFixed(6))
	};
  }

function getProfile(id: string, profiles: Profile[]): Profile | undefined {
	for (const profile of profiles) {
		if (profile.id == id) {
			return profile
		}
	}
}

function generateId(): string {
	return '' + Math.round(11703511 + Math.random()*10000000000)
}

function App() {
	// Storage
	const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null)
	const [ready, setReady] = useState(false)
	const [profiles, setProfiles] = useState<Profile[]>([])
	const [enabled, setEnabled] = useState(true)
	const [notifys, setNotifys] = useState(true)

	// GUI
	const [generateName, setGenerateName] = useState('')
	const [latitude, setLatitude] = useState('')
	const [longitude, setLongitude] = useState('')

	// Handle initial (zero) state and deletion of all profiles
	useEffect(() => {
		if (profiles.length != 0 && selectedProfile != null) return
		if (ready == false) return

		const stub = generateProfile('Profile', [])
		const stubs = [stub]
		chrome.storage.local.set({ profiles: stubs, profile: stub }, ()=>{
			setProfiles(stubs)
			setSelectedProfile(stub)
		})
	}, [selectedProfile, profiles, ready])

	useEffect(() => {
		const path = chrome.extension.getURL(`/images/${enabled? "16.png" : "disabled.png"}`)
		chrome.browserAction.setIcon({ path })
	}, [enabled])

	useEffect(() => {
		if (selectedProfile == null) return
		setLatitude('' + selectedProfile.latitude)
		setLongitude('' + selectedProfile.longitude)
	}, [selectedProfile])

	useEffect(() => {
		chrome.storage.local.get(["profile", "profiles", "enabled", "notifys"], (elems: any = {}) => {
			const { profile, profiles = [], enabled = true, notifys = true } = elems
			setProfiles(profiles)
			for (const profileToCheck of profiles) {
				// Reuse same runtime reference
				if (profile != null && profile.id == profileToCheck.id) {
					setSelectedProfile(profileToCheck)
				}
			}
			setEnabled(enabled)
			setNotifys(notifys)
			setReady(true)
		})
	}, []) // Ensure the useEffect only runs once

	function toggleEnabled() {
		chrome.storage.local.set({ enabled: !enabled }, () => {
			setEnabled(!enabled)
		})
	}

	function toggleNotifys() {
		chrome.storage.local.set({ notifys: !notifys }, () => {
			setNotifys(!notifys)
		})
	}

	function addProfile() {
		profiles.push(generateProfile(generateName.trim() || 'Profile', profiles))
		chrome.storage.local.set({ profiles: profiles }, () => {
			setProfiles(profiles.slice()) // Force react update
			setGenerateName('')
		})
	}

	function changeGPU(value: string, selectedProfile: Profile) {
		selectedProfile.gpu = value
		chrome.storage.local.set({ profiles: profiles, profile: selectedProfile }, () => {
			setProfiles(profiles.slice()) // Force react update
		})
	}

	function changeAgent(value: string, selectedProfile: Profile) {
		selectedProfile.agent = value
		chrome.storage.local.set({ profiles: profiles, profile: selectedProfile }, () => {
			setProfiles(profiles.slice()) // Force react update
		})
	}

	function changeName(value: string, selectedProfile: Profile) {
		selectedProfile.name = value
		setProfiles(profiles.slice()) // Have to do this so caret don't jump
		chrome.storage.local.set({ profiles: profiles, profile: selectedProfile }, () => {
			setProfiles(profiles.slice()) // Force react update
		})
	}

	function changeLatitude(value: string, selectedProfile: Profile) {
		const float = parseFloat(value)
		setLatitude(value)
		if (float != float) return // NaN
		selectedProfile.latitude = float
		chrome.storage.local.set({ profiles: profiles, profile: selectedProfile }, () => {
			setProfiles(profiles.slice()) // Force react update
		})
	}

	function changeLongitude(value: string, selectedProfile: Profile) {
		const float = parseFloat(value)
		setLongitude(value)
		if (float != float) return // NaN
		selectedProfile.longitude = float
		chrome.storage.local.set({ profiles: profiles, profile: selectedProfile }, () => {
			setProfiles(profiles.slice()) // Force react update
		})
	}

	function selectProfile(profile: Profile) {
		chrome.storage.local.set({ profile }, () => {
			setSelectedProfile(profile)
		})
	}

	// TODO chrome.storage.local.set({ profileS } to effect so it autosaves!

	function removeProfile(profile: Profile, selectedProfile: Profile) {
		const cleaned = profiles.filter(profileToCheck => profile.id != profileToCheck.id)
		if (profile.id == selectedProfile.id) setSelectedProfile(cleaned[0])
		chrome.storage.local.set({ profiles: cleaned }, () => {
			setProfiles(cleaned)
		})
	}

	return (
		<>
			<div className="py-1 text-center">
				<h4>Browser <i>Privacy Extension</i></h4>
				<p className="lead">Replace your web identity.</p>
				<b>Current profile:</b> <span>{
					selectedProfile == null?
					'no profile selected'
					:
					selectedProfile.name.trim() + '#' + selectedProfile.id
				}</span>
			</div>
		{ selectedProfile == null? <>Loading...</> : (
			<div className="row">
				<div className="col-md-4 order-md-2 mb-4">
					<h4 className="d-flex justify-content-between align-items-center mb-3">
						<span className="text-muted small">Your profiles</span>
						<span className="badge badge-secondary badge-pill">{profiles.length}</span>
					</h4>
					<ul className="list-group mb-3">
					{
						profiles.map(profile => {
							const current = profile.id == selectedProfile.id

							return (
								<li key={profile.id} className={"list-group-item d-flex justify-content-between " + (current && 'bg-light' || 'lh-condensed')}>
									<div className={current && 'text-success' || ''}>
										<h6 className="my-0">{profile.name.trim()}</h6>
										<small className="text-muted">
											#{profile.id}&nbsp;({profile.latitude},&nbsp;{profile.longitude})&nbsp;{profile.agent || 'Windows NT 6.1;'}
										</small>
									</div>
									<span className="text-muted">
										<a href="#_" style={current && {display: 'none'} || {}} onClick={_ => selectProfile(profile)}>select</a>
										&nbsp;
										<a href="#_" className="text-danger" onClick={_ => removeProfile(profile, selectedProfile)}>delete</a>
									</span>
								</li>
							)
						})
					}
					</ul>
					<form className="card p-2">
						<div className="input-group">
							<input type="text" className="form-control" placeholder="Profile name" value={generateName} onChange={e => setGenerateName(e.target.value)}/>
							<div className="input-group-append">
								<button type="submit" className="btn btn-secondary btn-sm" onClick={addProfile}>Create</button>
							</div>
						</div>
					</form>
				</div>
				<div className="col-md-8 order-md-1">
					<div className="mb-3">
						<label htmlFor="textName">Profile name</label>
						<div className="input-group">
							<div className="input-group-prepend">
								<span className="input-group-text">#{selectedProfile.id}</span>
							</div>
							<input type="text" className="form-control" id="textName" maxLength={90} placeholder="My profile" value={selectedProfile.name} onChange={e => changeName(e.target.value, selectedProfile)} required/>
							<div className="invalid-feedback" style={{width: "100%"}}>
								Profile name is required.
							</div>
						</div>
					</div>
					<h6 className="mb-3">Geolocation (GPS)</h6>
					<div className="row">
						<div className="col-md-6 mb-3 half">
							<label htmlFor="latitude">Latitude</label>
							<input type="text" className="form-control" maxLength={30} id="latitude" placeholder="40.730610" value={latitude} onChange={e => changeLatitude(e.target.value, selectedProfile)} required/>
							<div className="invalid-feedback">
								Valid latitude is required.
							</div>
						</div>
						<div className="col-md-6 mb-3 half">
							<label htmlFor="longitude">Longitude</label>
							<input type="text" className="form-control" maxLength={30} id="longitude" placeholder="-73.935242" value={longitude} onChange={e => changeLongitude(e.target.value, selectedProfile)} required/>
							<div className="invalid-feedback">
								Valid longitude is required.
							</div>
						</div>
					</div>
					<div className="row">
						<div className="col-md-6 mb-3 half">
							<label htmlFor="agent">User agent</label>
							<select name="agent" id="agent" className="custom-select d-block w-100" onChange={e => changeAgent(e.target.value, selectedProfile)}>
								<option selected={selectedProfile.agent == "Windows NT 10.0;"} value="Windows NT 10.0;">Windows 10 (NT 10.0)</option>
								<option selected={selectedProfile.agent == "Windows NT 6.3;"} value="Windows NT 6.3;">Windows 8.1 (NT 6.3)</option>
								<option selected={selectedProfile.agent == "Windows NT 6.2;"} value="Windows NT 6.2;">Windows 8.0 (NT 6.2)</option>
								<option selected={selectedProfile.agent == "Windows NT 6.1;"} value="Windows NT 6.1;">Windows 7 (NT 6.1)</option>
							</select>
						</div>
						<div className="col-md-6 mb-3 half">
							{ 'TODO randomization button' && null }
							<label htmlFor="gpu">Video card</label>
							<select name="gpu" id="gpu" className="custom-select d-block w-100" onChange={e => changeGPU(e.target.value, selectedProfile)}>
								<option selected={selectedProfile.gpu == "-1"} value="-1">Do not replace</option>
								<option selected={selectedProfile.gpu == "0"} value="0">GeForce GTX 560 Ti</option>
								<option selected={selectedProfile.gpu == "1"} value="1">GeForce GTS 450</option>
								<option selected={selectedProfile.gpu == "2"} value="2">GeForce GTX 570</option>
								<option selected={selectedProfile.gpu == "3"} value="3">GeForce 210</option>
								<option selected={selectedProfile.gpu == "4"} value="4">GeForce GTX 1050 Ti</option>
								<option selected={selectedProfile.gpu == "5"} value="5">GeForce GTX 1060</option>
								<option selected={selectedProfile.gpu == "6"} value="6">GeForce GTX 750 Ti</option>
								<option selected={selectedProfile.gpu == "7"} value="7">GeForce GTX 960</option>
								<option selected={selectedProfile.gpu == "8"} value="8">ATI Mobility Radeon HD 5000</option>
								<option selected={selectedProfile.gpu == "9"} value="9">Intel Haswell 4400</option>
								<option selected={selectedProfile.gpu == "10"} value="10">Intel HD Graphics 3000</option>
								<option selected={selectedProfile.gpu == "11"} value="11">Intel HD Graphics 4000</option>
							</select>
						</div>
					</div>
				</div>
			</div>
		)}
			<footer className="my-1 pt-1 text-muted text-center text-small">
				<ul className="list-inline">
					<li className="list-inline-item">
						<button type="button" onClick={toggleEnabled} className="btn btn-primary btn-lg btn-block btn-sm">{enabled ? 'Privacy protection is active' : 'Privacy protection disabled'}</button>
					</li>
					<li className="list-inline-item">
						<button type="button" onClick={toggleNotifys} className="btn btn-primary btn-lg btn-block btn-sm">{notifys ? 'Notifications are active' : 'Notifications disabled'}</button>
					</li>
				</ul>
				<p className="mb-1">&copy; 2020 PeyTy</p>
				<p className="py-1 mb-1"><a href="https://www.patreon.com/PeyTy" className="hellur" title="https://www.patreon.com/PeyTy" onClick={e => { chrome.tabs.create({url: "https://www.patreon.com/PeyTy" }); e.preventDefault() }}>Support me on Patreon</a></p>
			</footer>
		</>
	);
}

export default App;

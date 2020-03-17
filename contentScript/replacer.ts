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

namespace replacer {
	export const code = (profile: types.Profile, scriptID: string, storedObjectPrefix: string, notifys: boolean): void => {
				"use strict"
				if (!profile) return alert("No profile selected")
				const latitude = profile.latitude
				const longitude = profile.longitude

				// Fonts

				// https://stackoverflow.com/questions/424292/seedable-javascript-random-number-generator
				class RNG {
					m: number
					a: number
					c: number
					state: number
					constructor(seed: number) {
						// LCG using GCC's constants
						this.m = 0x80000000; // 2**31;
						this.a = 1103515245;
						this.c = 12345;
						this.state = seed ? seed : Math.floor(Math.random() * (this.m - 1));
					}

					nextInt() {
						this.state = (this.a * this.state + this.c) % this.m;
						return this.state;
					}

					nextFloat() {
						// returns in range [0,1]
						return this.nextInt() / (this.m - 1);
					}
				}

				const rng = new RNG(parseFloat(profile.id))

				const shuffle = (a: string[]): void => {
					let j: number, x: string, i: number;
					for (i = a.length - 1; i > 0; i--) {
						j = Math.floor(rng.nextFloat() * (i + 1));
						x = a[i];
						a[i] = a[j];
						a[j] = x;
					}
				}

				let fontList = [
					'Andale Mono', 'Arial', 'Arial Black', 'Arial Hebrew', 'Arial MT', 'Arial Narrow', 'Arial Rounded MT Bold', 'Arial Unicode MS',
					'Bitstream Vera Sans Mono', 'Book Antiqua', 'Bookman Old Style',
					'Calibri', 'Cambria', 'Cambria Math', 'Century', 'Century Gothic', 'Century Schoolbook', 'Comic Sans', 'Comic Sans MS', 'Consolas', 'Courier', 'Courier New',
					'Garamond', 'Geneva', 'Georgia',
					'Helvetica', 'Helvetica Neue',
					'Impact',
					'Lucida Bright', 'Lucida Calligraphy', 'Lucida Console', 'Lucida Fax', 'LUCIDA GRANDE', 'Lucida Handwriting', 'Lucida Sans', 'Lucida Sans Typewriter', 'Lucida Sans Unicode',
					'Microsoft Sans Serif', 'Monaco', 'Monotype Corsiva', 'MS Gothic', 'MS Outlook', 'MS PGothic', 'MS Reference Sans Serif', 'MS Sans Serif', 'MS Serif', 'MYRIAD', 'MYRIAD PRO',
					'Palatino', 'Palatino Linotype',
					'Segoe Print', 'Segoe Script', 'Segoe UI', 'Segoe UI Light', 'Segoe UI Semibold', 'Segoe UI Symbol',
					'Tahoma', 'Times', 'Times New Roman', 'Times New Roman PS', 'Trebuchet MS',
					'Verdana', 'Wingdings', 'Wingdings 2', 'Wingdings 3',
					'Abadi MT Condensed Light', 'Academy Engraved LET', 'ADOBE CASLON PRO', 'Adobe Garamond', 'ADOBE GARAMOND PRO', 'Agency FB', 'Aharoni', 'Albertus Extra Bold', 'Albertus Medium', 'Algerian', 'Amazone BT', 'American Typewriter',
					'American Typewriter Condensed', 'AmerType Md BT', 'Andalus', 'Angsana New', 'AngsanaUPC', 'Antique Olive', 'Aparajita', 'Apple Chancery', 'Apple Color Emoji', 'Apple SD Gothic Neo', 'Arabic Typesetting', 'ARCHER',
					'ARNO PRO', 'Arrus BT', 'Aurora Cn BT', 'AvantGarde Bk BT', 'AvantGarde Md BT', 'AVENIR', 'Ayuthaya', 'Bandy', 'Bangla Sangam MN', 'Bank Gothic', 'BankGothic Md BT', 'Baskerville',
					'Baskerville Old Face', 'Batang', 'BatangChe', 'Bauer Bodoni', 'Bauhaus 93', 'Bazooka', 'Bell MT', 'Bembo', 'Benguiat Bk BT', 'Berlin Sans FB', 'Berlin Sans FB Demi', 'Bernard MT Condensed', 'BernhardFashion BT', 'BernhardMod BT', 'Big Caslon', 'BinnerD',
					'Blackadder ITC', 'BlairMdITC TT', 'Bodoni 72', 'Bodoni 72 Oldstyle', 'Bodoni 72 Smallcaps', 'Bodoni MT', 'Bodoni MT Black', 'Bodoni MT Condensed', 'Bodoni MT Poster Compressed',
					'Bookshelf Symbol 7', 'Boulder', 'Bradley Hand', 'Bradley Hand ITC', 'Bremen Bd BT', 'Britannic Bold', 'Broadway', 'Browallia New', 'BrowalliaUPC', 'Brush Script MT', 'Californian FB', 'Calisto MT', 'Calligrapher', 'Candara',
					'CaslonOpnface BT', 'Castellar', 'Centaur', 'Cezanne', 'CG Omega', 'CG Times', 'Chalkboard', 'Chalkboard SE', 'Chalkduster', 'Charlesworth', 'Charter Bd BT', 'Charter BT', 'Chaucer',
					'ChelthmITC Bk BT', 'Chiller', 'Clarendon', 'Clarendon Condensed', 'CloisterBlack BT', 'Cochin', 'Colonna MT', 'Constantia', 'Cooper Black', 'Copperplate', 'Copperplate Gothic', 'Copperplate Gothic Bold',
					'Copperplate Gothic Light', 'CopperplGoth Bd BT', 'Corbel', 'Cordia New', 'CordiaUPC', 'Cornerstone', 'Coronet', 'Cuckoo', 'Curlz MT', 'DaunPenh', 'Dauphin', 'David', 'DB LCD Temp', 'DELICIOUS', 'Denmark',
					'DFKai-SB', 'Didot', 'DilleniaUPC', 'DIN', 'DokChampa', 'Dotum', 'DotumChe', 'Ebrima', 'Edwardian Script ITC', 'Elephant', 'English 111 Vivace BT', 'Engravers MT', 'EngraversGothic BT', 'Eras Bold ITC', 'Eras Demi ITC', 'Eras Light ITC', 'Eras Medium ITC',
					'EucrosiaUPC', 'Euphemia', 'Euphemia UCAS', 'EUROSTILE', 'Exotc350 Bd BT', 'FangSong', 'Felix Titling', 'Fixedsys', 'FONTIN', 'Footlight MT Light', 'Forte',
					'FrankRuehl', 'Fransiscan', 'Freefrm721 Blk BT', 'FreesiaUPC', 'Freestyle Script', 'French Script MT', 'FrnkGothITC Bk BT', 'Fruitger', 'FRUTIGER',
					'Futura', 'Futura Bk BT', 'Futura Lt BT', 'Futura Md BT', 'Futura ZBlk BT', 'FuturaBlack BT', 'Gabriola', 'Galliard BT', 'Gautami', 'Geeza Pro', 'Geometr231 BT', 'Geometr231 Hv BT', 'Geometr231 Lt BT', 'GeoSlab 703 Lt BT',
					'GeoSlab 703 XBd BT', 'Gigi', 'Gill Sans', 'Gill Sans MT', 'Gill Sans MT Condensed', 'Gill Sans MT Ext Condensed Bold', 'Gill Sans Ultra Bold', 'Gill Sans Ultra Bold Condensed', 'Gisha', 'Gloucester MT Extra Condensed', 'GOTHAM', 'GOTHAM BOLD',
					'Goudy Old Style', 'Goudy Stout', 'GoudyHandtooled BT', 'GoudyOLSt BT', 'Gujarati Sangam MN', 'Gulim', 'GulimChe', 'Gungsuh', 'GungsuhChe', 'Gurmukhi MN', 'Haettenschweiler', 'Harlow Solid Italic', 'Harrington', 'Heather', 'Heiti SC', 'Heiti TC', 'HELV',
					'Herald', 'High Tower Text', 'Hiragino Kaku Gothic ProN', 'Hiragino Mincho ProN', 'Hoefler Text', 'Humanst 521 Cn BT', 'Humanst521 BT', 'Humanst521 Lt BT', 'Imprint MT Shadow', 'Incised901 Bd BT', 'Incised901 BT',
					'Incised901 Lt BT', 'INCONSOLATA', 'Informal Roman', 'Informal011 BT', 'INTERSTATE', 'IrisUPC', 'Iskoola Pota', 'JasmineUPC', 'Jazz LET', 'Jenson', 'Jester', 'Jokerman', 'Juice ITC', 'Kabel Bk BT', 'Kabel Ult BT', 'Kailasa', 'KaiTi', 'Kalinga', 'Kannada Sangam MN',
					'Kartika', 'Kaufmann Bd BT', 'Kaufmann BT', 'Khmer UI', 'KodchiangUPC', 'Kokila', 'Korinna BT', 'Kristen ITC', 'Krungthep', 'Kunstler Script', 'Lao UI', 'Latha', 'Leelawadee', 'Letter Gothic', 'Levenim MT', 'LilyUPC', 'Lithograph', 'Lithograph Light', 'Long Island',
					'Lydian BT', 'Magneto', 'Maiandra GD', 'Malayalam Sangam MN', 'Malgun Gothic',
					'Mangal', 'Marigold', 'Marion', 'Marker Felt', 'Market', 'Marlett', 'Matisse ITC', 'Matura MT Script Capitals', 'Meiryo', 'Meiryo UI', 'Microsoft Himalaya', 'Microsoft JhengHei', 'Microsoft New Tai Lue', 'Microsoft PhagsPa', 'Microsoft Tai Le',
					'Microsoft Uighur', 'Microsoft YaHei', 'Microsoft Yi Baiti', 'MingLiU', 'MingLiU_HKSCS', 'MingLiU_HKSCS-ExtB', 'MingLiU-ExtB', 'Minion', 'Minion Pro', 'Miriam', 'Miriam Fixed', 'Mistral', 'Modern', 'Modern No. 20', 'Mona Lisa Solid ITC TT', 'Mongolian Baiti',
					'MONO', 'MoolBoran', 'Mrs Eaves', 'MS LineDraw', 'MS Mincho', 'MS PMincho', 'MS Reference Specialty', 'MS UI Gothic', 'MT Extra', 'MUSEO', 'MV Boli',
					'Nadeem', 'Narkisim', 'NEVIS', 'News Gothic', 'News GothicMT', 'NewsGoth BT', 'Niagara Engraved', 'Niagara Solid', 'Noteworthy', 'NSimSun', 'Nyala', 'OCR A Extended', 'Old Century', 'Old English Text MT', 'Onyx', 'Onyx BT', 'OPTIMA', 'Oriya Sangam MN',
					'OSAKA', 'OzHandicraft BT', 'Palace Script MT', 'Papyrus', 'Parchment', 'Party LET', 'Pegasus', 'Perpetua', 'Perpetua Titling MT', 'PetitaBold', 'Pickwick', 'Plantagenet Cherokee', 'Playbill', 'PMingLiU', 'PMingLiU-ExtB',
					'Poor Richard', 'Poster', 'PosterBodoni BT', 'PRINCETOWN LET', 'Pristina', 'PTBarnum BT', 'Pythagoras', 'Raavi', 'Rage Italic', 'Ravie', 'Ribbon131 Bd BT', 'Rockwell', 'Rockwell Condensed', 'Rockwell Extra Bold', 'Rod', 'Roman', 'Sakkal Majalla',
					'Santa Fe LET', 'Savoye LET', 'Sceptre', 'Script', 'Script MT Bold', 'SCRIPTINA', 'Serifa', 'Serifa BT', 'Serifa Th BT', 'ShelleyVolante BT', 'Sherwood',
					'Shonar Bangla', 'Showcard Gothic', 'Shruti', 'Signboard', 'SILKSCREEN', 'SimHei', 'Simplified Arabic', 'Simplified Arabic Fixed', 'SimSun', 'SimSun-ExtB', 'Sinhala Sangam MN', 'Sketch Rockwell', 'Skia', 'Small Fonts', 'Snap ITC', 'Snell Roundhand', 'Socket',
					'Souvenir Lt BT', 'Staccato222 BT', 'Steamer', 'Stencil', 'Storybook', 'Styllo', 'Subway', 'Swis721 BlkEx BT', 'Swiss911 XCm BT', 'Sylfaen', 'Synchro LET', 'System', 'Tamil Sangam MN', 'Technical', 'Teletype', 'Telugu Sangam MN', 'Tempus Sans ITC',
					'Terminal', 'Thonburi', 'Traditional Arabic', 'Trajan', 'TRAJAN PRO', 'Tristan', 'Tubular', 'Tunga', 'Tw Cen MT', 'Tw Cen MT Condensed', 'Tw Cen MT Condensed Extra Bold',
					'TypoUpright BT', 'Unicorn', 'Univers', 'Univers CE 55 Medium', 'Univers Condensed', 'Utsaah', 'Vagabond', 'Vani', 'Vijaya', 'Viner Hand ITC', 'VisualUI', 'Vivaldi', 'Vladimir Script', 'Vrinda', 'Westminster', 'WHITNEY', 'Wide Latin',
					'ZapfEllipt BT', 'ZapfHumnst BT', 'ZapfHumnst Dm BT', 'Zapfino', 'Zurich BlkEx BT', 'Zurich Ex BT', 'ZWAdobeF'
				]

				// Randomize
				shuffle(fontList)
				// Use only some part of fontList, to simulate that some fonts are not installed
				fontList = fontList.splice(0, Math.floor(fontList.length / 2))
				// Sort alphabetically
				fontList = fontList.splice(0, Math.floor(fontList.length / 2)).sort()

				// Like `font-family: "Blah",sans-serif;` to `font-family: Blah;`
				// Note: returns a non-fallback font
				const cleanUpQuotes = (str: string) => {
					if (str.indexOf(',') !== -1) str = str.split(',')[0].trim()
					while (str.indexOf('"') !== -1) str = str.replace('"', '')
					while (str.indexOf("'") !== -1) str = str.replace("'", '')
					return str
				}

				// Use provided or default fallback font
				const baseOrMonospace = (str: string) => {
					if (str.indexOf(',') === -1) return 'monospace'
					return str.split(',')[1].trim()
				}

				(window as any).$$_setProperty_ = (window as any).$$_setProperty_ || CSSStyleDeclaration.prototype.setProperty
				Object.defineProperty(CSSStyleDeclaration.prototype, "setProperty", {
					value: function(propertyName: string, value: string, priority: any) {
						// Disallow usage of "not available" fonts
						if (propertyName === 'font-family' && fontList.indexOf(cleanUpQuotes(value)) === -1) value = baseOrMonospace(value)
						return (window as any).$$_setProperty_.apply(this, arguments)
					},
				})

				Object.defineProperty(CSSStyleDeclaration.prototype, "fontFamily", {
					set: function(value: string) {
						// Disallow usage of "not available" fonts
						if (fontList.indexOf(cleanUpQuotes(value)) === -1) value = baseOrMonospace(value)
						return (window as any).$$_setProperty_.apply(this, ['font-family', value])
					},
				})

				// Battery

				// Always return same value
				const setAlways = (prot: typeof BatteryManager.prototype, name: string, val: number | boolean) => {
					Object.defineProperty(prot, name, {
						get: function() {
							return val
						},
					})
				}

				// Pretend like this is not a laptop
				setAlways(BatteryManager.prototype, "charging", true)
				setAlways(BatteryManager.prototype, "chargingTime", 0)
				setAlways(BatteryManager.prototype, "dischargingTime", Infinity)
				setAlways(BatteryManager.prototype, "level", 1)

				// Geolocation

				if (navigator.geolocation) {

					(navigator.geolocation as any).$$_getCurrentPosition_ = navigator.geolocation.getCurrentPosition;
					(navigator.geolocation as any).$$_watchPosition_ = navigator.geolocation.watchPosition;

					navigator.geolocation.getCurrentPosition = function(success, error, options) {
						function successor(position: Position) {
							Object.defineProperty(position.coords, 'latitude', { value: latitude, })
							Object.defineProperty(position.coords, 'longitude', { value: longitude, })
							success(position)
						}
						return (navigator.geolocation as any).$$_getCurrentPosition_(successor, error, options);
					};

					navigator.geolocation.watchPosition = function(success, error, options) {
						function successor(position: Position) {
							Object.defineProperty(position.coords, 'latitude', { value: latitude, })
							Object.defineProperty(position.coords, 'longitude', { value: longitude, })
							success(position)
						}
						return (navigator.geolocation as any).$$_watchPosition_(successor, error, options);
					};
				}

				// Audio

				let rgba = parseFloat(profile.id)
				while (rgba > 0.1) { rgba = rgba * 0.1 }
				rgba = 1.05 - rgba;

				(window as any).$$_getFloatFrequencyData_ = (window as any).$$_getFloatFrequencyData_ || AnalyserNode.prototype.getFloatFrequencyData
				Object.defineProperty(AnalyserNode.prototype, "getFloatFrequencyData", {
					value: function() {
						(window as any).$$_getFloatFrequencyData_.apply(this, arguments)
						const b = arguments[0]
						// Add some noise
						for (let i = 0; i < b.length; i = i + 1) {
							b[i] = b[i] * ((1.0 + rgba) * 0.5)
						}
						return undefined
					}
				});

				(window as any).$$_getChannelData_ = (window as any).$$_getChannelData_ || AudioBuffer.prototype.getChannelData
				Object.defineProperty(AudioBuffer.prototype, "getChannelData", {
					value: function() {
						const b = (window as any).$$_getChannelData_.apply(this, arguments)
						// Add some noise
						for (let i = 0; i < b.length; i = i + 1) {
							b[i] = b[i] * ((1.0 + rgba) * 0.5)
						}
						return b
					}
				})

				// Show some annoying notifications

				let showNotificationDid = false

				const showNotification = () => {
					if (showNotificationDid) return;
					if (!notifys) return;
					showNotificationDid = !showNotificationDid
					const evt = new CustomEvent(storedObjectPrefix + "_notification_custom_event", { 'detail': {} });
					window.dispatchEvent(evt);
				}

				// Canvas and WebGL

				const UNMASKED_RENDERER_WEBGL = 0x9246
				const UNMASKED_VENDOR_WEBGL = 0x9245

				function overloadDocumentProto(root: typeof Document) {
					function dooverloadDocumentProto(old: Function, name: string) {
						(root.prototype as any)[storedObjectPrefix + name] = old;
						Object.defineProperty(root.prototype, name, {
							value: function() {
								let element: NodeListOf<HTMLElement> = old.apply(this, arguments);
								if (element == null) {
									return null;
								}
								if (Object.prototype.toString.call(element) === '[object HTMLCollection]' ||
									Object.prototype.toString.call(element) === '[object NodeList]') {
									for (let i = 0; i < element.length; ++i) {
										const el = element[i];
										inject(el);
									}
								} else {
									inject(element);
								}
								return element;
							}
						});
					}
					dooverloadDocumentProto(root.prototype.createElement, "createElement");
					dooverloadDocumentProto(root.prototype.createElementNS, "createElementNS");
					dooverloadDocumentProto(root.prototype.getElementById, "getElementById");
					dooverloadDocumentProto(root.prototype.getElementsByName, "getElementsByName");
					dooverloadDocumentProto(root.prototype.getElementsByClassName, "getElementsByClassName");
					dooverloadDocumentProto(root.prototype.getElementsByTagName, "getElementsByTagName");
					dooverloadDocumentProto(root.prototype.getElementsByTagNameNS, "getElementsByTagNameNS");
				}

				function inject(element: NodeListOf<HTMLElement> | HTMLElement | any) {
					if (element.tagName.toUpperCase() === "IFRAME" && element.contentWindow) {
						try {
							const hasAccess = element.contentWindow.HTMLCanvasElement;
						} catch (e) {
							return;
						}
						overloadCanvasRenderingContext2D(element.contentWindow.CanvasRenderingContext2D);
						overloadElement(element.contentWindow.Element);
						overloadDocumentProto(element.contentWindow.Document);
					}
				}

				overloadDocumentProto(Document);

				// Add some noise to the image
				// It is common to use fillText for fingerprinting
				function overloadCanvasRenderingContext2D(root: typeof CanvasRenderingContext2D) {
					showNotification();
					(window as any).$$_fillText_ = (window as any).$$_fillText_ || root.prototype.fillText;
					Object.defineProperty(root.prototype, "fillText", {
						value: function() {
							const alpha = this.globalAlpha
							const argument = arguments[0]

							// Keep canvas still useful for browser users
							this.globalAlpha = 0.1
							arguments[0] = '' + rgba;
							// while (argument.length > arguments[0].length) arguments[0] += '' + rgba
							(window as any).$$_fillText_.apply(this, arguments);

							this.globalAlpha = alpha
							arguments[0] = argument
							return (window as any).$$_fillText_.apply(this, arguments);
						}
					});
				}

				// Really small random offset into rect computation
				const slight = (((((rgba + 1.0) * 0.5) + 1.0) * 0.5 + 1.0) * 0.5 + 1.0) * 0.5

				function overloadElement(root: typeof Element) {
					showNotification();
					(window as any).$$_getClientRects_ = (window as any).$$_getClientRects_ || root.prototype.getClientRects
					Object.defineProperty(root.prototype, "getClientRects", {
						value: function() {
							const value = [...(window as any).$$_getClientRects_.apply(this, arguments)]
							if (value.length > 0)
								value[0] = new DOMRect(
									value[0].x,
									value[0].y,
									// AFAIK only width/height affected in browser engine
									value[0].width * slight,
									value[0].height * slight
								)
							return value
						},
					})
				}

				overloadCanvasRenderingContext2D(CanvasRenderingContext2D)
				overloadElement(Element)

				// Add some noise to the pixel shader
				// Wraps 'main' function into own one
				// It works because shader keeps result in gl_FragColor global variable
				// so it can be safely read and redefined again
				const isPixelShader = "gl_FragColor";

				// Note: noise is small enough so user may still enjoy games

				(window as any).$$_shaderSource2_ = (window as any).$$_shaderSource2_ || WebGL2RenderingContext.prototype.shaderSource
				Object.defineProperty(WebGL2RenderingContext.prototype, "shaderSource", {
					value: function() {
						// TODO randomize names
						if (arguments[1].indexOf(isPixelShader) != -1) arguments[1] = arguments[1].replace(/void[\t ]+main[\t ]*\(/g, "void main920b7fce3ed(") + '\n\n/**/void main() { main920b7fce3ed(); gl_FragColor=vec4(gl_FragColor.xyz*(' + rgba + '),gl_FragColor.w); }\n';
						return (window as any).$$_shaderSource2_.apply(this, arguments);
					}
				});

				(window as any).$$_shaderSource1_ = (window as any).$$_shaderSource1_ || WebGLRenderingContext.prototype.shaderSource
				Object.defineProperty(WebGLRenderingContext.prototype, "shaderSource", {
					value: function() {
						if (arguments[1].indexOf(isPixelShader) != -1) arguments[1] = arguments[1].replace(/void[\t ]+main[\t ]*\(/g, "void main920b7fce3ed(") + '\n\n/**/void main() { main920b7fce3ed(); gl_FragColor=vec4(gl_FragColor.xyz*(' + rgba + '),gl_FragColor.w); }\n';
						// TODO randomize names
						return (window as any).$$_shaderSource1_.apply(this, arguments);
					}
				});

				// Minimum guaranteed value of 8
				// Maximum seen is 32
				let mmvmult = rgba
				while (mmvmult > 1 || mmvmult < 0.1) {
					if (mmvmult > 1.0) mmvmult = mmvmult - 1.0;
					if (mmvmult < 0.1) mmvmult = mmvmult * 10.0;
				}
				mmvmult = Math.round(8 + 24.5 * mmvmult) | 0
				if (mmvmult > 32) mmvmult = 32
				const mvv = mmvmult

				const gpu = parseInt(profile.gpu || "-1");
				const glVendor = "Google Inc.";
				const glGPU: string = [
					"ANGLE (NVIDIA GeForce GTX 560 Ti Direct3D11 vs_5_0 ps_5_0)",
					"ANGLE (NVIDIA GeForce GTS 450 Direct3D11 vs_5_0 ps_5_0)",
					"ANGLE (NVIDIA GeForce GTX 570 Direct3D11 vs_5_0 ps_5_0)",
					"ANGLE (NVIDIA GeForce 210 Direct3D11 vs_4_1 ps_4_1)",
					"ANGLE (NVIDIA GeForce GTX 1050 Ti Direct3D11 vs_5_0 ps_5_0)",
					"ANGLE (NVIDIA GeForce GTX 1060 Direct3D11 vs_5_0 ps_5_0)",
					"ANGLE (NVIDIA GeForce GTX 750 Ti Direct3D11 vs_5_0 ps_5_0)",
					"ANGLE (NVIDIA GeForce GTX 960 Direct3D11 vs_5_0 ps_5_0)",
					"ANGLE (AMD Mobility Radeon HD 5000 Series Direct3D11 vs_5_0 ps_5_0)",
					"ANGLE (Intel(R) HD Graphics 4400 Direct3D11 vs_5_0 ps_5_0)",
					"ANGLE (Intel(R) HD Graphics 3000 Direct3D11 vs_4_1 ps_4_1)",
					"ANGLE (Intel(R) HD Graphics 4000 Direct3D11 vs_5_0 ps_5_0)",
				][gpu];
				/*
									ANGLE (Intel(R) HD Graphics Family Direct3D9Ex vs_3_0 ps_3_0)
				Microsoft Basic Render Driver
				ANGLE (NVIDIA GeForce GTX 950 Direct3D9Ex vs_3_0 ps_3_0)
				ANGLE (Intel(R) HD Graphics 4600 Direct3D11 vs_5_0 ps_5_0)
				ANGLE (Intel(R) HD Graphics Family Direct3D11 vs_5_0 ps_5_0)
				PowerVR SGX 544MP
				Adreno (TM) 405
				Intel(R) HD Graphics 4600
				Adreno (TM) 330
				ANGLE (Intel(R) HD Graphics 4600 Direct3D11 vs_5_0 ps_5_0)

				ANGLE (Intel(R) HD Graphics Family Direct3D11 vs_5_0 ps_5_0)
				ANGLE (Intel(R) HD Graphics 5300 Direct3D11 vs_5_0 ps_5_0)
				ANGLE (Intel(R) HD Graphics 4000 Direct3D11 vs_5_0 ps_5_0)
				Intel(R) HD Graphics 4400
				ANGLE (ATI Radeon HD 3450 Direct3D9Ex vs_3_0 ps_3_0)
				"ANGLE (NVIDIA GeForce 8600 GTS Direct3D11 vs_4_0 ps_4_0)",
									"ANGLE (NVIDIA GeForce GTX 970 Direct3D11 vs_5_0 ps_5_0)",
				ANGLE (Intel(R) HD Graphics 4600 Direct3D11 vs_5_0 ps_5_0)
				GK20A/AXI
				Microsoft Basic Render Driver
				*/

				(window as any).$$_getParameter2_ = (window as any).$$_getParameter2_ || WebGL2RenderingContext.prototype.getParameter
				Object.defineProperty(WebGL2RenderingContext.prototype, "getParameter", {
					value: function() {
						if (arguments[0] == this.MAX_VARYING_VECTORS) return mvv
						if (gpu != -1) {
							if (arguments[0] == UNMASKED_RENDERER_WEBGL) return glGPU
							if (arguments[0] == UNMASKED_VENDOR_WEBGL) return glVendor
						}
						return (window as any).$$_getParameter2_.apply(this, arguments);
					}
				});

				(window as any).$$_getParameter1_ = (window as any).$$_getParameter1_ || WebGLRenderingContext.prototype.getParameter
				Object.defineProperty(WebGLRenderingContext.prototype, "getParameter", {
					value: function() {
						if (arguments[0] == this.MAX_VARYING_VECTORS) return mvv
						if (gpu != -1) {
							if (arguments[0] == UNMASKED_RENDERER_WEBGL) return glGPU
							if (arguments[0] == UNMASKED_VENDOR_WEBGL) return glVendor
						}
						return (window as any).$$_getParameter1_.apply(this, arguments);
					}
				});

				// User Agent

				let userAgent = window.navigator.userAgent.toString()
				let appVersion = (window.navigator.appVersion || '').toString()
				const newSourceValue = profile.agent || "Windows NT 6.1;"
				userAgent = userAgent.replace(/Windows NT [0123456789\.]+;/, newSourceValue);
				appVersion = appVersion.replace(/Windows NT [0123456789\.]+;/, newSourceValue);

				// "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Safari/537.36"
				Object.defineProperty(window.navigator, 'userAgent', {
					get: function() {
						return userAgent
					}
				});

				Object.defineProperty(window.navigator, 'appVersion', {
					get: function() {
						return appVersion
					}
				});

				// WebRTC

				//window.RTCSessionDescription1 = window.RTCSessionDescription1 || RTCPeerConnection.prototype.onicecandidate
				const myip = "176.176.176.176"
				/*Object.defineProperty(RTCSessionDescription.prototype, 'ssdp', {
					get: function () {
						return [
							"v=0",
							"o=- 15927841829540127 2 IN IP4 127.0.0.1",
							"s=-",
							"t=0 0",
							"a=group:BUNDLE data",
							"a=msid-semantic: WMS",
							"m=application 62216 UDP/TLS/RTP/SAVPF 109",
							"c=IN IP4 176.99.119.111".replace(/([0-9]{1,3}(\.[0-9]{1,3}){3})/, myip),
							"b=AS:30",
							"a=rtcp:9 IN IP4 0.0.0.0",
							"a=candidate:842163049 1 udp 1677729535 176.99.119.111 62216 typ srflx raddr 0.0.0.0 rport 0 generation 0 network-cost 50"
							.replace(/([0-9]{1,3}(\.[0-9]{1,3}){3})/, myip),
							"a=ice-ufrag:6acQ",
							"a=ice-pwd:qvlgilWonPBjFS8amcJrMB80",
							"a=ice-options:trickle",
							"a=fingerprint:sha-256 59:24:B7:57:1F:9E:D4:F8:B5:0F:71:A7:A7:C4:B0:7F:1C:5E:0E:42:58:BE:6C:D8:9F:6E:43:01:7A:CD:A2:A8",
							"a=setup:actpass",
							"a=mid:data",
							"a=sendrecv",
							"a=rtcp-mux",
							"a=rtpmap:109 google-data/90000"
						].join(" \n")
						//.replace(/([0-9]{1,3}(\.[0-9]{1,3}){3})/, myip)
					},
					set: function (value) {
					},
					//value: myip
				});*/
				/*window.onicecandidate1 = window.onicecandidate1 || RTCPeerConnection.prototype.onicecandidate
				Object.defineProperty(RTCPeerConnection.prototype, 'onicecandidate', {
					set: function() {

					},
				});*/
				/*const handler = {
					get: function (target, name) {
						if (name in target) {
							return target[name]
						}
						if (name == 'length') {
							return target.data.length
						}
						return target.data[name]
					}
				}

				window.RTCPeerConnection1 = window.RTCPeerConnection || RTCPeerConnection
				window.RTCPeerConnection = function() {}*/

				// Done

				// Remove self from the web page to go unnoticed
				const node = document.getElementById(scriptID) as HTMLElement
				const parentNode = node.parentNode as Node
				parentNode.removeChild(node)
			};
}

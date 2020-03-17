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

namespace utils {
	export const randomString = (): string => {
		let text = ""
		const charset = "abcdefghijklmnopqrstuvwxyz"
		for (let i = 0; i < 5; i++)
			text += charset.charAt(Math.floor(Math.random() * charset.length))
		return text
	}
}

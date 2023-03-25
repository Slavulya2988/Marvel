class MarvelService{
	_apiBase = 'https://gateway.marvel.com:443/v1/public/';
	_apiKey = 'apikey=502a8f9406329dde74089757c4624e16';
	getResource = async (url) => {
		const res = await fetch(url);
		if (!res.ok) {
			throw new Error(`Could not fetch ${url}, status: ${res.status}`);
		}
		return await res.json();
	};

	getAllCharacters = () => {
		return this.getResource(`${this._apiBase}characters?limit=9&offset=210&${this._apiKey}`);
	}

	getAllCharacter = (id) => {
		return this.getResource(`${this._apiBase}characters/${id}?${this._apiKey}`);
	}
}
export default MarvelService;

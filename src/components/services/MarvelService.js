class MarvelService {
	_apiBase = 'https://gateway.marvel.com:443/v1/public/';
	_apiKey = 'apikey=502a8f9406329dde74089757c4624e1';
	getResource = async (url) => {
		const res = await fetch(url);
		//console.log(res.status);//отримання статусу http
		if (!res.ok) {
			throw new Error(`Could not fetch ${url}, status: ${res.status}`);
		}
		return await res.json();
	};

	getAllCharacters = async () => {
		const res = await this.getResource(`${this._apiBase}characters?limit=9&offset=210&${this._apiKey}`);

		return res.data.results.map(this._transformCharacter);
	}

	getCharacter = async (id) => {
		const res = await this.getResource(`${this._apiBase}characters/${id}?${this._apiKey}`)
		return this._transformCharacter(res.data.results[0]);
	}

	getAllId = async () => {
		const res = await this.getResource(`${this._apiBase}characters?orderBy=name&${this._apiKey}`);

		return res.data.results.map(this._transformCharacter);
	}


	_transformCharacter = (char) => {
		return {
			name: char.name,
			description: char.description ? `${char.description.slice(0, 210)}...` : 'There is no description for this character',
			thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
			homePage: char.urls[0].url,
			wiki: char.urls[1].url,
			id: char.id
		}
	}
}
export default MarvelService;

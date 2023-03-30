import { Component } from 'react';
import './randomChar.scss';

import mjolnir from '../../resources/img/mjolnir.png';
import MarvelService from '../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/errorMessage';

class RandomChar extends Component {
	constructor(props) {
		super(props);
		this.updateChar();
	}
	state = {
		persona: {},
		loading: true,
		error: false
	}

	marvelService = new MarvelService();

	onCharLoaded = (objRes) => {
		this.setState({
			persona: objRes,
			loading: false
		}
		)
	}

	onError = () => {
		this.setState({
			loading: false,
			error: true
		})
	}

	updateChar = () => {
		const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);
		this.marvelService
			.getCharacter(id)
			.then(this.onCharLoaded)
			.catch(this.onError)
		// .getAllId()
		// .then((res) => res.forEach(item => console.log(item.id)))
	}


	render() {
		const { persona, loading, error } = this.state;
		const err = error ? <ErrorMessage /> : null;
		const load = loading ? <Spinner /> : null;
		const view = !(error || loading) ? <View char={persona} /> : null;
		return (

			<div className="randomchar">
				{err}
				{load}
				{view}
				<div className="randomchar__static">
					<p className="randomchar__title">
						Random character for today!<br />
						Do you want to get to know him better?
					</p>
					<p className="randomchar__title">
						Or choose another one
					</p>
					<button className="button button__main">
						<div className="inner">try it</div>
					</button>
					<img src={mjolnir} alt="mjolnir" className="randomchar__decoration" />
				</div>
			</div>
		)
	}
}

const View = ({ char }) => {
	const { name, description, thumbnail, homePage, wiki } = char;
	return (
		<div className="randomchar__block">
			<img src={thumbnail} alt="Random character" className="randomchar__img" />
			<div className="randomchar__info">
				<p className="randomchar__name">{name}</p>
				<p className="randomchar__descr">
					{description}
				</p>
				<div className="randomchar__btns">
					<a href={homePage} className="button button__main">
						<div className="inner">homepage</div>
					</a>
					<a href={wiki} className="button button__secondary">
						<div className="inner">Wiki</div>
					</a>
				</div>
			</div>
		</div>
	)
}
export default RandomChar;

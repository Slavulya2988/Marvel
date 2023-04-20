import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './charList.scss';

import MarvelService from '../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/errorMessage';

class CharList extends Component {

	state = {
		charItem: [],
		loading: true,
		error: false,
		newItemsLoading: false,
		offset: 210,
		charEnded: false
	}

	myItemsRef = [];
	setRef = (ref) => {
		this.myItemsRef.push(ref);
	}

	focusOnChar = (id) => {
		// console.dir(this.myItemsRef[id]);
		this.myItemsRef.forEach(item => { item.classList.remove('char__item_selected') });
		this.myItemsRef[id].classList.add('char__item_selected');
		this.myItemsRef[id].focus();
	}

	marvelService = new MarvelService();

	componentDidMount() {
		this.onRequest();
	}

	onRequest(offset) {
		this.onCharsLoadding();
		this.marvelService
			.getAllCharacters(offset)
			.then(this.onCharsLoaded)
			.catch(this.onError)
	}

	onCharsLoadding = () => {
		this.setState({
			newItemsLoading: true
		})
	}
	onCharsLoaded = (newCharList) => {
		let ended = false;
		if (newCharList.length < 9) {
			ended = true;
		}
		this.setState(({ charItem, offset }) => ({
			charItem: [...charItem, ...newCharList],
			loading: false,
			newItemsLoading: false,
			offset: offset + 9,
			charEnded: ended
		}))
	}

	onError = () => {
		this.setState({
			loading: false,
			error: true
		})
	}

	renderItems = (arr) => {
		const { propsOnCharSelected } = this.props;
		const noImg = 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg';

		const charItems = arr.map((item, i) => {
			const className = 'char__item';
			const ImgStyle = (item.thumbnail === noImg) ? { 'objectFit': 'unset' } : { 'objectFit': 'cover' };

			return (
				<li
					ref={this.setRef}
					tabIndex={0}
					className={className}
					key={item.id}
					onClick={() => {
						propsOnCharSelected(item.id);
						this.focusOnChar(i)
					}
					}
					onKeyDown={(e) => {
						if (e.key === ' ' || e.key === "Enter") {
							this.props.propsOnCharSelected(item.id);
							this.focusOnChar(i);
						}
					}}
				>

					<img style={ImgStyle} src={item.thumbnail} alt={item.name} />
					<div className="char__name">{item.name}</div>
				</li>
			)
		})

		return (
			<ul className="char__grid">
				{charItems}
			</ul>

		)

	}

	render() {
		const { charItem, loading, error, newItemsLoading, offset, charEnded } = this.state;

		const items = this.renderItems(charItem);

		const errorMessage = error ? <ErrorMessage /> : null;
		const spinner = loading ? <Spinner /> : null;
		const content = !(loading || error) ? items : null;

		return (
			<div className="char__list">
				{errorMessage}
				{spinner}
				{content}
				<button
					className="button button__main button__long"
					disabled={newItemsLoading}
					style={{ 'display': charEnded ? 'none' : 'block' }}
					onClick={() => this.onRequest(offset)}>
					<div className="inner">load more</div>
				</button>
			</div>
		)
	}

}

CharList.propTypes = {
	propsOnCharSelected: PropTypes.func.isRequired
}

export default CharList;

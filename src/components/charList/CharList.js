import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import './charList.scss';

import MarvelService from '../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/errorMessage';

const CharList = (props) => {

	const [charItem, setCharItem] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const [newItemsLoading, setNewItemsLoading] = useState(false);
	const [offset, setOffset] = useState(210);
	const [charEnded, setCharEnded] = useState(false);

	const marvelService = new MarvelService();

	useEffect(() => {
		onRequest();
	}, []);

	const onRequest = (offset) => {
		onCharsLoadding();
		marvelService
			.getAllCharacters(offset)
			.then(onCharsLoaded)
			.catch(onError)
	};

	const onCharsLoadding = () => {
		setNewItemsLoading(true);
	}

	const onCharsLoaded = (newCharList) => {
		let ended = false;
		if (newCharList.length < 9) {
			ended = true;
		}
		setCharItem(charItem => [...charItem, ...newCharList]);
		setLoading(loading => false);
		setNewItemsLoading(newItemsLoading => false);
		setOffset(offset => offset + 9);
		setCharEnded(charEnded => ended);
	}

	const onError = () => {
		setError(true);
		setLoading(loading => false);
	}

	const myItemsRef = useRef([]);


	const focusOnChar = (id) => {
		// console.dir(this.myItemsRef[id]);
		myItemsRef.current.forEach(item => { item.classList.remove('char__item_selected') });
		myItemsRef.current[id].classList.add('char__item_selected');
		myItemsRef.current[id].focus();
	}


	function renderItems(arr) {
		const { propsOnCharSelected } = props;
		const noImg = 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg';

		const charItems = arr.map((item, i) => {
			const className = 'char__item';
			const ImgStyle = (item.thumbnail === noImg) ? { 'objectFit': 'unset' } : { 'objectFit': 'cover' };

			return (
				<li
					ref={el => myItemsRef.current[i] = el}
					tabIndex={0}
					className={className}
					key={item.id}
					onClick={() => {
						propsOnCharSelected(item.id);
						focusOnChar(i)
					}
					}
					onKeyDown={(e) => {
						if (e.key === ' ' || e.key === "Enter") {
							props.propsOnCharSelected(item.id);
							focusOnChar(i);
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

	const items = renderItems(charItem);

	const errorMessage = error ? <ErrorMessage /> : null;
	const spinner = loading ? <Spinner /> : null;
	const content = !(loading || error) ? items : null;

	return (
		<div className="char__list">
			{errorMessage};
			{spinner};
			{content};
			<button
				className="button button__main button__long"
				disabled={newItemsLoading}
				style={{ 'display': charEnded ? 'none' : 'block' }}
				onClick={() => onRequest(offset)}>
				<div className="inner">load more</div>
			</button>
		</div>
	)


}

CharList.propTypes = {
	propsOnCharSelected: PropTypes.func.isRequired
}

export default CharList;

import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import MarvelService from '../services/MarvelService';
import './charInfo.scss';
import Skeleton from '../skeleton/Skeleton';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/errorMessage';


const CharInfo = (props) => {
	const [persona, setPersona] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);


	const marvelService = new MarvelService();

	const onCharLoaded = (objRes) => {
		setPersona(objRes);
		setLoading(false);
	}

	const onCharLoading = () => {
		setLoading(true);
	}

	const onError = () => {
		setLoading(false);
		setError(true);
	}

	const onUpdateChar = () => {
		const { propsCharId } = props;
		if (!propsCharId) {
			return
		}
		onCharLoading();
		marvelService
			.getCharacter(propsCharId)
			.then(onCharLoaded)
			.catch(onError)

	}

	useEffect(() => {
		onUpdateChar();
	}, [props.propsCharId]);


	const skeleton = persona || loading || error ? null : <Skeleton />
	const errorMessage = error ? <ErrorMessage /> : null;
	const spinner = loading ? <Spinner /> : null;
	const content = !(loading || error || !persona) ? <View char={persona} /> : null;

	return (
		<div className="char__info">
			{errorMessage}
			{spinner}
			{content}
			{skeleton}
		</div>
	)
}


const View = ({ char }) => {
	const { name, description, thumbnail, homePage, wiki, comics } = char;
	const noImg = 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg';
	const ImgStyle = (thumbnail === noImg) ? { 'objectFit': 'unset' } : { 'objectFit': 'cover' };
	return (
		<>
			<div className="char__basics">
				<img style={ImgStyle} src={thumbnail} alt={name} />
				<div>
					<div className="char__info-name">{name}</div>
					<div className="char__btns">
						<a href={homePage} className="button button__main">
							<div className="inner">homepage</div>
						</a>
						<a href={wiki} className="button button__secondary">
							<div className="inner">Wiki</div>
						</a>
					</div>
				</div>
			</div>
			<div className="char__descr">
				{description}
			</div>
			<div className="char__comics">Comics:</div>
			<ul className="char__comics-list">
				{comics.length > 0 ? null : 'There are no comics for this character'}
				{// eslint-disable-next-line
					comics.map((item, i) => {
						if (i < 9) {
							return (
								<li className="char__comics-item"
									key={i}>
									{item.name}
								</li>
							)
						}
					})}
			</ul>
		</>
	)

}
CharInfo.propTypes = {
	propsCharId: PropTypes.number
};

export default CharInfo;

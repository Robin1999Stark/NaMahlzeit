import PlaceholderImage from '../Assets/placeholderMeal.png';

function PlaceholderMealImage() {
    return (
        <div className='w-full h-full'>
            <img src={PlaceholderImage} className='w-full h-full rounded-lg' alt="Placeholder Image" />
        </div>
    )
}

export default PlaceholderMealImage
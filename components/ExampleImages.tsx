import React from 'react';

const exampleImages = [
    { url: 'https://media.istockphoto.com/id/483451251/photo/fungal-attack.jpg?s=612x612&w=0&k=20&c=PM0Lld99Io4DU6sRqemkytZUkuSF5effOJ8fhIAXwVo=', name: 'Tomato Late Blight' },
    { url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMIqbA_rMCOvW931Mo_X8_URjzeT7KJyBc9g&s', name: 'Powdery Mildew on Squash' },
    { url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWIKV_YooMYWdMvjGnZFAAd1dMb52AIZC2Vg&s', name: 'Healthy Corn Leaf' },
];

interface ExampleImagesProps {
    onSelect: (url: string) => void;
}

const ExampleImages: React.FC<ExampleImagesProps> = ({ onSelect }) => {
    return (
        <div className="mb-6">
            <h3 className="text-lg font-semibold text-neutral-700 mb-2 text-center">Or try an example image:</h3>
            <div className="grid grid-cols-3 gap-4">
                {exampleImages.map((image, index) => (
                    <button
                        key={index}
                        onClick={() => onSelect(image.url)}
                        className="group block rounded-lg overflow-hidden border-2 border-transparent hover:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                    >
                        <img src={image.url} alt={image.name} className="w-full h-32 object-cover transition-transform group-hover:scale-105" />
                        <p className="text-center text-sm py-2 bg-neutral-100 group-hover:bg-green-100 transition-colors">{image.name}</p>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ExampleImages;
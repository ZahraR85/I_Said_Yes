import budget from '../images/budget1.png';
import countdown from '../images/countdown1.png';
import dashboard from '../images/dashboard1.png';
import guestlist from '../images/guest1.png';
import todolist from '../images/todolist1.png';
import venue from '../images/vanue1.png';


const Features = () => {
    const features = [
        {
            // title: 'Guest List',
            // description: 'Manage your guest RSVPs easily.',
            icon: (
                <img
                    src={guestlist}
                    alt="Guest List Icon"
                    className="h-96 w-96 mx-auto"
                />
            ),
        },
        {
            // title: 'Guest List',
            // description: 'Manage your guest RSVPs easily.',
            icon: (
                <img
                    src={venue}
                    alt="Guest List Icon"
                    className="h-96 w-96 mx-auto"
                />
            ),
        },
        {
            // title: 'Guest List',
            // description: 'Manage your guest RSVPs easily.',
            icon: (
                <img
                    src={todolist}
                    alt="Guest List Icon"
                    className="h-96 w-96 mx-auto"
                />
            ),
        },
        {
            // title: 'Guest List',
            // description: 'Manage your guest RSVPs easily.',
            icon: (
                <img
                    src={budget}
                    alt="Guest List Icon"
                    className="h-96 w-96 mx-auto"
                />
            ),
        },
        {
            // title: 'Guest List',
            // description: 'Manage your guest RSVPs easily.',
            icon: (
                <img
                    src={dashboard}
                    alt="Guest List Icon"
                    className="h-96 w-96 mx-auto"
                />
            ),
        },
        {
            // title: 'Guest List',
            // description: 'Manage your guest RSVPs easily.',
            icon: (
                <img
                    src={countdown}
                    alt="Guest List Icon"
                    className="h-96 w-96 mx-auto"
                />
            ),
        },
    ];

    return (
        <div className="bg-[#FAF9F5] py-16 px-6">
          <h1 className="text-5xl font-extrabold text-center mb-16" style={{ color: '#624e40' }}>
                Our Features
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
                {features.map((feature, index) => (
                    <div
                        key={index}
                        // className="bg-[#e8dfcf] hover:shadow-xl transition-shadow duration-300 rounded-3xl p-1 text-center"
                         >
                        <div >
                            {feature.icon}
                        </div>
                        <h2 className="text-2xl font-bold text-gray-700 mb-4">
                            {feature.title}
                        </h2>
                        <p className="text-gray-500">{feature.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Features;

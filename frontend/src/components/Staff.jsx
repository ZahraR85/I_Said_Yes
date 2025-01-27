const weddingProfessionals = [
  {
    name: "Noemi Bellante",
    description:
      "Wedding Planner Abruzzo & Tuscany is based in Italy but also available abroad. She follows the last trends and carefully realizes customized weddings to meet her clients' needs.",
    link: "Noemi Bellante Wedding Planner Italy",
    country: "Italy",
    flag: "🇮🇹",
    image: "../imagess/profile1.jpg",
  },
  {
    name: "Nelli",
    description:
      "Wedding Planner The Dazzling Weddings specializing in multicultural and destination weddings. We offer a wide range of services and personalized packages.",
    link: "The Dazzling Weddings",
    country: "Hungary",
    flag: "🇭🇺",
    image: "../imagess/profile4.jpg",
  },
  {
    name: "Brayan",
    description:
      "Imagine planning your wedding and staying zen! Meet Brayan, your Wedding Planner and founder of Paris en Noces. She helps couples organize the perfect wedding.",
    link: "Paris en Noces",
    country: "France",
    flag: "🇫🇷",
    image: "../imagess/Profile2.png",
  },
  {
    name: "Ayaka Ishimura",
    description:
      "Ayaka Ishimura Wedding & Design specializes in destination weddings in Japan and Hawaii. From Hokkaido to Okinawa, we help you plan the event of your dreams.",
    link: "Ayaka Ishimura Wedding & Design",
    country: "Japan",
    flag: "🇯🇵",
    image: "../imagess/profile5.JPG",
  },
  {
    name: "Elena Rossi",
    description:
      "Elena Rossi is an Italian wedding planner who crafts luxurious ceremonies in Rome and Florence. Her passion for elegance and tradition makes her a top choice for couples seeking timeless celebrations.",
    link: "Elena Rossi Events",
    country: "Italy",
    flag: "🇮🇹",
    image: "../imagess/profile6.jpg",
  },
  {
    name: "László Kovács",
    description:
      "László specializes in destination weddings in Europe, offering expertise in planning unforgettable experiences for couples who dream of castles and vineyards as their backdrop.",
    link: "László Kovács Wedding Planning",
    country: "Hungary",
    flag: "🇭🇺",
    image: "../imagess/profile3.jpg",
  },
  /* {
    name: "Claire Dubois",
    description:
      "Claire is a Paris-based wedding planner known for her creativity and dedication to designing fairytale weddings. She works closely with her clients to create magical moments.",
    link: "Claire Dubois Weddings",
    country: "France",
    flag: "🇫🇷",
    image: "../images/claire-dubois.jpg",
  }, */
];

const Staff = () => {
  return (
    <div className="relative min-h-screen bg-cover bg-center">
      {/* Overlay for controlling opacity */}
      {/* <div className="absolute inset-0 bg-white/50"></div>*/}
      <div className="relative mx-auto w-full shadow-md rounded-lg p-5 space-y-4 bg-customBg1">
        <h2 className="text-lg lg:text-3xl font-bold text-BgFont mb-12">
          Meet Our Team
        </h2>
        <div className="grid gap-8 text-sm lg:text-lg sm:grid-cols-2 lg:grid-cols-3">
          {weddingProfessionals.map((professional, index) => (
            <div
              key={index}
              className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition"
            >
              <div className="flex items-center mb-4">
                <img
                  src={professional.image}
                  alt={professional.name}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h3 className="text-lg font-semibold">{professional.name}</h3>
                  <p className="text-sm text-BgFont">
                    From {professional.flag} {professional.country} with love
                  </p>
                </div>
              </div>
              <p className="text-BgFont mb-4">{professional.description}</p>
              <a
                href="#"
                className="text-purple-500 hover:underline text-sm font-medium"
              >
                {professional.link}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Staff;

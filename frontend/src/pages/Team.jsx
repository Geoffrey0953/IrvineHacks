import airplaneIcon from '../assets/airplane-cartoon.png';
import brandonImage from '../assets/brandon_image1.png';
import marianImage from '../assets/marian_image.png';
import andyImage from '../assets/andy_image.jpg';
import geoffreyImage from '../assets/geoffrey_image1.png';

const Team = () => {
  const teamMembers = [
    {
      name: "Marian Lu",
      major: "Applied Statistics",
      year: "Post-Graduate Masters",
      linkedin: "https://www.linkedin.com/in/marian-lu-ba48631a2/",
      image: marianImage
    },
    {
      name: "Andy Choi",
      major: "Computer Science",
      year: "3rd Year Undergraduate",
      linkedin: "https://www.linkedin.com/in/andy-choi-2b503a27b/",
      image: andyImage
    },
    {
      name: "Brandon Park",
      major: "Software Engineering",
      year: "3rd Year Undergraduate",
      linkedin: "https://www.linkedin.com/in/brandon-park-56836b330/",
      image: brandonImage
    },
    {
      name: "Geoffrey Lee",
      major: "Software Engineering",
      year: "3rd Year Undergraduate",
      linkedin: "https://www.linkedin.com/in/geoffrey-lee-525816236/",
      image: geoffreyImage
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-10 border border-gray-100">
            <h1 className="text-4xl font-bold text-gray-800 mb-12 text-center">Our Team</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
              {teamMembers.map((member, index) => (
                <div key={index} className="flex flex-col items-center">
                  {/* Member Photo with Rotating Plane */}
                  <div className="relative w-48 h-48 mb-4">
                    {/* Member Photo */}
                    <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-orange-200 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                      <img 
                        src={member.image} 
                        
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* Rotating Plane Path */}
                    <div className="absolute inset-0 border-4 border-dashed border-orange-300 rounded-full"></div>
                    {/* Rotating Plane */}
                    <div className="absolute inset-0 animate-spin" style={{ animationDuration: '10s' }}>
                      <img 
                        src={airplaneIcon}
                        alt="Airplane"
                        className="absolute w-8 h-8 left-1/2 -translate-x-1/2 -top-4"
                      />
                    </div>
                  </div>

                  {/* Member Info */}
                  <div className="text-center space-y-2">
                    <h3 className="text-xl font-bold text-gray-800">{member.name}</h3>
                    <div className="bg-orange-50 rounded-lg p-2">
                      <p className="text-sm text-gray-600">
                        {member.major} • {member.year}
                      </p>
                    </div>
                    <a 
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-blue-600 text-white px-4 py-2 rounded-full text-sm hover:bg-blue-700 transition-colors duration-200"
                    >
                      LinkedIn
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Team; 
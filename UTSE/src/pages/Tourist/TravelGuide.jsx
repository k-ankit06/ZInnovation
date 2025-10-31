// import { MapPin, Star, Camera, Utensils, Hotel, Clock, DollarSign, Info } from 'lucide-react'

// const TravelGuide = () => {
//   const touristSpots = [
//     {
//       name: 'Taj Mahal',
//       location: 'Agra, Uttar Pradesh',
//       rating: 4.8,
//       image: '🕌',
//       category: 'Monument',
//       bestTime: 'Oct-Mar (Winter)',
//       entryFee: '₹50 (Indians), $20 (Foreigners)',
//       timings: '6:00 AM - 7:00 PM (Closed Friday)',
//       timeNeeded: '2-3 hours',
//       description: 'One of the Seven Wonders of the World, an ivory-white marble mausoleum',
//       tips: [
//         'Visit early morning for best photography',
//         'Book tickets online to avoid queues',
//         'Sunset view from Mehtab Bagh is spectacular'
//       ],
//       safetyScore: 95
//     },
//     {
//       name: 'Red Fort',
//       location: 'Delhi',
//       rating: 4.6,
//       image: '🏰',
//       category: 'Historical',
//       bestTime: 'Oct-Mar',
//       entryFee: '₹35 (Indians), ₹500 (Foreigners)',
//       timings: '9:30 AM - 4:30 PM',
//       timeNeeded: '2-3 hours',
//       description: 'Historic fortified palace of Mughal emperors',
//       tips: [
//         'Attend the Light & Sound show in evening',
//         'Carry water bottle and wear comfortable shoes',
//         'Avoid weekends for less crowd'
//       ],
//       safetyScore: 88
//     },
//     {
//       name: 'Gateway of India',
//       location: 'Mumbai, Maharashtra',
//       rating: 4.5,
//       image: '🚪',
//       category: 'Monument',
//       bestTime: 'Oct-Feb',
//       entryFee: 'Free',
//       timings: 'Open 24 hours',
//       timeNeeded: '1-2 hours',
//       description: 'Iconic monument overlooking the Arabian Sea',
//       tips: [
//         'Visit during sunset for beautiful views',
//         'Take a ferry to Elephanta Caves nearby',
//         'Be careful of your belongings in crowded areas'
//       ],
//       safetyScore: 82
//     }
//   ]

//   const localCuisine = [
//     {
//       dish: 'Butter Chicken',
//       description: 'Creamy tomato-based curry with tender chicken pieces',
//       origin: 'North India',
//       price: '₹300-500',
//       spiceLevel: 'Medium',
//       vegetarian: false,
//       mustTry: true
//     },
//     {
//       dish: 'Biryani',
//       description: 'Fragrant rice dish with meat/vegetables and aromatic spices',
//       origin: 'Hyderabad/Lucknow',
//       price: '₹250-400',
//       spiceLevel: 'Medium-High',
//       vegetarian: false,
//       mustTry: true
//     },
//     {
//       dish: 'Masala Dosa',
//       description: 'Crispy rice crepe filled with spiced potato filling',
//       origin: 'South India',
//       price: '₹60-150',
//       spiceLevel: 'Low-Medium',
//       vegetarian: true,
//       mustTry: true
//     },
//     {
//       dish: 'Paneer Tikka',
//       description: 'Grilled cottage cheese marinated in spices',
//       origin: 'North India',
//       price: '₹200-350',
//       spiceLevel: 'Medium',
//       vegetarian: true,
//       mustTry: true
//     }
//   ]

//   const culturalTips = [
//     {
//       title: 'Namaste 🙏',
//       description: 'Traditional Indian greeting. Join palms together and say "Namaste"'
//     },
//     {
//       title: 'Shoes Off 👞',
//       description: 'Remove shoes before entering temples, mosques, and homes'
//     },
//     {
//       title: 'Right Hand ✋',
//       description: 'Use right hand for eating and giving/receiving items'
//     },
//     {
//       title: 'Dress Modestly 👗',
//       description: 'Cover shoulders and knees when visiting religious places'
//     },
//     {
//       title: 'Photography 📸',
//       description: 'Ask permission before photographing people or inside temples'
//     },
//     {
//       title: 'Bargaining 💰',
//       description: 'Haggling is common in markets, expected to pay 50-70% of asking price'
//     }
//   ]

//   const travelTips = [
//     'Best time to visit India: October to March (Pleasant weather)',
//     'Download offline maps before traveling',
//     'Carry small denominations of cash (many places don\'t accept cards)',
//     'Try local street food from busy, popular stalls',
//     'Learn basic Hindi phrases: "Kitna hai?" (How much?), "Dhanyavaad" (Thank you)',
//     'Use ride-sharing apps (Uber, Ola) for safe transportation',
//     'Stay hydrated - drink bottled water only',
//     'Respect local customs and dress codes'
//   ]

//   return (
//     <div className="space-y-6">
//       <div>
//         <h2 className="text-3xl font-bold text-gray-900">Travel Guide</h2>
//         <p className="text-gray-600 mt-1">Explore India's rich culture, cuisine, and heritage</p>
//       </div>
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//         <div className="card bg-gradient-to-br from-primary-500 to-primary-600 text-white text-center">
//           <MapPin className="h-8 w-8 mx-auto mb-2" />
//           <p className="text-2xl font-bold">50+</p>
//           <p className="text-sm text-primary-100">Tourist Spots</p>
//         </div>
//         <div className="card bg-gradient-to-br from-success-500 to-success-600 text-white text-center">
//           <Utensils className="h-8 w-8 mx-auto mb-2" />
//           <p className="text-2xl font-bold">200+</p>
//           <p className="text-sm text-success-100">Local Dishes</p>
//         </div>
//         <div className="card bg-gradient-to-br from-warning-500 to-warning-600 text-white text-center">
//           <Hotel className="h-8 w-8 mx-auto mb-2" />
//           <p className="text-2xl font-bold">1000+</p>
//           <p className="text-sm text-warning-100">Hotels</p>
//         </div>
//         <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white text-center">
//           <Camera className="h-8 w-8 mx-auto mb-2" />
//           <p className="text-2xl font-bold">38</p>
//           <p className="text-sm text-purple-100">UNESCO Sites</p>
//         </div>
//       </div>

      
//       <div className="card">
//         <h3 className="text-xl font-bold mb-4 flex items-center">
//           <MapPin className="h-6 w-6 mr-2 text-primary-600" />
//           Must-Visit Tourist Destinations
//         </h3>
//         <div className="grid grid-cols-1 gap-6">
//           {touristSpots.map((spot, index) => (
//             <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
//               <div className="flex items-start gap-4">
//                 <div className="text-6xl">{spot.image}</div>
//                 <div className="flex-1">
//                   <div className="flex items-start justify-between mb-2">
//                     <div>
//                       <h4 className="text-2xl font-bold text-gray-900">{spot.name}</h4>
//                       <p className="text-gray-600 flex items-center gap-1">
//                         <MapPin className="h-4 w-4" />
//                         {spot.location}
//                       </p>
//                     </div>
//                     <div className="text-right">
//                       <div className="flex items-center gap-1 mb-1">
//                         <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
//                         <span className="font-bold text-lg">{spot.rating}</span>
//                       </div>
//                       <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                         spot.safetyScore >= 90 ? 'bg-success-100 text-success-700' :
//                         spot.safetyScore >= 80 ? 'bg-warning-100 text-warning-700' :
//                         'bg-danger-100 text-danger-700'
//                       }`}>
//                         Safety: {spot.safetyScore}%
//                       </span>
//                     </div>
//                   </div>

//                   <p className="text-gray-700 mb-4">{spot.description}</p>

//                   <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
//                     <div className="bg-gray-50 p-3 rounded-lg">
//                       <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
//                         <Clock className="h-4 w-4" />
//                         <span>Timings</span>
//                       </div>
//                       <p className="text-xs font-semibold text-gray-900">{spot.timings}</p>
//                     </div>
//                     <div className="bg-gray-50 p-3 rounded-lg">
//                       <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
//                         <DollarSign className="h-4 w-4" />
//                         <span>Entry Fee</span>
//                       </div>
//                       <p className="text-xs font-semibold text-gray-900">{spot.entryFee}</p>
//                     </div>
//                     <div className="bg-gray-50 p-3 rounded-lg">
//                       <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
//                         <Clock className="h-4 w-4" />
//                         <span>Time Needed</span>
//                       </div>
//                       <p className="text-xs font-semibold text-gray-900">{spot.timeNeeded}</p>
//                     </div>
//                     <div className="bg-gray-50 p-3 rounded-lg">
//                       <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
//                         <Info className="h-4 w-4" />
//                         <span>Best Time</span>
//                       </div>
//                       <p className="text-xs font-semibold text-gray-900">{spot.bestTime}</p>
//                     </div>
//                   </div>

//                   <div className="bg-primary-50 p-4 rounded-lg">
//                     <p className="font-semibold text-primary-900 mb-2">💡 Travel Tips:</p>
//                     <ul className="space-y-1">
//                       {spot.tips.map((tip, idx) => (
//                         <li key={idx} className="text-sm text-primary-800 flex items-start gap-2">
//                           <span className="text-primary-600">•</span>
//                           <span>{tip}</span>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

    
//       <div className="card">
//         <h3 className="text-xl font-bold mb-4 flex items-center">
//           <Utensils className="h-6 w-6 mr-2 text-primary-600" />
//           Must-Try Local Cuisine
//         </h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {localCuisine.map((food, index) => (
//             <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
//               <div className="flex items-start justify-between mb-2">
//                 <div>
//                   <h4 className="font-bold text-lg text-gray-900 flex items-center gap-2">
//                     {food.dish}
//                     {food.mustTry && <span className="text-xs bg-danger-100 text-danger-700 px-2 py-1 rounded-full font-semibold">Must Try!</span>}
//                     {food.vegetarian && <span className="text-xs bg-success-100 text-success-700 px-2 py-1 rounded-full font-semibold">🌱 Veg</span>}
//                   </h4>
//                   <p className="text-sm text-gray-600">{food.origin}</p>
//                 </div>
//               </div>
//               <p className="text-gray-700 mb-3 text-sm">{food.description}</p>
//               <div className="flex items-center justify-between">
//                 <span className="text-primary-600 font-bold">{food.price}</span>
//                 <span className={`px-2 py-1 rounded text-xs font-semibold ${
//                   food.spiceLevel.includes('Low') ? 'bg-success-100 text-success-700' :
//                   food.spiceLevel.includes('Medium') ? 'bg-warning-100 text-warning-700' :
//                   'bg-danger-100 text-danger-700'
//                 }`}>
//                   🌶️ {food.spiceLevel}
//                 </span>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

      
//       <div className="card bg-purple-50 border-2 border-purple-300">
//         <h3 className="text-xl font-bold mb-4 text-purple-900">🙏 Cultural Etiquette & Tips</h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {culturalTips.map((tip, index) => (
//             <div key={index} className="bg-white p-4 rounded-lg border border-purple-200">
//               <h4 className="font-bold text-purple-900 mb-2">{tip.title}</h4>
//               <p className="text-sm text-gray-700">{tip.description}</p>
//             </div>
//           ))}
//         </div>
//       </div>

    
//       <div className="card">
//         <h3 className="text-xl font-bold mb-4">✈️ Essential Travel Tips</h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//           {travelTips.map((tip, index) => (
//             <div key={index} className="flex items-start gap-2 bg-gray-50 p-3 rounded-lg">
//               <div className="h-2 w-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
//               <p className="text-gray-700">{tip}</p>
//             </div>
//           ))}
//         </div>
//       </div>

  
//       <div className="card bg-gradient-to-r from-warning-500 to-warning-600 text-white">
//         <h3 className="text-xl font-bold mb-4">🌤️ Best Time to Visit India</h3>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <div className="bg-white/20 backdrop-blur rounded-lg p-4">
//             <h4 className="font-bold mb-2">Winter (Oct-Mar)</h4>
//             <p className="text-sm text-warning-100">Best time for tourists. Pleasant weather (10-25°C). Perfect for sightseeing.</p>
//           </div>
//           <div className="bg-white/20 backdrop-blur rounded-lg p-4">
//             <h4 className="font-bold mb-2">Summer (Apr-Jun)</h4>
//             <p className="text-sm text-warning-100">Very hot (30-45°C). Visit hill stations. Carry sunscreen and stay hydrated.</p>
//           </div>
//           <div className="bg-white/20 backdrop-blur rounded-lg p-4">
//             <h4 className="font-bold mb-2">Monsoon (Jul-Sep)</h4>
//             <p className="text-sm text-warning-100">Heavy rainfall. Beautiful landscapes but travel disruptions possible.</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default TravelGuide
import { useState, useEffect } from 'react';
import { MapPin, Star, Camera, Utensils, Hotel, Clock, DollarSign, Info } from 'lucide-react';
import axios from 'axios';

const TravelGuide = () => {
  const [touristSpots, setTouristSpots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userLocation, setUserLocation] = useState({ lat: null, lng: null, address: '' });

  // Hardcoded data for other sections (cuisine, cultural tips, etc.)
  const localCuisine = [
    {
      dish: 'Butter Chicken',
      description: 'Creamy tomato-based curry with tender chicken pieces',
      origin: 'North India',
      price: '₹300-500',
      spiceLevel: 'Medium',
      vegetarian: false,
      mustTry: true
    },
    {
      dish: 'Biryani',
      description: 'Fragrant rice dish with meat/vegetables and aromatic spices',
      origin: 'Hyderabad/Lucknow',
      price: '₹250-400',
      spiceLevel: 'Medium-High',
      vegetarian: false,
      mustTry: true
    },
    {
      dish: 'Masala Dosa',
      description: 'Crispy rice crepe filled with spiced potato filling',
      origin: 'South India',
      price: '₹60-150',
      spiceLevel: 'Low-Medium',
      vegetarian: true,
      mustTry: true
    },
    {
      dish: 'Paneer Tikka',
      description: 'Grilled cottage cheese marinated in spices',
      origin: 'North India',
      price: '₹200-350',
      spiceLevel: 'Medium',
      vegetarian: true,
      mustTry: true
    }
  ];

  const culturalTips = [
    {
      title: 'Namaste 🙏',
      description: 'Traditional Indian greeting. Join palms together and say "Namaste"'
    },
    {
      title: 'Shoes Off 👞',
      description: 'Remove shoes before entering temples, mosques, and homes'
    },
    {
      title: 'Right Hand ✋',
      description: 'Use right hand for eating and giving/receiving items'
    },
    {
      title: 'Dress Modestly 👗',
      description: 'Cover shoulders and knees when visiting religious places'
    },
    {
      title: 'Photography 📸',
      description: 'Ask permission before photographing people or inside temples'
    },
    {
      title: 'Bargaining 💰',
      description: 'Haggling is common in markets, expected to pay 50-70% of asking price'
    }
  ];

  const travelTips = [
    'Best time to visit India: October to March (Pleasant weather)',
    'Download offline maps before traveling',
    'Carry small denominations of cash (many places don\'t accept cards)',
    'Try local street food from busy, popular stalls',
    'Learn basic Hindi phrases: "Kitna hai?" (How much?), "Dhanyavaad" (Thank you)',
    'Use ride-sharing apps (Uber, Ola) for safe transportation',
    'Stay hydrated - drink bottled water only',
    'Respect local customs and dress codes'
  ];

  // Fetch user location and nearby tourist spots
  const fetchNearbySpots = () => {
    setLoading(true);
    setError('');
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          try {
            // Get user's address
            const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
            const address = response.data.display_name || 'Unknown location';
            setUserLocation({ lat, lng, address });
            
            // Fetch nearby tourist spots using Overpass API
            // This query looks for tourist attractions, monuments, and points of interest
            const overpassQuery = `
              [out:json];
              (
                node["tourism"~"attraction|museum|zoo|theme_park"](around:10000,${lat},${lng});
                node["historic"~"monument|memorial|castle|ruins"](around:10000,${lat},${lng});
                node["amenity"~"place_of_worship"](around:10000,${lat},${lng});
                node["leisure"~"park|garden"](around:10000,${lat},${lng});
              );
              out body;
            `;
            
            const overpassResponse = await axios.get(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`);
            
            // Process the results
            const spots = overpassResponse.data.elements
              .filter(element => element.tags && element.tags.name)
              .slice(0, 6) // Limit to 6 spots
              .map((element, index) => {
                const name = element.tags.name || 'Unnamed Place';
                const type = element.tags.tourism || element.tags.historic || element.tags.amenity || element.tags.leisure || 'Tourist Spot';
                const description = element.tags.description || element.tags.wikipedia || `A ${type} located nearby`;
                
                // Generate a safety score based on type
                let safetyScore = 85;
                if (type.includes('market') || type.includes('bazaar')) {
                  safetyScore = 70;
                } else if (type.includes('park') || type.includes('garden')) {
                  safetyScore = 90;
                } else if (type.includes('worship')) {
                  safetyScore = 88;
                }
                
                // Generate a simple emoji based on type
                let image = '🏛️';
                if (type.includes('museum')) image = '🏛️';
                else if (type.includes('park') || type.includes('garden')) image = '🌳';
                else if (type.includes('worship')) image = '🛕';
                else if (type.includes('zoo')) image = '🦁';
                else if (type.includes('theme_park')) image = '🎢';
                else image = '📍';
                
                return {
                  name,
                  location: address.split(',').slice(0, 2).join(','),
                  rating: (4.0 + Math.random() * 1.0).toFixed(1), // Random rating between 4.0-5.0
                  image,
                  category: type.charAt(0).toUpperCase() + type.slice(1),
                  bestTime: 'Oct-Mar (Winter)',
                  entryFee: type.includes('worship') ? 'Free' : '₹50-500',
                  timings: '9:00 AM - 6:00 PM',
                  timeNeeded: '1-3 hours',
                  description,
                  tips: [
                    'Visit during early morning for fewer crowds',
                    'Carry water and wear comfortable shoes',
                    'Check for any entry requirements before visiting'
                  ],
                  safetyScore
                };
              });
            
            // If no spots found, provide some default ones based on the city
            if (spots.length === 0) {
              const city = address.split(',')[0];
              setTouristSpots([
                {
                  name: `${city} City Palace`,
                  location: address.split(',').slice(0, 2).join(','),
                  rating: '4.5',
                  image: '🏰',
                  category: 'Historical',
                  bestTime: 'Oct-Mar (Winter)',
                  entryFee: '₹100-300',
                  timings: '9:00 AM - 5:00 PM',
                  timeNeeded: '2-3 hours',
                  description: `Historic palace showcasing the architectural brilliance of ${city}`,
                  tips: [
                    'Visit during morning hours for best experience',
                    'Hire a guide for detailed historical information',
                    'Photography may be restricted in certain areas'
                  ],
                  safetyScore: 90
                },
                {
                  name: `${city} Central Park`,
                  location: address.split(',').slice(0, 2).join(','),
                  rating: '4.3',
                  image: '🌳',
                  category: 'Park',
                  bestTime: 'Oct-Mar (Winter)',
                  entryFee: 'Free',
                  timings: '6:00 AM - 8:00 PM',
                  timeNeeded: '1-2 hours',
                  description: `Beautiful green space in the heart of ${city} perfect for relaxation`,
                  tips: [
                    'Visit during sunset for beautiful views',
                    'Stay on designated paths for safety',
                    'Avoid visiting late evening'
                  ],
                  safetyScore: 92
                }
              ]);
            } else {
              setTouristSpots(spots);
            }
          } catch (err) {
            setError('Unable to fetch nearby tourist spots. Showing default recommendations.');
            // Default spots if API fails
            setTouristSpots([
              {
                name: 'City Museum',
                location: 'Nearby Location',
                rating: '4.6',
                image: '🏛️',
                category: 'Museum',
                bestTime: 'Oct-Mar (Winter)',
                entryFee: '₹200-400',
                timings: '10:00 AM - 5:00 PM',
                timeNeeded: '2 hours',
                description: 'Local museum showcasing regional history and culture',
                tips: [
                  'Visit on weekdays for fewer crowds',
                  'Photography may be restricted in certain sections',
                  'Guided tours available at 11:00 AM and 2:00 PM'
                ],
                safetyScore: 95
              },
              {
                name: 'Heritage Fort',
                location: 'Nearby Location',
                rating: '4.7',
                image: '🏰',
                category: 'Historical',
                bestTime: 'Oct-Mar (Winter)',
                entryFee: '₹150-300',
                timings: '9:00 AM - 6:00 PM',
                timeNeeded: '2-3 hours',
                description: 'Ancient fort offering a glimpse into local history',
                tips: [
                  'Wear comfortable shoes as there are many steps',
                  'Carry water, especially during summer months',
                  'Best visited in the morning to avoid heat'
                ],
                safetyScore: 88
              }
            ]);
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          setLoading(false);
          setError('Unable to fetch location. Showing default recommendations.');
          // Default spots if location fails
          setTouristSpots([
            {
              name: 'City Museum',
              location: 'Nearby Location',
              rating: '4.6',
              image: '🏛️',
              category: 'Museum',
              bestTime: 'Oct-Mar (Winter)',
              entryFee: '₹200-400',
              timings: '10:00 AM - 5:00 PM',
              timeNeeded: '2 hours',
              description: 'Local museum showcasing regional history and culture',
              tips: [
                'Visit on weekdays for fewer crowds',
                'Photography may be restricted in certain sections',
                'Guided tours available at 11:00 AM and 2:00 PM'
              ],
              safetyScore: 95
            },
            {
              name: 'Heritage Fort',
              location: 'Nearby Location',
              rating: '4.7',
              image: '🏰',
              category: 'Historical',
              bestTime: 'Oct-Mar (Winter)',
              entryFee: '₹150-300',
              timings: '9:00 AM - 6:00 PM',
              timeNeeded: '2-3 hours',
              description: 'Ancient fort offering a glimpse into local history',
              tips: [
                'Wear comfortable shoes as there are many steps',
                'Carry water, especially during summer months',
                'Best visited in the morning to avoid heat'
              ],
              safetyScore: 88
            }
          ]);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser. Showing default recommendations.');
      setLoading(false);
      // Default spots if geolocation not supported
      setTouristSpots([
        {
          name: 'City Museum',
          location: 'Nearby Location',
          rating: '4.6',
          image: '🏛️',
          category: 'Museum',
          bestTime: 'Oct-Mar (Winter)',
          entryFee: '₹200-400',
          timings: '10:00 AM - 5:00 PM',
          timeNeeded: '2 hours',
          description: 'Local museum showcasing regional history and culture',
          tips: [
            'Visit on weekdays for fewer crowds',
            'Photography may be restricted in certain sections',
            'Guided tours available at 11:00 AM and 2:00 PM'
          ],
          safetyScore: 95
        },
        {
          name: 'Heritage Fort',
          location: 'Nearby Location',
          rating: '4.7',
          image: '🏰',
          category: 'Historical',
          bestTime: 'Oct-Mar (Winter)',
          entryFee: '₹150-300',
          timings: '9:00 AM - 6:00 PM',
          timeNeeded: '2-3 hours',
          description: 'Ancient fort offering a glimpse into local history',
          tips: [
            'Wear comfortable shoes as there are many steps',
            'Carry water, especially during summer months',
            'Best visited in the morning to avoid heat'
          ],
          safetyScore: 88
        }
      ]);
    }
  };

  // Fetch spots when component mounts
  useEffect(() => {
    fetchNearbySpots();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Travel Guide</h2>
        <p className="text-gray-600 mt-1">Explore nearby attractions based on your current location</p>
      </div>
      
      {error && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <Info className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card bg-gradient-to-br from-primary-500 to-primary-600 text-white text-center">
          <MapPin className="h-8 w-8 mx-auto mb-2" />
          <p className="text-2xl font-bold">{touristSpots.length || '50+'}</p>
          <p className="text-sm text-primary-100">Nearby Spots</p>
        </div>
        <div className="card bg-gradient-to-br from-success-500 to-success-600 text-white text-center">
          <Utensils className="h-8 w-8 mx-auto mb-2" />
          <p className="text-2xl font-bold">200+</p>
          <p className="text-sm text-success-100">Local Dishes</p>
        </div>
        <div className="card bg-gradient-to-br from-warning-500 to-warning-600 text-white text-center">
          <Hotel className="h-8 w-8 mx-auto mb-2" />
          <p className="text-2xl font-bold">1000+</p>
          <p className="text-sm text-warning-100">Hotels</p>
        </div>
        <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white text-center">
          <Camera className="h-8 w-8 mx-auto mb-2" />
          <p className="text-2xl font-bold">38</p>
          <p className="text-sm text-purple-100">UNESCO Sites</p>
        </div>
      </div>

      
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold flex items-center">
            <MapPin className="h-6 w-6 mr-2 text-primary-600" />
            Must-Visit Tourist Destinations Near You
          </h3>
          <button 
            onClick={fetchNearbySpots}
            disabled={loading}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-medium disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Refresh Spots'}
          </button>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <span className="ml-3 text-gray-600">Finding nearby attractions...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {touristSpots.map((spot, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="text-6xl">{spot.image}</div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="text-2xl font-bold text-gray-900">{spot.name}</h4>
                        <p className="text-gray-600 flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {spot.location}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 mb-1">
                          <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                          <span className="font-bold text-lg">{spot.rating}</span>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          spot.safetyScore >= 90 ? 'bg-success-100 text-success-700' :
                          spot.safetyScore >= 80 ? 'bg-warning-100 text-warning-700' :
                          'bg-danger-100 text-danger-700'
                        }`}>
                          Safety: {spot.safetyScore}%
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-4">{spot.description}</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                          <Clock className="h-4 w-4" />
                          <span>Timings</span>
                        </div>
                        <p className="text-xs font-semibold text-gray-900">{spot.timings}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                          <DollarSign className="h-4 w-4" />
                          <span>Entry Fee</span>
                        </div>
                        <p className="text-xs font-semibold text-gray-900">{spot.entryFee}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                          <Clock className="h-4 w-4" />
                          <span>Time Needed</span>
                        </div>
                        <p className="text-xs font-semibold text-gray-900">{spot.timeNeeded}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                          <Info className="h-4 w-4" />
                          <span>Best Time</span>
                        </div>
                        <p className="text-xs font-semibold text-gray-900">{spot.bestTime}</p>
                      </div>
                    </div>

                    <div className="bg-primary-50 p-4 rounded-lg">
                      <p className="font-semibold text-primary-900 mb-2">💡 Travel Tips:</p>
                      <ul className="space-y-1">
                        {spot.tips.map((tip, idx) => (
                          <li key={idx} className="text-sm text-primary-800 flex items-start gap-2">
                            <span className="text-primary-600">•</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    
      <div className="card">
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <Utensils className="h-6 w-6 mr-2 text-primary-600" />
          Must-Try Local Cuisine
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {localCuisine.map((food, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                    {food.dish}
                    {food.mustTry && <span className="text-xs bg-danger-100 text-danger-700 px-2 py-1 rounded-full font-semibold">Must Try!</span>}
                    {food.vegetarian && <span className="text-xs bg-success-100 text-success-700 px-2 py-1 rounded-full font-semibold">🌱 Veg</span>}
                  </h4>
                  <p className="text-sm text-gray-600">{food.origin}</p>
                </div>
              </div>
              <p className="text-gray-700 mb-3 text-sm">{food.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-primary-600 font-bold">{food.price}</span>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                  food.spiceLevel.includes('Low') ? 'bg-success-100 text-success-700' :
                  food.spiceLevel.includes('Medium') ? 'bg-warning-100 text-warning-700' :
                  'bg-danger-100 text-danger-700'
                }`}>
                  🌶️ {food.spiceLevel}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      
      <div className="card bg-purple-50 border-2 border-purple-300">
        <h3 className="text-xl font-bold mb-4 text-purple-900">🙏 Cultural Etiquette & Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {culturalTips.map((tip, index) => (
            <div key={index} className="bg-white p-4 rounded-lg border border-purple-200">
              <h4 className="font-bold text-purple-900 mb-2">{tip.title}</h4>
              <p className="text-sm text-gray-700">{tip.description}</p>
            </div>
          ))}
        </div>
      </div>

    
      <div className="card">
        <h3 className="text-xl font-bold mb-4">✈️ Essential Travel Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {travelTips.map((tip, index) => (
            <div key={index} className="flex items-start gap-2 bg-gray-50 p-3 rounded-lg">
              <div className="h-2 w-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-700">{tip}</p>
            </div>
          ))}
        </div>
      </div>

  
      <div className="card bg-gradient-to-r from-warning-500 to-warning-600 text-white">
        <h3 className="text-xl font-bold mb-4">🌤️ Best Time to Visit India</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/20 backdrop-blur rounded-lg p-4">
            <h4 className="font-bold mb-2">Winter (Oct-Mar)</h4>
            <p className="text-sm text-warning-100">Best time for tourists. Pleasant weather (10-25°C). Perfect for sightseeing.</p>
          </div>
          <div className="bg-white/20 backdrop-blur rounded-lg p-4">
            <h4 className="font-bold mb-2">Summer (Apr-Jun)</h4>
            <p className="text-sm text-warning-100">Very hot (30-45°C). Visit hill stations. Carry sunscreen and stay hydrated.</p>
          </div>
          <div className="bg-white/20 backdrop-blur rounded-lg p-4">
            <h4 className="font-bold mb-2">Monsoon (Jul-Sep)</h4>
            <p className="text-sm text-warning-100">Heavy rainfall. Beautiful landscapes but travel disruptions possible.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TravelGuide
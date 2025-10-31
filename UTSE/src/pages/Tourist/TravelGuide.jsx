import { MapPin, Star, Camera, Utensils, Hotel, Clock, DollarSign, Info } from 'lucide-react'

const TravelGuide = () => {
  const touristSpots = [
    {
      name: 'Taj Mahal',
      location: 'Agra, Uttar Pradesh',
      rating: 4.8,
      image: '🕌',
      category: 'Monument',
      bestTime: 'Oct-Mar (Winter)',
      entryFee: '₹50 (Indians), $20 (Foreigners)',
      timings: '6:00 AM - 7:00 PM (Closed Friday)',
      timeNeeded: '2-3 hours',
      description: 'One of the Seven Wonders of the World, an ivory-white marble mausoleum',
      tips: [
        'Visit early morning for best photography',
        'Book tickets online to avoid queues',
        'Sunset view from Mehtab Bagh is spectacular'
      ],
      safetyScore: 95
    },
    {
      name: 'Red Fort',
      location: 'Delhi',
      rating: 4.6,
      image: '🏰',
      category: 'Historical',
      bestTime: 'Oct-Mar',
      entryFee: '₹35 (Indians), ₹500 (Foreigners)',
      timings: '9:30 AM - 4:30 PM',
      timeNeeded: '2-3 hours',
      description: 'Historic fortified palace of Mughal emperors',
      tips: [
        'Attend the Light & Sound show in evening',
        'Carry water bottle and wear comfortable shoes',
        'Avoid weekends for less crowd'
      ],
      safetyScore: 88
    },
    {
      name: 'Gateway of India',
      location: 'Mumbai, Maharashtra',
      rating: 4.5,
      image: '🚪',
      category: 'Monument',
      bestTime: 'Oct-Feb',
      entryFee: 'Free',
      timings: 'Open 24 hours',
      timeNeeded: '1-2 hours',
      description: 'Iconic monument overlooking the Arabian Sea',
      tips: [
        'Visit during sunset for beautiful views',
        'Take a ferry to Elephanta Caves nearby',
        'Be careful of your belongings in crowded areas'
      ],
      safetyScore: 82
    }
  ]

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
  ]

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
  ]

  const travelTips = [
    'Best time to visit India: October to March (Pleasant weather)',
    'Download offline maps before traveling',
    'Carry small denominations of cash (many places don\'t accept cards)',
    'Try local street food from busy, popular stalls',
    'Learn basic Hindi phrases: "Kitna hai?" (How much?), "Dhanyavaad" (Thank you)',
    'Use ride-sharing apps (Uber, Ola) for safe transportation',
    'Stay hydrated - drink bottled water only',
    'Respect local customs and dress codes'
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Travel Guide</h2>
        <p className="text-gray-600 mt-1">Explore India's rich culture, cuisine, and heritage</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card bg-gradient-to-br from-primary-500 to-primary-600 text-white text-center">
          <MapPin className="h-8 w-8 mx-auto mb-2" />
          <p className="text-2xl font-bold">50+</p>
          <p className="text-sm text-primary-100">Tourist Spots</p>
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
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <MapPin className="h-6 w-6 mr-2 text-primary-600" />
          Must-Visit Tourist Destinations
        </h3>
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

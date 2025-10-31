import { useState } from 'react'
import { Languages, Volume2, Copy, Star, BookOpen, MessageCircle, Loader } from 'lucide-react'
import { motion } from 'framer-motion'
import axios from 'axios'  

const LanguageTranslator = () => {
  const [inputText, setInputText] = useState('')
  const [translatedText, setTranslatedText] = useState('')
  const [fromLang, setFromLang] = useState('en')
  const [toLang, setToLang] = useState('hi')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
    { code: 'bn', name: 'Bengali', flag: '🇮🇳' },
    { code: 'te', name: 'Telugu', flag: '🇮🇳' },
    { code: 'mr', name: 'Marathi', flag: '🇮🇳' },
    { code: 'ta', name: 'Tamil', flag: '🇮🇳' },
    { code: 'gu', name: 'Gujarati', flag: '🇮🇳' },
    { code: 'kn', name: 'Kannada', flag: '🇮🇳' },
    { code: 'ml', name: 'Malayalam', flag: '🇮🇳' },
    { code: 'pa', name: 'Punjabi', flag: '🇮🇳' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
    { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
    { code: 'ru', name: 'Russian', flag: '🇷🇺' }
  ]

  const commonPhrases = [
    {
      category: 'Greetings',
      icon: '👋',
      phrases: [
        { en: 'Hello', hi: 'नमस्ते (Namaste)', pronunciation: 'Nuh-muh-stay' },
        { en: 'Good Morning', hi: 'सुप्रभात (Suprabhat)', pronunciation: 'Soo-pruh-bhat' },
        { en: 'Thank You', hi: 'धन्यवाद (Dhanyavaad)', pronunciation: 'Dhun-yuh-vaad' },
        { en: 'Please', hi: 'कृपया (Kripya)', pronunciation: 'Krip-yaa' },
        { en: 'Sorry', hi: 'माफ़ करें (Maaf Karen)', pronunciation: 'Maaf Kuh-ren' }
      ]
    },
    {
      category: 'Emergency',
      icon: '🚨',
      phrases: [
        { en: 'Help!', hi: 'मदद! (Madad!)', pronunciation: 'Muh-dud' },
        { en: 'Call Police', hi: 'पुलिस बुलाओ (Police Bulao)', pronunciation: 'Police Boo-lao' },
        { en: 'I need a doctor', hi: 'मुझे डॉक्टर चाहिए (Mujhe Doctor Chahiye)', pronunciation: 'Moo-jhe Doctor Cha-hee-ye' },
        { en: 'Emergency', hi: 'आपातकाल (Aapatkaal)', pronunciation: 'Aa-paat-kaal' },
        { en: 'Hospital', hi: 'अस्पताल (Aspatal)', pronunciation: 'Us-pa-taal' }
      ]
    },
    {
      category: 'Directions',
      icon: '🗺️',
      phrases: [
        { en: 'Where is...?', hi: 'कहाँ है...? (Kahan Hai...?)', pronunciation: 'Kuh-haan Hai' },
        { en: 'How far?', hi: 'कितनी दूर? (Kitni Door?)', pronunciation: 'Kit-nee Door' },
        { en: 'Left', hi: 'बाएं (Baayen)', pronunciation: 'Baa-yen' },
        { en: 'Right', hi: 'दाएं (Daayen)', pronunciation: 'Daa-yen' },
        { en: 'Straight', hi: 'सीधे (Seedhe)', pronunciation: 'See-dhe' }
      ]
    },
    {
      category: 'Shopping',
      icon: '🛍️',
      phrases: [
        { en: 'How much?', hi: 'कितना है? (Kitna Hai?)', pronunciation: 'Kit-naa Hai' },
        { en: 'Too expensive', hi: 'बहुत महंगा (Bahut Mahanga)', pronunciation: 'Buh-hut Muh-hun-gaa' },
        { en: 'Cheaper', hi: 'सस्ता (Sasta)', pronunciation: 'Suss-taa' },
        { en: 'I want this', hi: 'मुझे यह चाहिए (Mujhe Yeh Chahiye)', pronunciation: 'Moo-jhe Yeh Cha-hee-ye' },
        { en: 'No, thank you', hi: 'नहीं, धन्यवाद (Nahi, Dhanyavaad)', pronunciation: 'Nuh-hee, Dhun-yuh-vaad' }
      ]
    },
    {
      category: 'Food & Dining',
      icon: '🍽️',
      phrases: [
        { en: 'I am vegetarian', hi: 'मैं शाकाहारी हूँ (Main Shakahari Hoon)', pronunciation: 'Main Shaa-kaa-haa-ree Hoon' },
        { en: 'Water, please', hi: 'पानी, कृपया (Paani, Kripya)', pronunciation: 'Paa-nee, Krip-yaa' },
        { en: 'Bill, please', hi: 'बिल, कृपया (Bill, Kripya)', pronunciation: 'Bill, Krip-yaa' },
        { en: 'Delicious', hi: 'स्वादिष्ट (Swadisht)', pronunciation: 'Swaa-dishth' },
        { en: 'Not spicy', hi: 'तीखा नहीं (Teekha Nahi)', pronunciation: 'Tee-khaa Nuh-hee' }
      ]
    }
  ]

  const handleTranslate = async () => {
    if (!inputText.trim()) {
      setError('Please enter text to translate')
      return
    }

    setLoading(true)
    setError('')
    setTranslatedText('')

    try {
      console.log('Translating:', { text: inputText, from: fromLang, to: toLang })  

      const response = await axios.get('https://api.mymemory.translated.net/get', {
        params: {
          q: inputText,
          langpair: `${fromLang}|${toLang}`
        }
      })

      if (response.data.responseStatus ===200) { 
        setTranslatedText(response.data.responseData.translatedText)
      } else {
        throw new Error(`API Error: ${response.data.responseStatus}`)
      }
    } catch (err) {
      console.error('Translation Error:', err)
      setError(err.message.includes('API') ? 'Translation service is busy. Try again later.' : 'Network error. Check your connection.')
    } finally {
      setLoading(false)
    }
  }

  const speakText = (text, lang = toLang) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = lang
      window.speechSynthesis.speak(utterance)
    } else {
      alert('Speech synthesis not supported in your browser')
    }
  }

  const copyText = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => alert('Copied to clipboard!'))
      .catch(() => alert('Failed to copy'))
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Language Translator</h2>
        <p className="text-gray-600 mt-1">Multi-language support for seamless communication 🌍</p>
      </div>

      
      <div className="card">
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <Languages className="h-6 w-6 mr-2 text-primary-600" />
          Instant Translator
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">From</label>
            <select 
              className="input-field"
              value={fromLang}
              onChange={(e) => setFromLang(e.target.value)}
            >
              <option value="en">Auto Detect</option>
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">To</label>
            <select 
              className="input-field"
              value={toLang}
              onChange={(e) => setToLang(e.target.value)}
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700">Enter Text</label>
              <motion.button 
                whileHover={{ scale: 1.1 }}
                onClick={() => speakText(inputText, fromLang)}
                className="text-primary-600 hover:text-primary-700"
                title="Speak Input"
              >
                <Volume2 className="h-5 w-5" />
              </motion.button>
            </div>
            <textarea
              className="input-field"
              rows="6"
              placeholder="Type something to translate... 📝"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            ></textarea>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700">Translation</label>
              <div className="flex gap-2">
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  onClick={() => speakText(translatedText, toLang)}
                  className="text-primary-600 hover:text-primary-700"
                  title="Speak Translation"
                >
                  <Volume2 className="h-5 w-5" />
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  onClick={() => copyText(translatedText)}
                  className="text-primary-600 hover:text-primary-700"
                  title="Copy Translation"
                >
                  <Copy className="h-5 w-5" />
                </motion.button>
              </div>
            </div>
            <textarea
              className="input-field bg-gray-50"
              rows="6"
              placeholder="Translation will appear here... ✨"
              value={translatedText}
              readOnly
            ></textarea>
            {error && <p className="text-sm text-danger-600 mt-2">{error}</p>}
          </div>
        </div>

        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleTranslate}
          disabled={loading}
          className="w-full mt-4 btn-primary flex items-center justify-center"
        >
          {loading ? <Loader className="h-5 w-5 mr-2 animate-spin" /> : <Languages className="inline h-5 w-5 mr-2" />}
          {loading ? 'Translating...' : 'Translate Now'}
        </motion.button>
      </div>

    
      <div className="space-y-4">
        <h3 className="text-xl font-bold flex items-center">
          <BookOpen className="h-6 w-6 mr-2 text-primary-600" />
          Common Phrases (English - Hindi)
        </h3>
        {commonPhrases.map((category, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="card"
          >
            <h4 className="text-lg font-bold mb-4 flex items-center">
              <span className="text-2xl mr-2">{category.icon}</span>
              {category.category}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {category.phrases.map((phrase, idx) => (
                <motion.div 
                  key={idx}
                  whileHover={{ scale: 1.02 }}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 mb-1">{phrase.en}</p>
                      <p className="text-primary-600 font-bold text-lg mb-1">{phrase.hi}</p>
                      <p className="text-sm text-gray-500 italic">{phrase.pronunciation}</p>
                    </div>
                    <div className="flex gap-1">
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        onClick={() => speakText(phrase.hi)}
                        className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg"
                        title="Speak"
                      >
                        <Volume2 className="h-4 w-4" />
                      </motion.button>
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        onClick={() => copyText(phrase.hi)}
                        className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg"
                        title="Copy"
                      >
                        <Copy className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>


      <div className="card">
        <h4 className="text-lg font-bold mb-4">🔢 Numbers (1-10)</h4>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { num: '1', hi: 'एक (Ek)' },
            { num: '2', hi: 'दो (Do)' },
            { num: '3', hi: 'तीन (Teen)' },
            { num: '4', hi: 'चार (Chaar)' },
            { num: '5', hi: 'पांच (Paanch)' },
            { num: '6', hi: 'छह (Chhah)' },
            { num: '7', hi: 'सात (Saat)' },
            { num: '8', hi: 'आठ (Aath)' },
            { num: '9', hi: 'नौ (Nau)' },
            { num: '10', hi: 'दस (Das)' }
          ].map((num, idx) => (
            <div key={idx} className="bg-gray-50 p-3 rounded-lg text-center">
              <p className="text-2xl font-bold text-primary-600 mb-1">{num.num}</p>
              <p className="text-sm font-semibold text-gray-900">{num.hi}</p>
            </div>
          ))}
        </div>
      </div>

    
      <div className="card bg-danger-50 border-2 border-danger-300">
        <h4 className="text-lg font-bold text-danger-900 mb-4 flex items-center">
          🚨 Emergency Phrases - Keep Handy!
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { en: 'I need help', hi: 'मुझे मदद चाहिए', pronunciation: 'Mujhe madad chahiye' },
            { en: 'Call 100 (Police)', hi: '100 पर फोन करें', pronunciation: '100 par phone karen' },
            { en: 'Where is hospital?', hi: 'अस्पताल कहाँ है?', pronunciation: 'Aspatal kahan hai?' },
            { en: 'I am lost', hi: 'मैं खो गया हूँ', pronunciation: 'Main kho gaya hoon' }
          ].map((phrase, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ scale: 1.02 }}
              className="bg-white p-4 rounded-lg border border-danger-200"
            >
              <p className="font-bold text-gray-900 mb-1">{phrase.en}</p>
              <p className="text-danger-600 font-bold text-lg mb-1">{phrase.hi}</p>
              <p className="text-sm text-gray-600 italic mb-2">{phrase.pronunciation}</p>
              <button 
                onClick={() => speakText(phrase.hi)}
                className="w-full bg-danger-600 text-white py-2 rounded-lg hover:bg-danger-700 font-semibold text-sm"
              >
                <Volume2 className="inline h-4 w-4 mr-1" />
                Speak
              </button>
            </motion.div>
          ))}
        </div>
      </div>


      <div className="card bg-primary-50 border-2 border-primary-300">
        <h4 className="text-lg font-bold text-primary-900 mb-3">💡 Language Tips for Tourists</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-primary-800">
          {[
            'Indians appreciate when tourists try to speak Hindi, even basic words',
            'Hand gestures are widely understood - pointing, nodding work universally',
            'Many Indians in tourist areas speak English - don\'t hesitate to ask',
            'Download offline translation apps before traveling to remote areas',
            'Learn to say "Namaste" with folded hands - it\'s the universal greeting',
            'Save important phrases in your phone for quick reference'
          ].map((tip, idx) => (
            <div key={idx} className="flex items-start gap-2 bg-white p-3 rounded-lg">
              <Star className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />
              <span>{tip}</span>
            </div>
          ))}
        </div>
      </div>

    
      <div className="card bg-gradient-to-r from-purple-600 to-purple-700 text-white">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h4 className="text-xl font-bold mb-2 flex items-center">
              <MessageCircle className="h-6 w-6 mr-2" />
              Voice Translation Assistant
            </h4>
            <p className="text-purple-100 mb-4">Speak in your language and get instant Hindi translation with pronunciation</p>
            <button className="bg-white/20 hover:bg-white/30 backdrop-blur px-6 py-3 rounded-lg font-semibold">
              🎤 Start Voice Translation
            </button>
          </div>
          <div className="hidden md:block text-6xl">
            🗣️
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default LanguageTranslator

import { useState, useEffect } from 'react'
import { useAuth } from '../../components/Auth/AuthContext'
import { User, Phone, MapPin, Heart, Users, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../lib/apiClient'
import { toast } from 'react-toastify'

const TouristRegistration = () => {
  const { user, updateUser } = useAuth()
  const navigate = useNavigate()

  const [step, setStep] = useState(1)
  const [isAddingMember, setIsAddingMember] = useState(false)
  const [groupMembers, setGroupMembers] = useState([])
  const [error, setError] = useState('')
  const [hasExistingCards, setHasExistingCards] = useState(false)
  const [checkingCards, setCheckingCards] = useState(true)

  const initialFormState = {
    fullName: '',
    email: '',
    phone: '',
    country: '',
    passportNumber: '',
    aadhaarNumber: '',
    touristType: 'international',

    dateOfBirth: '',
    gender: '',
    nationality: '',
    address: '',

    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelation: '',

    hotelName: '',
    hotelAddress: '',
    checkInDate: '',
    checkOutDate: '',
    purposeOfVisit: '',

    bloodGroup: '',
    medicalConditions: '',
    allergies: '',
    travelInsurance: '',
    insuranceProvider: ''
  }

  const [formData, setFormData] = useState({
    ...initialFormState,
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    country: user?.country || '',
    passportNumber: user?.passportNumber || '',
    aadhaarNumber: user?.aadhaarNumber || '',
    touristType: user?.touristType || 'international',
    emergencyContactPhone: user?.emergencyContact || ''
  })

  // Check if user has existing cards
  useEffect(() => {
    const checkExistingCards = async () => {
      try {
        setCheckingCards(true)
        const { data } = await api.get('/api/tourist/me')
        const cards = data?.data?.cards || []
        
        if (cards.length > 0) {
          setHasExistingCards(true)
          // Update user registration status
          if (!user?.isRegistered) {
            updateUser({ ...user, isRegistered: true })
          }
        } else {
          setHasExistingCards(false)
        }
      } catch (e) {
        console.error('Failed to check cards:', e)
        setHasExistingCards(false)
      } finally {
        setCheckingCards(false)
      }
    }

    if (user) {
      checkExistingCards()
    }
  }, [user])

  // Prefill from localStorage (set at SignUp) on first load
  useEffect(() => {
    try {
      const pre = JSON.parse(localStorage.getItem('touristPrefill') || 'null')
      if (pre) {
        setFormData((f) => ({
          ...f,
          fullName: f.fullName || pre.fullName || '',
          email: f.email || pre.email || '',
          phone: f.phone || pre.phone || '',
          country: f.country || pre.country || '',
          touristType: pre.touristType || f.touristType,
          passportNumber: pre.passportNumber || f.passportNumber,
          aadhaarNumber: pre.aadhaarNumber || f.aadhaarNumber,
          emergencyContactName: pre.emergencyContactName || f.emergencyContactName,
          emergencyContactPhone: pre.emergencyContactPhone || f.emergencyContactPhone
        }))
      }
    } catch {}
  }, [])

  const handleChange = (e) => {
    setError('')
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleNext = () => {
    if (step === 1 && (!formData.fullName || (!formData.passportNumber && !formData.aadhaarNumber))) {
      setError('Full Name and a valid ID number are required.')
      return
    }
    setError('')
    if (step < 4) {
      setStep(step + 1)
    } else {
      handleSubmit()
    }
  }

  const handleSubmit = async () => {
    try {
      // If we are currently adding a group member, don't call backend yet.
      if (isAddingMember) {
        // Validate that member has different ID than leader and other members
        const newMemberPassport = formData.passportNumber;
        const newMemberAadhaar = formData.aadhaarNumber;
        
        // Check against leader's ID
        const leaderData = JSON.parse(localStorage.getItem('touristData') || '{}');
        const leaderPassport = leaderData.passportNumber;
        const leaderAadhaar = leaderData.aadhaarNumber;
        
        if ((newMemberPassport && newMemberPassport === leaderPassport) || 
            (newMemberAadhaar && newMemberAadhaar === leaderAadhaar)) {
          setError('Each family member must have a unique Passport or Aadhaar number. This ID matches the group leader.');
          toast.error('Duplicate ID detected!');
          return;
        }
        
        // Check against other members
        const duplicateMember = groupMembers.find(m => 
          (newMemberPassport && m.passportNumber === newMemberPassport) ||
          (newMemberAadhaar && m.aadhaarNumber === newMemberAadhaar)
        );
        
        if (duplicateMember) {
          setError('Each family member must have a unique Passport or Aadhaar number. This ID is already used.');
          toast.error('Duplicate ID detected!');
          return;
        }
        
        const newMember = { ...formData, memberId: `MEM-${Date.now()}` }
        setGroupMembers((prev) => [...prev, newMember])
        toast.success(`${newMember.fullName || 'Member'} added to your group`)
        setFormData(initialFormState)
        setIsAddingMember(false)
        setStep(5)
        return
      }

      // Finalize main registration → hit backend
      const registrationData = { ...formData, group: groupMembers }
      const resp = await api.post('/api/tourist/register', registrationData)
      const payload = resp?.data?.data || {}

      // Update auth user
      const nextUser = { ...user, isRegistered: true, touristId: payload.touristId }
      updateUser(nextUser)

      // Local fallback (so card can render even if API down later)
      const finalData = {
        ...formData,
        touristId: payload.touristId,
        group: groupMembers
      }
      localStorage.setItem('touristData', JSON.stringify(finalData))
      localStorage.removeItem('touristPrefill')

      // Notify SmartIDSystem and TouristMonitoring about new card
      const newCard = {
        id: payload.touristId,
        name: formData.fullName,
        country: formData.country,
        passport: formData.passportNumber,
        aadhaar: formData.aadhaarNumber,
        touristType: formData.touristType,
        phone: formData.phone,
        email: formData.email,
        emergencyContactName: formData.emergencyContactName,
        emergencyContact: formData.emergencyContactPhone,
        checkIn: formData.checkInDate,
        checkOut: formData.checkOutDate,
        hotelName: formData.hotelName,
        hotelAddress: formData.hotelAddress,
        group: groupMembers,
        status: 'Active',
        verified: true
      }
      
      try {
        localStorage.setItem('newTouristCard', JSON.stringify(newCard))
        window.dispatchEvent(new CustomEvent('newTouristCard', { detail: newCard }))
      } catch (e) { /* ignore */ }

      toast.success('Registration completed!')
      navigate('/tourist/my-card')
    } catch (e) {
      console.error('tourist/register failed', e)
      const msg = e?.response?.data?.message || 'Failed to complete registration'
      setError(msg)
      toast.error(msg)
    }
  }

  const startNewMemberRegistration = () => {
    setIsAddingMember(true)
    setFormData(initialFormState)
    setStep(1)
  }

  const finishGroupRegistration = async () => {
    await handleSubmit()
  }

  // Show loading while checking for existing cards
  if (checkingCards) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="card text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // If user has existing cards, show option to view or create new
  if (hasExistingCards) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card text-center">
        <h2 className="text-2xl font-bold text-success-700">Welcome Back!</h2>
        <p className="text-gray-600 mt-2">You already have tourist cards. You can create a new card or view your existing cards.</p>
        <div className="flex flex-col sm:flex-row gap-3 mt-6 justify-center">
          <Link to="/tourist/my-card" className="px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700">
            View My Cards
          </Link>
          <button 
            onClick={() => setHasExistingCards(false)} 
            className="px-6 py-3 bg-success-600 text-white rounded-lg font-semibold hover:bg-success-700"
          >
            Create New Card
          </button>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
      <div className="card">
        <motion.h2 initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="text-3xl font-bold text-gray-900 mb-2">
          {isAddingMember ? `Add Family Member ${groupMembers.length > 0 ? `(${groupMembers.length + 1})` : ''}` : 'Tourist Registration'}
        </motion.h2>
        <p className="text-gray-600">
          {isAddingMember 
            ? `Fill in details for family member ${groupMembers.length + 1}. Each member must have a unique Passport/Aadhaar.` 
            : 'Complete your registration to get your Smart Tourist Card. You can register alone or add family members.'}
        </p>

        {/* Stepper */}
        <div className="my-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex-1 flex items-center">
                <motion.div
                  animate={{ scale: step >= s ? 1.1 : 1 }}
                  className={`h-10 w-10 rounded-full flex items-center justify-center font-bold ${
                    step >= s ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {s}
                </motion.div>
                {s < 4 && <div className={`flex-1 h-1 mx-2 ${step > s ? 'bg-primary-600' : 'bg-gray-200'}`} />}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-center">
            <span className="text-xs font-medium w-1/4">Personal</span>
            <span className="text-xs font-medium w-1/4">Contact</span>
            <span className="text-xs font-medium w-1/4">Stay</span>
            <span className="text-xs font-medium w-1/4">Medical</span>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-danger-50 text-danger-700 rounded-lg flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}

        {/* Form content */}
        <form className="space-y-6">
          {step === 1 && (
            <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-4">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <User className="h-6 w-6 mr-2 text-primary-600" />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold">Full Name *</label>
                  <input type="text" name="fullName" required className="input-field" value={formData.fullName} onChange={handleChange} />
                </div>
                <div>
                  <label className="block text-sm font-semibold">Date of Birth *</label>
                  <input type="date" name="dateOfBirth" required className="input-field" value={formData.dateOfBirth} onChange={handleChange} />
                </div>
                <div>
                  <label className="block text-sm font-semibold">Gender *</label>
                  <select name="gender" required className="input-field" value={formData.gender} onChange={handleChange}>
                    <option value="">Select</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold">Nationality *</label>
                  <input type="text" name="nationality" required className="input-field" value={formData.nationality} onChange={handleChange} />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold">Country *</label>
                  <input type="text" name="country" required className="input-field" value={formData.country} onChange={handleChange} />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold mb-2">Tourist Type</label>
                  <div className="flex gap-4 p-2 bg-gray-100 rounded-lg">
                    <label className={`flex-1 text-center py-2 rounded-md cursor-pointer ${formData.touristType === 'international' ? 'bg-white shadow' : ''}`}>
                      <input
                        type="radio"
                        name="touristType"
                        value="international"
                        checked={formData.touristType === 'international'}
                        onChange={handleChange}
                        className="hidden"
                      />
                      International
                    </label>
                    <label className={`flex-1 text-center py-2 rounded-md cursor-pointer ${formData.touristType === 'domestic' ? 'bg-white shadow' : ''}`}>
                      <input
                        type="radio"
                        name="touristType"
                        value="domestic"
                        checked={formData.touristType === 'domestic'}
                        onChange={handleChange}
                        className="hidden"
                      />
                      Domestic
                    </label>
                  </div>
                </div>

                {formData.touristType === 'international' ? (
                  <div>
                    <label className="block text-sm font-semibold">Passport Number *</label>
                    <input
                      type="text"
                      name="passportNumber"
                      required
                      className="input-field"
                      value={formData.passportNumber}
                      onChange={(e) => setFormData({ ...formData, passportNumber: e.target.value, aadhaarNumber: '' })}
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-semibold">Aadhaar Number *</label>
                    <input
                      type="text"
                      name="aadhaarNumber"
                      required
                      maxLength={12}
                      pattern="\d{12}"
                      title="Aadhaar number must be 12 digits"
                      className="input-field"
                      value={formData.aadhaarNumber}
                      onChange={(e) => setFormData({ ...formData, aadhaarNumber: e.target.value, passportNumber: '' })}
                    />
                  </div>
                )}

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold">Home Address</label>
                  <textarea name="address" className="input-field" rows="3" value={formData.address} onChange={handleChange} />
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-4">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Phone className="h-6 w-6 mr-2 text-primary-600" />
                Contact & Emergency
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold">Email *</label>
                  <input type="email" name="email" required className="input-field" value={formData.email} onChange={handleChange} />
                </div>
                <div>
                  <label className="block text-sm font-semibold">Phone *</label>
                  <input type="tel" name="phone" required className="input-field" value={formData.phone} onChange={handleChange} />
                </div>

                <div className="md:col-span-2 bg-warning-50 p-4 rounded-lg">
                  <p className="font-semibold mb-3">Emergency Contact</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold">Full Name *</label>
                      <input
                        type="text"
                        name="emergencyContactName"
                        required
                        className="input-field"
                        value={formData.emergencyContactName}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold">Phone *</label>
                      <input
                        type="tel"
                        name="emergencyContactPhone"
                        required
                        className="input-field"
                        value={formData.emergencyContactPhone}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold">Relation *</label>
                      <select
                        name="emergencyContactRelation"
                        required
                        className="input-field"
                        value={formData.emergencyContactRelation}
                        onChange={handleChange}
                      >
                        <option value="">Select</option>
                        <option>Spouse</option>
                        <option>Parent</option>
                        <option>Sibling</option>
                        <option>Friend</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-4">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <MapPin className="h-6 w-6 mr-2 text-primary-600" />
                Stay & Travel Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold">Hotel/Accommodation *</label>
                  <input type="text" name="hotelName" required className="input-field" value={formData.hotelName} onChange={handleChange} />
                </div>
                <div>
                  <label className="block text-sm font-semibold">Hotel Address *</label>
                  <input type="text" name="hotelAddress" required className="input-field" value={formData.hotelAddress} onChange={handleChange} />
                </div>
                <div>
                  <label className="block text-sm font-semibold">Check-in Date *</label>
                  <input type="date" name="checkInDate" required className="input-field" value={formData.checkInDate} onChange={handleChange} />
                </div>
                <div>
                  <label className="block text-sm font-semibold">Check-out Date *</label>
                  <input type="date" name="checkOutDate" required className="input-field" value={formData.checkOutDate} onChange={handleChange} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold">Purpose of Visit *</label>
                  <select name="purposeOfVisit" required className="input-field" value={formData.purposeOfVisit} onChange={handleChange}>
                    <option value="">Select</option>
                    <option>Tourism</option>
                    <option>Business</option>
                    <option>Education</option>
                    <option>Medical</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-4">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Heart className="h-6 w-6 mr-2 text-danger-600" />
                Medical Information
              </h3>
              <div className="bg-danger-50 p-4 rounded-lg mb-4">
                <p className="text-sm">This is crucial for emergency medical assistance.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold">Blood Group</label>
                  <select name="bloodGroup" className="input-field" value={formData.bloodGroup} onChange={handleChange}>
                    <option value="">Select</option>
                    <option>A+</option>
                    <option>A-</option>
                    <option>B+</option>
                    <option>B-</option>
                    <option>O+</option>
                    <option>O-</option>
                    <option>AB+</option>
                    <option>AB-</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold">Medical Conditions</label>
                  <textarea name="medicalConditions" className="input-field" rows="3" value={formData.medicalConditions} onChange={handleChange} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold">Allergies</label>
                  <textarea name="allergies" className="input-field" rows="3" value={formData.allergies} onChange={handleChange} />
                </div>
              </div>
              <div className="p-4 mt-6">
                <div className="flex items-start gap-3">
                  <input type="checkbox" required className="mt-1" />
                  <p className="text-sm">I confirm all info is accurate and agree to the terms.</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Controls */}
          <div className="flex gap-4 pt-6 border-t border-gray-200">
            {step > 1 && (
              <button type="button" onClick={handlePrevious} className="flex-1 bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold">
                Previous
              </button>
            )}
            <button type="button" onClick={handleNext} className="flex-1 btn-primary">
              {step === 4 ? (isAddingMember ? 'Add Member to Group' : 'Complete My Registration') : 'Next'}
            </button>
          </div>
        </form>

        {/* Completion screen (group actions) */}
        {step === 5 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
            <h2 className="text-2xl font-bold text-success-700">Member Added Successfully!</h2>
            <p className="text-gray-600 my-4">You can add more family members or finish to complete registration.</p>

            {groupMembers.length > 0 && (
              <div className="mb-6 text-left bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold mb-2 text-primary-700">👨‍👩‍👧‍👦 Group Members Added ({groupMembers.length}):</h3>
                <div className="space-y-2">
                  {groupMembers.map((m, idx) => (
                    <div key={m.memberId} className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200">
                      <div>
                        <p className="font-semibold text-gray-800">{idx + 1}. {m.fullName}</p>
                        <p className="text-sm text-gray-600">
                          {m.touristType === 'domestic' 
                            ? `Aadhaar: ${m.aadhaarNumber || 'N/A'}` 
                            : `Passport: ${m.passportNumber || 'N/A'}`}
                        </p>
                      </div>
                      <span className="text-xs bg-success-100 text-success-700 px-3 py-1 rounded-full font-medium">✓ Added</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 text-left">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Each family member must have a unique Passport or Aadhaar number different from yours and other members.
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <button onClick={startNewMemberRegistration} className="flex-1 btn-primary">
                <Users className="inline h-4 w-4 mr-2" />
                Add Another Family Member
              </button>
              <button onClick={finishGroupRegistration} className="flex-1 bg-success-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-success-700 transition-colors">
                Finish & View Card
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default TouristRegistration
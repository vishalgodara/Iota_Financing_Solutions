import { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar as CalendarIcon, Clock, MapPin, User, Phone, Mail, CheckCircle2, FileText } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Calendar } from './ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Checkbox } from './ui/checkbox';

export default function AppointmentScheduler() {
  const [step, setStep] = useState(1);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [formData, setFormData] = useState({
    appointmentType: '',
    location: '',
    time: '',
    name: '',
    email: '',
    phone: '',
    vehicle: '',
    notes: '',
    preFillPaperwork: false,
    virtualOption: false,
  });

  const appointmentTypes = [
    { value: 'test-drive', label: 'Test Drive', icon: '🚗', duration: '30 min' },
    { value: 'purchase', label: 'Purchase Consultation', icon: '💰', duration: '60 min' },
    { value: 'lease-end', label: 'Lease End Review', icon: '📋', duration: '45 min' },
    { value: 'service', label: 'Service Appointment', icon: '🔧', duration: '90 min' },
    { value: 'virtual', label: 'Virtual Consultation', icon: '💻', duration: '30 min' },
  ];

  const locations = [
    { value: 'downtown', label: 'Downtown Toyota', address: '123 Main St, City, ST 12345' },
    { value: 'westside', label: 'Westside Toyota', address: '456 West Ave, City, ST 12345' },
    { value: 'northpark', label: 'North Park Toyota', address: '789 North Blvd, City, ST 12345' },
  ];

  const timeSlots = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
    '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM', '6:00 PM',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(4); // Go to confirmation
  };

  const selectedType = appointmentTypes.find((t) => t.value === formData.appointmentType);
  const selectedLocation = locations.find((l) => l.value === formData.location);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <CalendarIcon className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-gray-900 mb-2">Schedule Your Appointment</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Book a time that works for you. We'll pre-fill your paperwork and have everything ready when you arrive.
        </p>
      </motion.div>

      {/* Progress Indicator */}
      {step < 4 && (
        <div className="flex items-center justify-center gap-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  step >= s ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}
              >
                {s}
              </div>
              {s < 3 && (
                <div
                  className={`w-12 h-1 transition-colors ${
                    step > s ? 'bg-red-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Step 1: Appointment Type */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card className="p-8">
              <h3 className="text-gray-900 mb-6">What brings you in?</h3>
              <RadioGroup
                value={formData.appointmentType}
                onValueChange={(value) => setFormData({ ...formData, appointmentType: value })}
              >
                <div className="grid md:grid-cols-2 gap-4">
                  {appointmentTypes.map((type) => (
                    <div
                      key={type.value}
                      className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all ${
                        formData.appointmentType === type.value
                          ? 'border-red-600 bg-red-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setFormData({ ...formData, appointmentType: type.value })}
                    >
                      <RadioGroupItem
                        value={type.value}
                        id={type.value}
                        className="absolute top-4 right-4"
                      />
                      <div className="text-4xl mb-3">{type.icon}</div>
                      <h4 className="text-gray-900 mb-1">{type.label}</h4>
                      <p className="text-sm text-gray-600">Typical duration: {type.duration}</p>
                    </div>
                  ))}
                </div>
              </RadioGroup>

              <div className="flex justify-end mt-8">
                <Button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={!formData.appointmentType}
                >
                  Next: Choose Date & Time
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Step 2: Date, Time & Location */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card className="p-8">
              <h3 className="text-gray-900 mb-6">Choose your preferred date, time, and location</h3>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Calendar */}
                <div>
                  <Label className="mb-3 block">Select Date</Label>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(date) => date < new Date() || date.getDay() === 0}
                    className="rounded-lg border border-gray-200"
                  />
                </div>

                {/* Time & Location */}
                <div className="space-y-6">
                  <div>
                    <Label className="mb-3 block">Location</Label>
                    <Select
                      value={formData.location}
                      onValueChange={(value) => setFormData({ ...formData, location: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a location" />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map((location) => (
                          <SelectItem key={location.value} value={location.value}>
                            <div>
                              <div>{location.label}</div>
                              <div className="text-xs text-gray-500">{location.address}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {date && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                    >
                      <Label className="mb-3 block">Available Time Slots</Label>
                      <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                        {timeSlots.map((time) => (
                          <button
                            key={time}
                            type="button"
                            onClick={() => setFormData({ ...formData, time })}
                            className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                              formData.time === time
                                ? 'bg-red-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {formData.appointmentType === 'virtual' && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-blue-900">
                        💻 This will be a video consultation. We'll send you a meeting link via email.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <Button type="button" variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button
                  type="button"
                  onClick={() => setStep(3)}
                  disabled={!date || !formData.time || !formData.location}
                >
                  Next: Your Information
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Step 3: Contact Information */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card className="p-8">
              <h3 className="text-gray-900 mb-6">Your information</h3>

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <div className="relative mt-2">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="pl-10"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <div className="relative mt-2">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="pl-10"
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <div className="relative mt-2">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="pl-10"
                        placeholder="(555) 123-4567"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="vehicle">Vehicle of Interest (Optional)</Label>
                    <Select
                      value={formData.vehicle}
                      onValueChange={(value) => setFormData({ ...formData, vehicle: value })}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select a vehicle" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="camry">Camry Hybrid</SelectItem>
                        <SelectItem value="rav4">RAV4 Hybrid</SelectItem>
                        <SelectItem value="corolla">Corolla Hybrid</SelectItem>
                        <SelectItem value="highlander">Highlander</SelectItem>
                        <SelectItem value="bz4x">bZ4X Electric</SelectItem>
                        <SelectItem value="other">Other/Not Sure</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes">Additional Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="mt-2"
                    placeholder="Any specific questions or requirements?"
                    rows={4}
                  />
                </div>

                {/* Pre-fill Options */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
                  <h4 className="text-green-900 mb-4">Speed up your visit</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="preFill"
                        checked={formData.preFillPaperwork}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, preFillPaperwork: checked as boolean })
                        }
                      />
                      <div>
                        <Label htmlFor="preFill" className="cursor-pointer text-green-900">
                          Pre-fill my paperwork
                        </Label>
                        <p className="text-xs text-green-800 mt-1">
                          We'll email you forms to complete before your visit, saving you 20-30 minutes
                        </p>
                      </div>
                    </div>

                    {formData.appointmentType !== 'virtual' && (
                      <div className="flex items-start gap-3">
                        <Checkbox
                          id="virtual"
                          checked={formData.virtualOption}
                          onCheckedChange={(checked) =>
                            setFormData({ ...formData, virtualOption: checked as boolean })
                          }
                        />
                        <div>
                          <Label htmlFor="virtual" className="cursor-pointer text-green-900">
                            Send me virtual tour option
                          </Label>
                          <p className="text-xs text-green-800 mt-1">
                            Get a video walkthrough of your vehicle of interest before your visit
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <Button type="button" variant="outline" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button type="submit">Confirm Appointment</Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Step 4: Confirmation */}
        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-gray-900 mb-2">Appointment Confirmed!</h2>
              <p className="text-gray-600 mb-8">
                We've sent a confirmation email to <strong>{formData.email}</strong>
              </p>

              <Card className="p-6 bg-gray-50 text-left mb-8">
                <h3 className="text-gray-900 mb-4">Appointment Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                      {selectedType?.icon}
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Type</div>
                      <div className="text-gray-900">{selectedType?.label}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                      <CalendarIcon className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Date & Time</div>
                      <div className="text-gray-900">
                        {date?.toLocaleDateString()} at {formData.time}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Location</div>
                      <div className="text-gray-900">{selectedLocation?.label}</div>
                      <div className="text-sm text-gray-600">{selectedLocation?.address}</div>
                    </div>
                  </div>
                </div>
              </Card>

              {formData.preFillPaperwork && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <div className="text-left">
                      <div className="text-sm text-blue-900">Pre-filled paperwork sent!</div>
                      <div className="text-xs text-blue-800">
                        Check your email for forms to complete before your visit
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-4 justify-center">
                <Button>Add to Calendar</Button>
                <Button variant="outline">Print Confirmation</Button>
              </div>
            </Card>
          </motion.div>
        )}
      </form>
    </div>
  );
}

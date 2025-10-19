import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft, Check, Car, Zap, DollarSign } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Slider } from './ui/slider';

export type UserProfile = {
  lifestyle: {
    dailyCommute: number;
    vehicleType: 'sedan' | 'suv' | 'truck' | 'van' | '';
    powerTrain: 'electric' | 'hybrid' | 'gas' | '';
  };
  financial: {
    targetPayment: number;
    downPayment: number;
    creditScore: string;
  };
  completed: boolean;
};

type Props = {
  onComplete: (profile: UserProfile) => void;
};

export default function QuestionnaireFlow({ onComplete }: Props) {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<UserProfile>({
    lifestyle: {
      dailyCommute: 20,
      vehicleType: '',
      powerTrain: '',
    },
    financial: {
      targetPayment: 400,
      downPayment: 0,
      creditScore: '',
    },
    completed: false,
  });

  const totalSteps = 3;

  const updateProfile = (section: 'lifestyle' | 'financial', field: string, value: any) => {
    setProfile((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      onComplete({ ...profile, completed: true });
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return profile.lifestyle.vehicleType !== '';
      case 2:
        return profile.lifestyle.powerTrain !== '';
      case 3:
        return profile.financial.targetPayment > 0 && profile.financial.creditScore !== '';
      default:
        return false;
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Progress Bar */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-gray-900">Find Your Perfect Match</h3>
          <span className="text-sm text-gray-600">
            Step {step} of {totalSteps}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-red-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Cards */}
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-8">
              <div className="mb-6">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
                  <Car className="w-6 h-6 text-red-600" />
                </div>
                <h2 className="text-gray-900 mb-2">What type of vehicle do you prefer?</h2>
                <p className="text-gray-600">Choose the body style that best fits your lifestyle.</p>
              </div>

              <div className="space-y-6">
                {/* Vehicle Type Selection */}
                <div>
                  <Label className="mb-3 block">Vehicle Type</Label>
                  <RadioGroup
                    value={profile.lifestyle.vehicleType}
                    onValueChange={(value) => updateProfile('lifestyle', 'vehicleType', value)}
                  >
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { value: 'sedan', label: 'Sedan', desc: 'Fuel-efficient & comfortable' },
                        { value: 'suv', label: 'SUV', desc: 'Spacious & versatile' },
                        { value: 'truck', label: 'Truck', desc: 'Powerful & capable' },
                        { value: 'van', label: 'Van', desc: 'Maximum space' },
                      ].map((option) => (
                        <label
                          key={option.value}
                          className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${profile.lifestyle.vehicleType === option.value
                              ? 'border-red-600 bg-red-50'
                              : 'border-gray-200 hover:border-gray-300'
                            }`}
                        >
                          <RadioGroupItem value={option.value} className="mt-1" />
                          <div>
                            <div className="text-gray-900">{option.label}</div>
                            <div className="text-sm text-gray-600">{option.desc}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </RadioGroup>
                </div>

                {/* Daily Commute */}
                <div>
                  <Label className="mb-3 block">Daily Commute (miles per day)</Label>
                  <div className="space-y-3">
                    <Slider
                      value={[profile.lifestyle.dailyCommute]}
                      onValueChange={([value]) => updateProfile('lifestyle', 'dailyCommute', value)}
                      max={100}
                      min={0}
                      step={5}
                      className="w-full"
                    />
                    <div className="text-center">
                      <span className="text-2xl text-gray-900">{profile.lifestyle.dailyCommute}</span>
                      <span className="text-gray-600 ml-2">miles/day</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-8">
              <div className="mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-green-600" />
                </div>
                <h2 className="text-gray-900 mb-2">What powertrain do you prefer?</h2>
                <p className="text-gray-600">Consider fuel efficiency, environmental impact, and driving range.</p>
              </div>

              <RadioGroup
                value={profile.lifestyle.powerTrain}
                onValueChange={(value) => updateProfile('lifestyle', 'powerTrain', value)}
              >
                <div className="space-y-4">
                  {[
                    {
                      value: 'gas',
                      label: 'Gasoline',
                      desc: 'Traditional fuel, widely available',
                      icon: '⛽',
                      pros: ['Lower upfront cost', 'Quick refueling', 'Long range'],
                    },
                    {
                      value: 'hybrid',
                      label: 'Hybrid',
                      desc: 'Best of both worlds',
                      icon: '🔋',
                      pros: ['Great fuel economy', 'No charging needed', 'Lower emissions'],
                    },
                    {
                      value: 'electric',
                      label: 'Electric',
                      desc: 'Zero emissions, lowest running costs',
                      icon: '⚡',
                      pros: ['Lowest fuel cost', 'Zero emissions', 'Quiet & smooth'],
                    },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className={`flex items-start gap-4 p-6 border-2 rounded-lg cursor-pointer transition-all ${profile.lifestyle.powerTrain === option.value
                          ? 'border-red-600 bg-red-50'
                          : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                      <RadioGroupItem value={option.value} className="mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">{option.icon}</span>
                          <div className="text-gray-900">{option.label}</div>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{option.desc}</p>
                        <div className="flex flex-wrap gap-2">
                          {option.pros.map((pro) => (
                            <span
                              key={pro}
                              className="text-xs bg-white px-2 py-1 rounded border border-gray-200"
                            >
                              <Check className="w-3 h-3 inline mr-1 text-green-600" />
                              {pro}
                            </span>
                          ))}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </RadioGroup>
            </Card>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-8">
              <div className="mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-gray-900 mb-2">What's your budget?</h2>
                <p className="text-gray-600">Help us find vehicles within your price range.</p>
              </div>

              <div className="space-y-6">
                {/* Target Monthly Payment */}
                <div>
                  <Label className="mb-3 block">Target Monthly Payment</Label>
                  <div className="space-y-3">
                    <Slider
                      value={[profile.financial.targetPayment]}
                      onValueChange={([value]) => updateProfile('financial', 'targetPayment', value)}
                      max={1500}
                      min={200}
                      step={50}
                      className="w-full"
                    />
                    <div className="text-center">
                      <span className="text-2xl text-gray-900">${profile.financial.targetPayment}</span>
                      <span className="text-gray-600 ml-2">per month</span>
                    </div>
                  </div>
                </div>

                {/* Down Payment */}
                <div>
                  <Label className="mb-3 block">
                    Down Payment (Optional)
                  </Label>
                  <div className="space-y-3">
                    <Slider
                      value={[profile.financial.downPayment]}
                      onValueChange={([value]) => updateProfile('financial', 'downPayment', value)}
                      max={15000}
                      min={0}
                      step={500}
                      className="w-full"
                    />
                    <div className="text-center">
                      <span className="text-2xl text-gray-900">${profile.financial.downPayment.toLocaleString()}</span>
                      <span className="text-gray-600 ml-2">down payment</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    A larger down payment can lower your monthly payments
                  </p>
                </div>

                {/* Credit Score */}
                <div>
                  <Label className="mb-3 block">Credit Score Range</Label>
                  <RadioGroup
                    value={profile.financial.creditScore}
                    onValueChange={(value) => updateProfile('financial', 'creditScore', value)}
                  >
                    <div className="space-y-3">
                      {[
                        { value: 'excellent', label: 'Excellent (750+)', rate: '~4% APR' },
                        { value: 'good', label: 'Good (700-749)', rate: '~6% APR' },
                        { value: 'fair', label: 'Fair (650-699)', rate: '~9% APR' },
                        { value: 'poor', label: 'Poor (<650)', rate: '~12% APR' },
                      ].map((option) => (
                        <label
                          key={option.value}
                          className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-all ${profile.financial.creditScore === option.value
                              ? 'border-red-600 bg-red-50'
                              : 'border-gray-200 hover:border-gray-300'
                            }`}
                        >
                          <div className="flex items-center gap-3">
                            <RadioGroupItem value={option.value} />
                            <span className="text-gray-900">{option.label}</span>
                          </div>
                          <span className="text-sm text-gray-600">{option.rate}</span>
                        </label>
                      ))}
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={step === 1}
          className="gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </Button>

        <Button
          onClick={handleNext}
          disabled={!isStepValid()}
          className="gap-2 bg-red-600 text-white hover:bg-red-700 hover:text-white"
        >
          {step === totalSteps ? 'View Matches' : 'Next'}
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
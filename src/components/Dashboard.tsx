import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Car, GraduationCap, Gift, Calendar, Home, ChevronRight, Sparkles, MessageSquare, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import QuestionnaireFlow from './QuestionnaireFlow';
import VehicleRecommendations from './VehicleRecommendations';
import Vehicles from './Vehicles';
import EducationalHub from './EducationalHub';
import LeaseEndAssistance from './LeaseEndAssistance';
import IncentivesProgram from './IncentivesProgram';
import AppointmentScheduler from './AppointmentScheduler';
import BlogSection from './BlogSection';
import Discussion from './Discussion';
import FinancingCalculator from './FinancingCalculator';
import ChatBot from './ChatBot';
import iotaLogo from '../assets/logo.jpeg';

export type UserProfile = {
  lifestyle: {
    dailyCommute: number;
    passengers: number;
    vehicleType: 'sedan' | 'suv' | '';
    powerTrain: 'electric' | 'hybrid' | 'gas' | '';
    primaryUse: string;
    parkingType: string;
  };
  financial: {
    monthlyIncome: number;
    targetPayment: number;
    downPayment: number;
    creditScore: string;
    multipleOwners: boolean;
  };
  completed: boolean;
};

type Section = 'home' | 'questionnaire' | 'recommendations' | 'calculator' | 'showroom' | 'education' | 'lease-end' | 'incentives' | 'appointment' | 'blog' | 'discussion';

export type SelectedVehicle = {
  model: string;
  trim: string;
  year: number;
  msrp: number;
  mpg_city: number;
  mpg_highway: number;
};

export default function App() {
  const { user, signOut } = useAuth();
  const [currentSection, setCurrentSection] = useState<Section>('home');
  const [selectedVehicle, setSelectedVehicle] = useState<SelectedVehicle | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    lifestyle: {
      dailyCommute: 0,
      passengers: 1,
      vehicleType: '',
      powerTrain: '',
      primaryUse: '',
      parkingType: '',
    },
    financial: {
      monthlyIncome: 0,
      targetPayment: 0,
      downPayment: 0,
      creditScore: '',
      multipleOwners: false,
    },
    completed: false,
  });

  // Scroll to top whenever section changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentSection]);

  const handleQuestionnaireComplete = (profile: UserProfile) => {
    setUserProfile(profile);
    setCurrentSection('recommendations');
  };

  const handleCalculatePayments = (vehicle: SelectedVehicle) => {
    setSelectedVehicle(vehicle);
    setCurrentSection('calculator');
  };

  const navigation = [
    { id: 'home' as Section, label: 'Home', icon: Home },
    { id: 'questionnaire' as Section, label: 'Find Your Match', icon: Sparkles },
    { id: 'showroom' as Section, label: 'Vehicles', icon: Car },
    { id: 'education' as Section, label: 'Learn', icon: GraduationCap },
    { id: 'discussion' as Section, label: 'Community', icon: MessageSquare },
    { id: 'incentives' as Section, label: 'Rewards', icon: Gift },
    { id: 'appointment' as Section, label: 'Book Appointment', icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-8">
            <motion.div 
              className="flex items-center gap-3 cursor-pointer flex-shrink-0"
              onClick={() => setCurrentSection('home')}
              whileHover={{ scale: 1.02 }}
            >
              <img 
                src={iotaLogo} 
                alt="Iota Financial Solutions" 
                className="h-10 w-auto rounded-lg"
              />
              <div>
                <h1 className="text-red-600">Iota Financial Solutions</h1>
                {/* <p className="text-xs text-gray-500">Your Journey, Simplified</p> */}
              </div>
            </motion.div>
            
            <nav className="hidden md:flex flex-1 items-center justify-center gap-1">
              {navigation.map((item) => (
                <Button
                  key={item.id}
                  variant="ghost"
                  onClick={() => setCurrentSection(item.id)}
                  className={`gap-2 rounded-full transition-all ${
                    currentSection === item.id 
                      ? 'bg-gray-900 text-white hover:bg-gray-900' 
                      : 'text-black hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Button>
              ))}
            </nav>

            <Button
              className="md:hidden flex-shrink-0"
              variant="outline"
              onClick={() => setCurrentSection(currentSection === 'home' ? 'questionnaire' : 'home')}
            >
              Menu
            </Button>
            <div className="flex items-center gap-3">
              <div className="hidden md:block text-sm text-gray-600">
                {user?.user_metadata?.name || user?.email}
              </div>
              <Button 
                variant="outline"
                size="sm"
                onClick={signOut}
                className="gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden md:inline">Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {currentSection === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <HomeSection 
                onStartQuestionnaire={() => setCurrentSection('questionnaire')} 
                onNavigate={setCurrentSection}
              />
            </motion.div>
          )}

          {currentSection === 'questionnaire' && (
            <motion.div
              key="questionnaire"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <QuestionnaireFlow onComplete={handleQuestionnaireComplete} />
            </motion.div>
          )}

          {currentSection === 'recommendations' && (
            <motion.div
              key="recommendations"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <VehicleRecommendations 
                userProfile={userProfile}
                onScheduleAppointment={() => setCurrentSection('appointment')}
              />
            </motion.div>
          )}

          {currentSection === 'calculator' && (
            <motion.div
              key="calculator"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <FinancingCalculator userProfile={userProfile} selectedVehicle={selectedVehicle} />
            </motion.div>
          )}

          {currentSection === 'showroom' && (
            <motion.div
              key="showroom"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Vehicles onCalculatePayments={handleCalculatePayments} />
            </motion.div>
          )}

          {currentSection === 'education' && (
            <motion.div
              key="education"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <EducationalHub />
            </motion.div>
          )}

          {currentSection === 'lease-end' && (
            <motion.div
              key="lease-end"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <LeaseEndAssistance />
            </motion.div>
          )}

          {currentSection === 'discussion' && (
            <motion.div
              key="discussion"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Discussion />
            </motion.div>
          )}

          {currentSection === 'incentives' && (
            <motion.div
              key="incentives"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <IncentivesProgram />
            </motion.div>
          )}

          {currentSection === 'appointment' && (
            <motion.div
              key="appointment"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <AppointmentScheduler />
            </motion.div>
          )}

          {currentSection === 'blog' && (
            <motion.div
              key="blog"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <BlogSection />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ChatBot available on all dashboard pages */}
      <ChatBot />
    </div>
  );
}

function HomeSection({ onStartQuestionnaire, onNavigate }: { onStartQuestionnaire: () => void; onNavigate: (section: Section) => void }) {
  const features = [
    {
      icon: Car,
      title: 'Browse Vehicles',
      description: 'Explore our complete lineup with pricing and financing calculator',
      action: 'View Vehicles',
      onClick: () => onNavigate('showroom'),
    },
    {
      icon: GraduationCap,
      title: 'Learn & Educate',
      description: 'Understand financing terms, leasing benefits, and make informed decisions',
      action: 'Start Learning',
      onClick: () => onNavigate('education'),
    },
    {
      icon: Gift,
      title: 'Rewards Program',
      description: 'Earn gas rewards, rental car discounts, and exclusive partner benefits',
      action: 'View Rewards',
      onClick: () => onNavigate('incentives'),
    },
    {
      icon: MessageSquare,
      title: 'Community Blogs',
      description: 'Get in touch with our community and share experiences through blogs and discussions',
      action: 'Read Blogs',
      onClick: () => onNavigate('blog'),
    },
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <motion.div 
        className="relative overflow-hidden rounded-3xl text-white p-12 md:p-16"
        style={{ background: 'linear-gradient(to right, #dc2626, #7b0e0eff)' }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative z-10 max-w-3xl">
          <motion.h2
            className="text-white mb-4 text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Find Your Perfect Vehicle
          </motion.h2>
          <motion.p 
            className="mt-6 md:mt-8 text-xl text-red-50 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Discover personalized financing and leasing options designed around your life. 
            Whether you're commuting daily or planning family road trips, we'll help you find the right vehicle and payment plan.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Button 
              size="lg" 
              className="bg-white text-red-600 hover:bg-red-50 gap-2 group"
              onClick={onStartQuestionnaire}
            >
              Get Started
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-red-600" />
        </div>
      </motion.div>

      {/* Our Services Section */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="text-gray-900 inline-block border-b-2 border-red-600 pb-2">Our Services</h3>
      </motion.div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            whileHover={{ scale: 1.02, y: -4 }}
            className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 cursor-pointer"
            onClick={feature.onClick}
          >
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
              <feature.icon className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-gray-900 mb-2">{feature.title}</h3>
            <p className="text-gray-600 mb-4">{feature.description}</p>
            <Button variant="ghost" className="gap-2 group p-0 h-auto">
              {feature.action}
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        ))}
      </div>

      {/* Value Propositions */}
      <motion.div
        className="text-center mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h3 className="text-gray-900 inline-block border-b-2 border-red-600 pb-2">Why Choose Iota Financial Solutions?</h3>
      </motion.div>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
          <div className="text-red-600 mb-2">Transparent Pricing</div>
          <p className="text-sm text-gray-600">Clear, upfront costs with no hidden fees. See your total cost of ownership before you commit.</p>
        </div>
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
          <div className="text-red-600 mb-2">Flexible Options</div>
          <p className="text-sm text-gray-600">Customized lease and finance packages based on your mileage, usage, and upgrade preferences.</p>
        </div>
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
          <div className="text-red-600 mb-2">Digital-First</div>
          <p className="text-sm text-gray-600">Complete paperwork online, schedule visits, and manage your account from anywhere.</p>
        </div>
      </div>
    </div>
  );
}

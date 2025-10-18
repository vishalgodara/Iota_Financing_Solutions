import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Car, RotateCw, ZoomIn, ZoomOut, Eye, Info, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ImageWithFallback } from './figma/ImageWithFallback';

type Props = {
  onScheduleVisit: () => void;
};

type Vehicle = {
  id: string;
  name: string;
  category: string;
  colors: string[];
  interiorImages: string[];
  exteriorImages: string[];
  features: { category: string; items: string[] }[];
  specs: { label: string; value: string }[];
};

export default function VirtualShowroom({ onScheduleVisit }: Props) {
  const [selectedVehicle, setSelectedVehicle] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [viewMode, setViewMode] = useState<'exterior' | 'interior'>('exterior');
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [showInfo, setShowInfo] = useState(false);

  const vehicles: Vehicle[] = [
    {
      id: 'rav4',
      name: 'RAV4 Hybrid',
      category: 'SUV',
      colors: ['Magnetic Gray', 'Blueprint', 'Cavalry Blue', 'Super White'],
      exteriorImages: [
        'https://images.unsplash.com/photo-1707726149138-879308167d60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b3lvdGElMjBzdXYlMjBtb2Rlcm58ZW58MXx8fHwxNzYwODI0ODcxfDA&ixlib=rb-4.1.0&q=80&w=1080',
      ],
      interiorImages: [
        'https://images.unsplash.com/photo-1686082260106-d650d2aabab5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBzaG93cm9vbSUyMGludGVyaW9yfGVufDF8fHx8MTc2MDgyNDg3Mnww&ixlib=rb-4.1.0&q=80&w=1080',
      ],
      features: [
        {
          category: 'Safety',
          items: ['Pre-Collision System', 'Lane Departure Alert', 'Adaptive Cruise Control', 'Blind Spot Monitor'],
        },
        {
          category: 'Technology',
          items: ['8" Touchscreen', 'Apple CarPlay', 'Android Auto', 'Amazon Alexa', 'Wireless Charging'],
        },
        {
          category: 'Comfort',
          items: ['Heated Front Seats', 'Power Driver Seat', 'Dual-Zone Climate', 'Power Liftgate'],
        },
      ],
      specs: [
        { label: 'Engine', value: '2.5L Hybrid' },
        { label: 'Horsepower', value: '219 hp' },
        { label: 'MPG', value: '41 city / 38 hwy' },
        { label: 'Seating', value: '5 passengers' },
        { label: 'Cargo', value: '37.6 cu ft' },
      ],
    },
    {
      id: 'camry',
      name: 'Camry Hybrid',
      category: 'Sedan',
      colors: ['Celestial Silver', 'Wind Chill Pearl', 'Supersonic Red', 'Midnight Black'],
      exteriorImages: [
        'https://images.unsplash.com/photo-1648197323414-4255ea82d86b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b3lvdGElMjBzZWRhbiUyMGNhcnxlbnwxfHx8fDE3NjA4MjQ4NzF8MA&ixlib=rb-4.1.0&q=80&w=1080',
      ],
      interiorImages: [
        'https://images.unsplash.com/photo-1686082260106-d650d2aabab5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBzaG93cm9vbSUyMGludGVyaW9yfGVufDF8fHx8MTc2MDgyNDg3Mnww&ixlib=rb-4.1.0&q=80&w=1080',
      ],
      features: [
        {
          category: 'Safety',
          items: ['Toyota Safety Sense 3.0', 'Rear Cross-Traffic Alert', 'Parking Assist', '10 Airbags'],
        },
        {
          category: 'Technology',
          items: ['12.3" Touchscreen', 'JBL Audio', 'Head-Up Display', 'Digital Rearview Mirror'],
        },
        {
          category: 'Comfort',
          items: ['Ventilated Seats', 'Panoramic Roof', 'Ambient Lighting', 'Premium Materials'],
        },
      ],
      specs: [
        { label: 'Engine', value: '2.5L Hybrid' },
        { label: 'Horsepower', value: '208 hp' },
        { label: 'MPG', value: '51 city / 53 hwy' },
        { label: 'Seating', value: '5 passengers' },
        { label: 'Trunk', value: '15.1 cu ft' },
      ],
    },
  ];

  const currentVehicle = vehicles[selectedVehicle];
  const currentImages = viewMode === 'exterior' ? currentVehicle.exteriorImages : currentVehicle.interiorImages;

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.2, 2));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.2, 1));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Car className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-gray-900 mb-2">Virtual Showroom</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explore our vehicles from every angle. View interiors, exteriors, and all features without leaving home.
        </p>
      </motion.div>

      {/* Vehicle Selector */}
      <div className="flex gap-4 justify-center">
        {vehicles.map((vehicle, index) => (
          <button
            key={vehicle.id}
            onClick={() => {
              setSelectedVehicle(index);
              setRotation(0);
              setZoom(1);
            }}
            className={`px-6 py-3 rounded-xl transition-all ${
              selectedVehicle === index
                ? 'bg-red-600 text-white shadow-lg'
                : 'bg-white text-gray-700 border border-gray-200 hover:border-red-300'
            }`}
          >
            <div className="text-sm">{vehicle.category}</div>
            <div>{vehicle.name}</div>
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Viewer */}
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            {/* View Mode Tabs */}
            <div className="bg-gray-50 border-b border-gray-200 p-4">
              <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'exterior' | 'interior')}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="exterior">Exterior</TabsTrigger>
                  <TabsTrigger value="interior">Interior</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Image Viewer */}
            <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 aspect-video">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${selectedVehicle}-${viewMode}-${selectedColor}`}
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: 1,
                    rotate: rotation,
                    scale: zoom,
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 flex items-center justify-center p-8"
                >
                  <ImageWithFallback
                    src={currentImages[0]}
                    alt={currentVehicle.name}
                    className="max-w-full max-h-full object-contain"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Controls Overlay */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <Button
                  size="icon"
                  variant="secondary"
                  onClick={handleRotate}
                  className="bg-white/90 backdrop-blur"
                >
                  <RotateCw className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  variant="secondary"
                  onClick={handleZoomIn}
                  className="bg-white/90 backdrop-blur"
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  variant="secondary"
                  onClick={handleZoomOut}
                  className="bg-white/90 backdrop-blur"
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
              </div>

              {/* Info Toggle */}
              <div className="absolute bottom-4 left-4">
                <Button
                  variant="secondary"
                  onClick={() => setShowInfo(!showInfo)}
                  className="gap-2 bg-white/90 backdrop-blur"
                >
                  <Info className="w-4 h-4" />
                  {showInfo ? 'Hide' : 'Show'} Details
                </Button>
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={() => setSelectedColor((prev) => (prev - 1 + currentVehicle.colors.length) % currentVehicle.colors.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center hover:bg-white transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setSelectedColor((prev) => (prev + 1) % currentVehicle.colors.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center hover:bg-white transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Color Selector */}
            <div className="p-4 bg-white border-t border-gray-200">
              <div className="text-sm text-gray-600 mb-3">Available Colors</div>
              <div className="flex gap-3">
                {currentVehicle.colors.map((color, index) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(index)}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      selectedColor === index
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* 360° Tour CTA */}
            <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-700">Want a full 360° virtual tour?</div>
                  <div className="text-xs text-gray-600">Get an immersive experience with our 3D viewer</div>
                </div>
                <Button className="gap-2">
                  <Play className="w-4 h-4" />
                  Start Tour
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Details Panel */}
        <div className="space-y-4">
          {/* Specs */}
          <Card className="p-6">
            <h3 className="text-gray-900 mb-4">Specifications</h3>
            <div className="space-y-3">
              {currentVehicle.specs.map((spec) => (
                <div key={spec.label} className="flex justify-between items-center pb-3 border-b border-gray-100 last:border-0">
                  <span className="text-sm text-gray-600">{spec.label}</span>
                  <span className="text-sm text-gray-900">{spec.value}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Features */}
          <Card className="p-6">
            <h3 className="text-gray-900 mb-4">Features</h3>
            <div className="space-y-4">
              {currentVehicle.features.map((category) => (
                <div key={category.category}>
                  <div className="text-sm text-red-600 mb-2">{category.category}</div>
                  <div className="space-y-1">
                    {category.items.map((item) => (
                      <div key={item} className="text-xs text-gray-600 flex items-center gap-2">
                        <div className="w-1 h-1 bg-gray-400 rounded-full" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Actions */}
          <Card className="p-6">
            <h3 className="text-gray-900 mb-4">Next Steps</h3>
            <div className="space-y-3">
              <Button onClick={onScheduleVisit} className="w-full justify-between group">
                Schedule Test Drive
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" className="w-full justify-between group">
                Get Price Quote
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" className="w-full justify-between group">
                Compare Models
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </Card>

          {/* Virtual Appointment Info */}
          <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Eye className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h4 className="text-green-900 mb-1">Virtual Consultation</h4>
                <p className="text-xs text-green-800 mb-3">
                  Connect with a product specialist via video call to explore this vehicle in real-time
                </p>
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  Book Video Call
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Additional Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200"
      >
        <h3 className="text-gray-900 mb-6">Why Use Our Virtual Showroom?</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <div className="text-red-600 mb-2">🏠 From Home Convenience</div>
            <p className="text-sm text-gray-600">Explore vehicles 24/7 from anywhere, on any device</p>
          </div>
          <div>
            <div className="text-red-600 mb-2">🔍 Every Detail</div>
            <p className="text-sm text-gray-600">See high-resolution images of exterior, interior, and features</p>
          </div>
          <div>
            <div className="text-red-600 mb-2">💬 Expert Guidance</div>
            <p className="text-sm text-gray-600">Connect with specialists for personalized walkthroughs</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

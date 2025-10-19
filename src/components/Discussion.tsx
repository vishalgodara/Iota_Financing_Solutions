import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, ThumbsUp, Reply, Filter, Search, TrendingUp, CheckCircle } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Separator } from './ui/separator';

type Discussion = {
  id: number;
  author: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  vehicle: string;
  vehicleType: 'sedan' | 'suv';
  powerTrain: 'electric' | 'hybrid' | 'gas';
  dailyCommute: number;
  monthlyIncome: number;
  title: string;
  content: string;
  category: 'Review' | 'Question' | 'Suggestion' | 'Experience';
  likes: number;
  replies: number;
  date: string;
  tags: string[];
  hasLiked?: boolean;
};

export default function Discussion() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showNewPost, setShowNewPost] = useState(false);
  const [likedPosts, setLikedPosts] = useState<number[]>([]);
  const [filters, setFilters] = useState({
    vehicle: 'all',
    vehicleType: 'all',
    powerTrain: 'all',
    dailyCommute: 'all',
    monthlyIncome: 'all',
    category: 'all',
  });

  const discussions: Discussion[] = [
    {
      id: 1,
      author: {
        name: 'Sarah M.',
        avatar: '',
        verified: true,
      },
      vehicle: 'RAV4 Hybrid',
      vehicleType: 'suv',
      powerTrain: 'hybrid',
      dailyCommute: 45,
      monthlyIncome: 6500,
      title: 'Best decision I made - RAV4 Hybrid review after 6 months',
      content: 'I was torn between leasing and financing, but after using the calculator here, I decided to lease. My commute is about 45 miles daily, and the fuel savings have been incredible. Getting 40+ MPG consistently. The monthly payment fits perfectly in my budget at $429/month. Highly recommend for anyone with a similar commute!',
      category: 'Review',
      likes: 24,
      replies: 8,
      date: '2 days ago',
      tags: ['Long Commute', 'Fuel Savings', 'Lease'],
    },
    {
      id: 2,
      author: {
        name: 'Mike J.',
        avatar: '',
        verified: false,
      },
      vehicle: 'Camry Hybrid',
      vehicleType: 'sedan',
      powerTrain: 'hybrid',
      dailyCommute: 25,
      monthlyIncome: 5000,
      title: 'Question: Is the Camry Hybrid worth it for short commutes?',
      content: 'My daily commute is only 25 miles. I\'m debating between the regular Camry and the Hybrid. The hybrid is about $50 more per month. For those with similar commutes, did you find the fuel savings worth the extra cost?',
      category: 'Question',
      likes: 12,
      replies: 15,
      date: '3 days ago',
      tags: ['Short Commute', 'Cost Comparison'],
    },
    {
      id: 3,
      author: {
        name: 'Jennifer L.',
        avatar: '',
        verified: true,
      },
      vehicle: 'bZ4X',
      vehicleType: 'suv',
      powerTrain: 'electric',
      dailyCommute: 60,
      monthlyIncome: 8500,
      title: 'Electric vehicle charging - my experience so far',
      content: 'Switched to the bZ4X three months ago. With a 60-mile daily commute, I charge at home every night. The $7,500 federal credit made a huge difference. My electricity cost is about $40/month vs the $280 I was spending on gas. Total game changer!',
      category: 'Experience',
      likes: 31,
      replies: 12,
      date: '5 days ago',
      tags: ['Electric', 'Charging', 'Savings'],
    },
    {
      id: 4,
      author: {
        name: 'David R.',
        avatar: '',
        verified: false,
      },
      vehicle: 'Corolla Hybrid',
      vehicleType: 'sedan',
      powerTrain: 'hybrid',
      dailyCommute: 15,
      monthlyIncome: 4200,
      title: 'Perfect for first-time buyers on a budget',
      content: 'Just got my Corolla Hybrid and couldn\'t be happier. The $289/month lease fits my budget perfectly. Insurance is reasonable too. For anyone making around $4-5k/month and looking for reliability without breaking the bank, this is it.',
      category: 'Review',
      likes: 18,
      replies: 6,
      date: '1 week ago',
      tags: ['Budget Friendly', 'First Car'],
    },
    {
      id: 5,
      author: {
        name: 'Amanda K.',
        avatar: '',
        verified: true,
      },
      vehicle: 'Highlander',
      vehicleType: 'suv',
      powerTrain: 'gas',
      dailyCommute: 10,
      monthlyIncome: 9000,
      title: 'Suggestion: Add more family-focused content',
      content: 'Love the platform! One suggestion - would be great to see more content focused on families. Things like car seat compatibility, cargo space comparisons, safety ratings for families with kids. The RAV4 is great but we needed the Highlander for our family of 5.',
      category: 'Suggestion',
      likes: 27,
      replies: 9,
      date: '1 week ago',
      tags: ['Family', 'Feature Request'],
    },
    {
      id: 6,
      author: {
        name: 'Carlos P.',
        avatar: '',
        verified: false,
      },
      vehicle: 'RAV4 Hybrid',
      vehicleType: 'suv',
      powerTrain: 'hybrid',
      dailyCommute: 70,
      monthlyIncome: 7200,
      title: 'Long commute warriors - hybrid is the way',
      content: 'Driving 70 miles each way daily. The RAV4 Hybrid has saved me over $300/month in gas compared to my old truck. Even with the higher monthly payment, I\'m still coming out ahead. Plus the rewards program gas discounts are a nice bonus!',
      category: 'Experience',
      likes: 22,
      replies: 11,
      date: '2 weeks ago',
      tags: ['Long Commute', 'Gas Savings'],
    },
  ];

  const toggleLike = (id: number) => {
    setLikedPosts((prev) =>
      prev.includes(id) ? prev.filter((postId) => postId !== id) : [...prev, id]
    );
  };

  const filteredDiscussions = discussions.filter((discussion) => {
    // Search filter
    if (searchQuery && !discussion.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !discussion.content.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Vehicle filter
    if (filters.vehicle !== 'all' && discussion.vehicle !== filters.vehicle) {
      return false;
    }

    // Vehicle type filter
    if (filters.vehicleType !== 'all' && discussion.vehicleType !== filters.vehicleType) {
      return false;
    }

    // PowerTrain filter
    if (filters.powerTrain !== 'all' && discussion.powerTrain !== filters.powerTrain) {
      return false;
    }

    // Daily commute filter
    if (filters.dailyCommute !== 'all') {
      const commuteRange = filters.dailyCommute;
      if (commuteRange === 'short' && discussion.dailyCommute > 25) return false;
      if (commuteRange === 'medium' && (discussion.dailyCommute <= 25 || discussion.dailyCommute > 50)) return false;
      if (commuteRange === 'long' && discussion.dailyCommute <= 50) return false;
    }

    // Monthly income filter
    if (filters.monthlyIncome !== 'all') {
      const incomeRange = filters.monthlyIncome;
      if (incomeRange === 'low' && discussion.monthlyIncome > 5000) return false;
      if (incomeRange === 'medium' && (discussion.monthlyIncome <= 5000 || discussion.monthlyIncome > 8000)) return false;
      if (incomeRange === 'high' && discussion.monthlyIncome <= 8000) return false;
    }

    // Category filter
    if (filters.category !== 'all' && discussion.category !== filters.category) {
      return false;
    }

    return true;
  });

  const resetFilters = () => {
    setFilters({
      vehicle: 'all',
      vehicleType: 'all',
      powerTrain: 'all',
      dailyCommute: 'all',
      monthlyIncome: 'all',
      category: 'all',
    });
  };

  const activeFilterCount = Object.values(filters).filter((v) => v !== 'all').length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <MessageSquare className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-black text-2xl mb-2">Community Discussions</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Share your experience, ask questions, and learn from other vehicle owners and buyers
        </p>
      </motion.div>

      {/* Search and Actions */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search discussions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
          >
            <Filter className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && (
              <Badge className="ml-1 bg-red-600">{activeFilterCount}</Badge>
            )}
          </Button>
          <Button onClick={() => setShowNewPost(!showNewPost)} className="gap-2">
            <MessageSquare className="w-4 h-4" />
            New Discussion
          </Button>
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <Separator className="my-6" />
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm text-gray-700 mb-2 block">Vehicle</label>
                  <Select
                    value={filters.vehicle}
                    onValueChange={(value) => setFilters({ ...filters, vehicle: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Vehicles</SelectItem>
                      <SelectItem value="RAV4 Hybrid">RAV4 Hybrid</SelectItem>
                      <SelectItem value="Camry Hybrid">Camry Hybrid</SelectItem>
                      <SelectItem value="Corolla Hybrid">Corolla Hybrid</SelectItem>
                      <SelectItem value="bZ4X">bZ4X</SelectItem>
                      <SelectItem value="Highlander">Highlander</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm text-gray-700 mb-2 block">Vehicle Type</label>
                  <Select
                    value={filters.vehicleType}
                    onValueChange={(value) => setFilters({ ...filters, vehicleType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="sedan">Sedan</SelectItem>
                      <SelectItem value="suv">SUV</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm text-gray-700 mb-2 block">PowerTrain</label>
                  <Select
                    value={filters.powerTrain}
                    onValueChange={(value) => setFilters({ ...filters, powerTrain: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="electric">Electric</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                      <SelectItem value="gas">Gas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm text-gray-700 mb-2 block">Daily Commute</label>
                  <Select
                    value={filters.dailyCommute}
                    onValueChange={(value) => setFilters({ ...filters, dailyCommute: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Distances</SelectItem>
                      <SelectItem value="short">Short (&lt;25 mi)</SelectItem>
                      <SelectItem value="medium">Medium (25-50 mi)</SelectItem>
                      <SelectItem value="long">Long (&gt;50 mi)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm text-gray-700 mb-2 block">Monthly Income</label>
                  <Select
                    value={filters.monthlyIncome}
                    onValueChange={(value) => setFilters({ ...filters, monthlyIncome: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Ranges</SelectItem>
                      <SelectItem value="low">&lt;$5,000</SelectItem>
                      <SelectItem value="medium">$5,000-$8,000</SelectItem>
                      <SelectItem value="high">&gt;$8,000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm text-gray-700 mb-2 block">Category</label>
                  <Select
                    value={filters.category}
                    onValueChange={(value) => setFilters({ ...filters, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="Review">Reviews</SelectItem>
                      <SelectItem value="Question">Questions</SelectItem>
                      <SelectItem value="Suggestion">Suggestions</SelectItem>
                      <SelectItem value="Experience">Experiences</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {activeFilterCount > 0 && (
                <div className="mt-4 flex justify-end">
                  <Button variant="ghost" onClick={resetFilters} size="sm">
                    Clear All Filters
                  </Button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* New Post Form */}
      <AnimatePresence>
        {showNewPost && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="p-6">
              <h3 className="text-gray-900 mb-4">Start a New Discussion</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-700 mb-2 block">Title</label>
                  <Input placeholder="What's on your mind?" />
                </div>
                <div>
                  <label className="text-sm text-gray-700 mb-2 block">Content</label>
                  <Textarea
                    placeholder="Share your thoughts, questions, or experiences..."
                    rows={6}
                  />
                </div>
                <div className="flex gap-4">
                  <Button>Post Discussion</Button>
                  <Button variant="outline" onClick={() => setShowNewPost(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {filteredDiscussions.length} of {discussions.length} discussions
        </p>
        <Select defaultValue="recent">
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="popular">Most Popular</SelectItem>
            <SelectItem value="replies">Most Replies</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Discussions List */}
      <div className="space-y-4">
        {filteredDiscussions.map((discussion, index) => (
          <motion.div
            key={discussion.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="p-6 hover:shadow-md transition-shadow">
              <div className="flex gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={discussion.author.avatar} />
                  <AvatarFallback className="bg-red-100 text-red-600">
                    {discussion.author.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-gray-900">{discussion.title}</h4>
                        <Badge variant="secondary">{discussion.category}</Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                        <span>{discussion.author.name}</span>
                        {discussion.author.verified && (
                          <CheckCircle className="w-4 h-4 text-blue-600" />
                        )}
                        <span>•</span>
                        <span>{discussion.date}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4">{discussion.content}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="outline" className="text-xs">
                      {discussion.vehicle}
                    </Badge>
                    <Badge variant="outline" className="text-xs capitalize">
                      {discussion.powerTrain}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {discussion.dailyCommute} mi commute
                    </Badge>
                    {discussion.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleLike(discussion.id)}
                      className={`gap-2 ${
                        likedPosts.includes(discussion.id) ? 'text-red-600' : 'text-gray-600'
                      }`}
                    >
                      <ThumbsUp
                        className={`w-4 h-4 ${
                          likedPosts.includes(discussion.id) ? 'fill-red-600' : ''
                        }`}
                      />
                      {discussion.likes + (likedPosts.includes(discussion.id) ? 1 : 0)}
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-2 text-gray-600">
                      <Reply className="w-4 h-4" />
                      {discussion.replies} Replies
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}

        {filteredDiscussions.length === 0 && (
          <Card className="p-12 text-center">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-gray-900 mb-2">No discussions found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your filters or be the first to start a discussion!
            </p>
            <Button onClick={() => setShowNewPost(true)}>Start a Discussion</Button>
          </Card>
        )}
      </div>

      {/* Community Stats */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <h3 className="text-gray-900 mb-4">Community Insights</h3>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl text-gray-900 mb-1">1,247</div>
            <div className="text-sm text-gray-600">Active Members</div>
          </div>
          <div className="text-center">
            <div className="text-3xl text-gray-900 mb-1">523</div>
            <div className="text-sm text-gray-600">Discussions</div>
          </div>
          <div className="text-center">
            <div className="text-3xl text-gray-900 mb-1">3,891</div>
            <div className="text-sm text-gray-600">Helpful Replies</div>
          </div>
          <div className="text-center">
            <div className="text-3xl text-gray-900 mb-1">4.8/5</div>
            <div className="text-sm text-gray-600">Avg. Satisfaction</div>
          </div>
        </div>
      </Card>
    </div>
  );
}

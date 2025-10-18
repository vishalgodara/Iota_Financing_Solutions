import { motion } from 'motion/react';
import { BookOpen, Clock, User, ArrowRight } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';

export default function BlogSection() {
  const posts = [
    {
      id: 1,
      title: 'Electric vs Hybrid: Which Toyota is Right for Your Commute?',
      excerpt: 'Understanding the difference between electric and hybrid vehicles can help you make the best choice for your daily driving needs and budget.',
      image: 'https://images.unsplash.com/photo-1593941707874-ef25b8b4a92b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpYyUyMGNhciUyMGNoYXJnaW5nfGVufDF8fHx8MTc2MDc4NjA5Nnww&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Vehicle Guide',
      author: 'Sarah Johnson',
      date: 'Oct 10, 2025',
      readTime: '5 min read',
      featured: true,
    },
    {
      id: 2,
      title: '5 Tips to Maximize Your Lease Return Value',
      excerpt: 'Learn how to avoid excessive wear and tear charges and get the most value when returning your leased vehicle.',
      image: 'https://images.unsplash.com/photo-1726245219702-1cc4defa78ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGZhbWlseSUyMGNhcnxlbnwxfHx8fDE3NjA3MjAyNjZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Leasing Tips',
      author: 'Michael Chen',
      date: 'Oct 8, 2025',
      readTime: '4 min read',
      featured: false,
    },
    {
      id: 3,
      title: 'Understanding Your Credit Score: A Complete Guide',
      excerpt: 'Your credit score impacts your financing options. Here\'s everything you need to know to improve it before applying.',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5hbmNpYWwlMjBwbGFubmluZ3xlbnwxfHx8fDE3NjA4MDEzMDR8MA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Finance',
      author: 'Emily Rodriguez',
      date: 'Oct 5, 2025',
      readTime: '7 min read',
      featured: false,
    },
    {
      id: 4,
      title: 'The True Cost of Ownership: What to Consider Beyond Monthly Payments',
      excerpt: 'Monthly payments are just the beginning. Discover all the factors that contribute to your vehicle\'s total cost of ownership.',
      image: 'https://images.unsplash.com/photo-1707726149138-879308167d60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b3lvdGElMjBzdXYlMjBtb2Rlcm58ZW58MXx8fHwxNzYwODI0ODcxfDA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Finance',
      author: 'David Park',
      date: 'Oct 3, 2025',
      readTime: '6 min read',
      featured: false,
    },
    {
      id: 5,
      title: 'Toyota Safety Sense: Advanced Features Explained',
      excerpt: 'Modern Toyotas come packed with safety technology. Learn what each feature does and how it keeps you safe on the road.',
      image: 'https://images.unsplash.com/photo-1648197323414-4255ea82d86b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b3lvdGElMjBzZWRhbiUyMGNhcnxlbnwxfHx8fDE3NjA4MjQ4NzF8MA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Technology',
      author: 'Lisa Thompson',
      date: 'Sep 28, 2025',
      readTime: '5 min read',
      featured: false,
    },
    {
      id: 6,
      title: 'First-Time Buyer\'s Guide: Everything You Need to Know',
      excerpt: 'Buying your first car can be overwhelming. This comprehensive guide walks you through every step of the process.',
      image: 'https://images.unsplash.com/photo-1726245219702-1cc4defa78ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGZhbWlseSUyMGNhcnxlbnwxfHx8fDE3NjA3MjAyNjZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Buying Guide',
      author: 'James Wilson',
      date: 'Sep 25, 2025',
      readTime: '8 min read',
      featured: false,
    },
  ];

  const categories = ['All', 'Vehicle Guide', 'Finance', 'Leasing Tips', 'Technology', 'Buying Guide'];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <BookOpen className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-gray-900 mb-2">Finance & Vehicle Insights</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Expert advice, tips, and guides to help you make informed decisions about financing, leasing, and owning your Toyota.
        </p>
      </motion.div>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap justify-center">
        {categories.map((category) => (
          <Button key={category} variant="outline" size="sm">
            {category}
          </Button>
        ))}
      </div>

      {/* Featured Post */}
      {posts[0] && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="relative h-64 md:h-auto bg-gray-200">
                <ImageWithFallback
                  src={posts[0].image}
                  alt={posts[0].title}
                  className="w-full h-full object-cover"
                />
                <Badge className="absolute top-4 left-4 bg-red-600">Featured</Badge>
              </div>
              <div className="p-8 flex flex-col justify-center">
                <Badge variant="secondary" className="w-fit mb-3">
                  {posts[0].category}
                </Badge>
                <h3 className="text-gray-900 mb-3">{posts[0].title}</h3>
                <p className="text-gray-600 mb-4">{posts[0].excerpt}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {posts[0].author}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {posts[0].readTime}
                  </div>
                  <div>{posts[0].date}</div>
                </div>
                <Button className="gap-2 group w-fit">
                  Read Article
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Blog Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.slice(1).map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * (index + 1) }}
          >
            <Card className="overflow-hidden h-full flex flex-col hover:shadow-lg transition-shadow cursor-pointer group">
              <div className="relative h-48 bg-gray-200 overflow-hidden">
                <ImageWithFallback
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <Badge variant="secondary" className="w-fit mb-3">
                  {post.category}
                </Badge>
                <h4 className="text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                  {post.title}
                </h4>
                <p className="text-sm text-gray-600 mb-4 flex-1">{post.excerpt}</p>
                <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2">
                    <User className="w-3 h-3" />
                    {post.author}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3" />
                    {post.readTime}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center">
        <Button variant="outline" size="lg">
          Load More Articles
        </Button>
      </div>

      {/* Newsletter Signup */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="p-8 bg-gradient-to-r from-red-600 to-red-700 text-white text-center">
          <h3 className="text-white mb-2">Stay Updated</h3>
          <p className="text-red-50 mb-6 max-w-xl mx-auto">
            Get the latest financing tips, vehicle guides, and exclusive offers delivered to your inbox
          </p>
          <div className="flex gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900"
            />
            <Button className="bg-white text-red-600 hover:bg-red-50">
              Subscribe
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

import { TaskDisplayType } from "apps/hirecore-web/types/task";
import { Baby, Box, Car, ChefHat, Clock, Dog, GraduationCap, Hammer, Leaf, Lightbulb, MapPin, Paintbrush, Scissors, Search, Shield, Wrench, Zap } from "lucide-react";

export const SERVICES=[
    { icon: Wrench, name: 'Electricians', color: 'from-yellow-500 to-orange-500' },
    { icon: Paintbrush, name: 'Plumbers', color: 'from-blue-500 to-cyan-500' },
    { icon: Car, name: 'Drivers', color: 'from-green-500 to-emerald-500' },
    { icon: ChefHat, name: 'Cooks', color: 'from-red-500 to-pink-500' },
    { icon: Scissors, name: 'Seamstress', color: 'from-purple-500 to-violet-500' },
    { icon: Lightbulb, name: 'Cleaners', color: 'from-indigo-500 to-blue-500' },
    { icon: Hammer, name: 'Handyman', color: 'from-orange-500 to-red-500' },
    { icon: Leaf, name: 'Gardeners', color: 'from-lime-500 to-green-500' },
    { icon: Dog, name: 'Pet Sitters', color: 'from-amber-500 to-yellow-500' },
    { icon: GraduationCap, name: 'Tutors', color: 'from-cyan-500 to-sky-500' },
    { icon: Baby, name: 'Babysitters', color: 'from-pink-500 to-rose-500' },
    { icon: Box, name: 'Movers', color: 'from-slate-500 to-gray-500' },
  ];

  export const FEATURES = [
    {
      icon: MapPin,
      title: 'GPS Location Tracking',
      description: 'Find tasks and workers near you with precise GPS integration'
    },
    {
      icon: Clock,
      title: 'Flexible Scheduling',
      description: 'Choose between on-site visits or workshop appointments'
    },
    {
      icon: Shield,
      title: 'Secure Payments',
      description: 'Safe transactions using CØRE cryptocurrency tokens'
    },
    {
      icon: Zap,
      title: 'Instant Matching',
      description: 'AI-powered matching system for quick task completion'
    }
  ];

   export const MOCK_TASKS: TaskDisplayType[] = [
    {
      id: 1,
      title: 'Fix Kitchen Electrical Outlet',
      description: 'Need an electrician to fix a faulty outlet in my kitchen. The outlet stopped working yesterday.',
      category: 'electrician',
      location: 'Downtown',
      coordinates: { lat: 40.7128, lng: -74.0060 },
      budget: 150,
      timeEstimate: '2-3 hours',
      urgency: 'high',
      serviceType: 'on-site',
      rating: 4.8,
      reviews: 23,
      postedBy: 'Sarah M.',
      postedTime: '2 hours ago',
      skills: ['Electrical Repair', 'Safety Certified']
    },
    {
      id: 2,
      title: 'Bathroom Pipe Leak Repair',
      description: 'Urgent plumbing issue - pipe leak under bathroom sink needs immediate attention.',
      category: 'plumber',
      location: 'Midtown',
      coordinates: { lat: 40.7589, lng: -73.9851 },
      budget: 200,
      timeEstimate: '1-2 hours',
      urgency: 'urgent',
      serviceType: 'on-site',
      rating: 4.9,
      reviews: 45,
      postedBy: 'Mike R.',
      postedTime: '30 minutes ago',
      skills: ['Emergency Plumbing', 'Licensed']
    },
    {
      id: 3,
      title: 'Wedding Dress Alterations',
      description: 'Need professional alterations for wedding dress. Hemming and waist adjustments required.',
      category: 'seamstress',
      location: 'Uptown',
      coordinates: { lat: 40.7831, lng: -73.9712 },
      budget: 120,
      timeEstimate: '3-4 hours',
      urgency: 'medium',
      serviceType: 'workshop',
      rating: 4.7,
      reviews: 67,
      postedBy: 'Emma L.',
      postedTime: '1 day ago',
      skills: ['Formal Wear', 'Custom Fitting']
    },
    {
      id: 4,
      title: 'Airport Pickup Service',
      description: 'Need reliable driver for airport pickup. Flight arrives at 6 PM tomorrow.',
      category: 'driver',
      location: 'Airport Area',
      coordinates: { lat: 40.6413, lng: -73.7781 },
      budget: 80,
      timeEstimate: '1 hour',
      urgency: 'medium',
      serviceType: 'on-site',
      rating: 4.6,
      reviews: 89,
      postedBy: 'David K.',
      postedTime: '4 hours ago',
      skills: ['Airport Transfers', 'Punctual']
    },
    {
      id: 5,
      title: 'Deep House Cleaning',
      description: 'Moving out cleaning service needed. 3-bedroom apartment, all rooms and appliances.',
      category: 'cleaner',
      location: 'Brooklyn',
      coordinates: { lat: 40.6782, lng: -73.9442 },
      budget: 300,
      timeEstimate: '4-6 hours',
      urgency: 'low',
      serviceType: 'on-site',
      rating: 4.8,
      reviews: 156,
      postedBy: 'Lisa P.',
      postedTime: '6 hours ago',
      skills: ['Deep Cleaning', 'Move-out Specialist']
    },
    {
      id: 6,
      title: 'Private Dinner Cooking',
      description: 'Looking for experienced cook for intimate dinner party. Italian cuisine preferred.',
      category: 'cook',
      location: 'Manhattan',
      coordinates: { lat: 40.7831, lng: -73.9712 },
      budget: 250,
      timeEstimate: '3-4 hours',
      urgency: 'medium',
      serviceType: 'on-site',
      rating: 4.9,
      reviews: 34,
      postedBy: 'Robert T.',
      postedTime: '8 hours ago',
      skills: ['Italian Cuisine', 'Private Events']
    }
  ];

  export const CATEGORIES = [
    { value: 'all', label: 'All Categories', icon: Search },
    { value: 'electrician', label: 'Electricians', icon: Wrench },
    { value: 'plumber', label: 'Plumbers', icon: Paintbrush },
    { value: 'driver', label: 'Drivers', icon: Car },
    { value: 'cook', label: 'Cooks', icon: ChefHat },
    { value: 'seamstress', label: 'Seamstress', icon: Scissors },
    { value: 'cleaner', label: 'Cleaners', icon: Lightbulb },
  ];

  export const LOCATIONS = [
    { value: 'all', label: 'All Locations' },
    { value: 'downtown', label: 'Downtown' },
    { value: 'midtown', label: 'Midtown' },
    { value: 'uptown', label: 'Uptown' },
    { value: 'brooklyn', label: 'Brooklyn' },
    { value: 'airport', label: 'Airport Area' },
  ];
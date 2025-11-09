import dotenv from 'dotenv';
import connectDB from './src/config/db.js';
import User from './src/models/User.js';
import Suggestion from './src/models/Suggestion.js';

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Suggestion.deleteMany({});

    console.log('Creating users...');

    // Create users
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@suggestify.com',
      password: 'password123',
      role: 'admin'
    });

    const manager = await User.create({
      name: 'Manager User',
      email: 'manager@suggestify.com',
      password: 'password123',
      role: 'manager'
    });

    const employee = await User.create({
      name: 'Alice Employee',
      email: 'alice@suggestify.com',
      password: 'password123',
      role: 'employee'
    });

    console.log('Users created:', { admin: admin.email, manager: manager.email, employee: employee.email });

    // Create additional employees for variety
    const employee2 = await User.create({
      name: 'Bob Employee',
      email: 'bob@suggestify.com',
      password: 'password123',
      role: 'employee'
    });

    const employee3 = await User.create({
      name: 'Charlie Employee',
      email: 'charlie@suggestify.com',
      password: 'password123',
      role: 'employee'
    });

    console.log('Creating suggestions...');

    const suggestions = [
      {
        title: 'Implement flexible work hours',
        description: 'Allow employees to choose their working hours between 7 AM and 7 PM to improve work-life balance and productivity.',
        author: employee._id,
        tags: ['work-life', 'productivity', 'hr'],
        status: 'Approved',
        upvotesCount: 15,
        upvoters: [admin._id, manager._id, employee2._id, employee3._id]
      },
      {
        title: 'Add standing desks to office',
        description: 'Provide standing desk options to promote better posture and reduce health issues from prolonged sitting.',
        author: employee2._id,
        tags: ['health', 'office', 'wellness'],
        status: 'Under Review',
        upvotesCount: 8,
        upvoters: [employee._id, manager._id, employee3._id]
      },
      {
        title: 'Upgrade coffee machine',
        description: 'The current coffee machine is outdated. A new one would improve employee satisfaction and productivity.',
        author: employee._id,
        tags: ['office', 'amenities'],
        status: 'Implemented',
        upvotesCount: 12,
        upvoters: [admin._id, manager._id, employee2._id, employee3._id]
      },
      {
        title: 'Monthly team building activities',
        description: 'Organize monthly team building events to strengthen team bonds and improve collaboration.',
        author: employee3._id,
        tags: ['team', 'culture', 'engagement'],
        status: 'New',
        upvotesCount: 5,
        upvoters: [employee._id, employee2._id]
      },
      {
        title: 'Implement code review process',
        description: 'Establish a mandatory code review process to improve code quality and knowledge sharing.',
        author: manager._id,
        tags: ['development', 'quality', 'process'],
        status: 'Approved',
        upvotesCount: 10,
        upvoters: [admin._id, employee._id, employee2._id, employee3._id]
      },
      {
        title: 'Add more parking spaces',
        description: 'The parking lot is often full. Adding more spaces would reduce stress for employees.',
        author: employee2._id,
        tags: ['facilities', 'logistics'],
        status: 'New',
        upvotesCount: 7,
        upvoters: [employee._id, employee3._id]
      },
      {
        title: 'Remote work policy update',
        description: 'Update the remote work policy to allow 2-3 days per week for eligible positions.',
        author: employee._id,
        tags: ['policy', 'remote-work', 'hr'],
        status: 'Under Review',
        upvotesCount: 20,
        upvoters: [admin._id, manager._id, employee2._id, employee3._id]
      },
      {
        title: 'Improve cafeteria menu',
        description: 'Add more healthy and diverse options to the cafeteria menu.',
        author: employee3._id,
        tags: ['food', 'health', 'amenities'],
        status: 'New',
        upvotesCount: 9,
        upvoters: [employee._id, employee2._id]
      },
      {
        title: 'Quarterly performance reviews',
        description: 'Switch from annual to quarterly performance reviews for more frequent feedback.',
        author: manager._id,
        tags: ['hr', 'performance', 'feedback'],
        status: 'Approved',
        upvotesCount: 6,
        upvoters: [admin._id, employee._id]
      },
      {
        title: 'Add bike storage area',
        description: 'Create a secure bike storage area to encourage eco-friendly commuting.',
        author: employee2._id,
        tags: ['sustainability', 'facilities', 'environment'],
        status: 'New',
        upvotesCount: 4,
        upvoters: [employee3._id]
      },
      {
        title: 'Implement mentorship program',
        description: 'Create a mentorship program pairing junior and senior employees for knowledge transfer.',
        author: admin._id,
        tags: ['development', 'culture', 'learning'],
        status: 'Implemented',
        upvotesCount: 14,
        upvoters: [manager._id, employee._id, employee2._id, employee3._id]
      },
      {
        title: 'Add quiet zones in office',
        description: 'Designate quiet zones for focused work without distractions.',
        author: employee._id,
        tags: ['office', 'productivity', 'workspace'],
        status: 'Under Review',
        upvotesCount: 11,
        upvoters: [manager._id, employee2._id, employee3._id]
      }
    ];

    await Suggestion.insertMany(suggestions);

    console.log(`Created ${suggestions.length} suggestions`);

    console.log('\n✅ Seed data created successfully!');
    console.log('\nSample credentials:');
    console.log('Admin: admin@suggestify.com / password123');
    console.log('Manager: manager@suggestify.com / password123');
    console.log('Employee: alice@suggestify.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();


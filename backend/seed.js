const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Candidate = require("./models/vote.model");
const User = require("./models/user.model");

dotenv.config();

const seedDatabase = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.DATABASE_URI);
    console.log("Connected to database for seeding");

    // Clear existing data
    await Candidate.deleteMany({});
    console.log("Cleared existing candidates");

    // Indian names and default avatars
    const indianNamesMale = [
      "Aarav Sharma", "Vivaan Patel", "Aditya Singh", "Vihaan Reddy", "Arjun Mehra",
      "Reyansh Gupta", "Krishna Nair", "Ishaan Joshi", "Dhruv Choudhary", "Kabir Verma"
    ];
    const indianNamesFemale = [
      "Ananya Iyer", "Diya Kapoor", "Aadhya Jain", "Myra Desai", "Ira Agarwal",
      "Kiara Bhat", "Saanvi Pillai", "Pari Rao", "Aarohi Shah", "Navya Menon"
    ];
    const defaultAvatars = [
      "https://i.ibb.co/0Jmshvb/avatar1.png",
      "https://i.ibb.co/6WZy7yB/avatar2.png",
      "https://i.ibb.co/3yqQw1p/avatar3.png"
    ];
    function getRandomAvatar() {
      return defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)];
    }
    const categories = [
      "Volleyball Secretary Boys",
      "Volleyball Secretary Girls",
      "Cricket Secretary",
      "Indoor Games Secretary",
      "Overall Sports Secretary"
    ];
    // 2-3 candidates per category/gender
    const initialCandidates = [];
    categories.forEach(category => {
      // Boys
      for (let i = 0; i < 3; i++) {
        initialCandidates.push({
          name: indianNamesMale[(i + categories.indexOf(category)) % indianNamesMale.length],
          gender: "Male",
          sportCategory: category,
          photo: getRandomAvatar(),
          votes: 0
        });
      }
      // Girls
      for (let i = 0; i < 3; i++) {
        initialCandidates.push({
          name: indianNamesFemale[(i + categories.indexOf(category)) % indianNamesFemale.length],
          gender: "Female",
          sportCategory: category,
          photo: getRandomAvatar(),
          votes: 0
        });
      }
    });

    // Insert candidates
    const createdCandidates = await Candidate.insertMany(initialCandidates);
    console.log(`Created ${createdCandidates.length} initial candidates`);

    // Create a default admin user if none exists
    const existingAdmin = await User.findOne({ role: "admin" });
    if (!existingAdmin) {
      const adminUser = await User.create({
        username: "admin",
        email: "admin@college.edu",
        password: "admin123",
        role: "admin",
      });
      console.log("Created default admin user: admin@college.edu / admin123");
    }

    // Create a demo student user
    const existingStudent = await User.findOne({ email: "student@college.edu" });
    if (!existingStudent) {
      const studentUser = await User.create({
        username: "student",
        email: "student@college.edu",
        password: "student123",
        role: "user",
      });
      console.log("Created demo student user: student@college.edu / student123");
    }

    console.log("Database seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();

